/**
 * 图片生成服务
 *
 * 基于 OpenRouter 的多模态图片生成 API 实现
 * 支持的模型：google/gemini-3.1-flash-image-preview
 *
 * 功能：
 * - 简单换装 (simple-tryon): 将服装应用到模特身上
 * - 固定人脸换装 (fixed-face-tryon): 换装同时保留指定人脸
 * - 固定人脸背景换装 (fixed-face-bg-tryon): 换装同时保留指定人脸和背景
 * - 固定人脸背景姿势换装 (fixed-face-bg-pose-tryon): 换装同时保留指定人脸、背景和姿势
 * - 姿势分解 (pose-fission): 从源图片生成多个姿势变体
 */

import "dotenv/config";
import { s3UploadService } from "./s3.js";

/**
 * 图片生成输入参数
 */
export interface ImageGenerateInput {
  /** 组合类型ID，决定使用哪种换装/生成逻辑 */
  combinationTypeId: string;
  /** 槽位内容，key 为槽位ID，value 包含图片URL或文本 */
  slotContents: Record<string, { imageUrl?: string | null; text?: string | null }>;
  /** 生成设置 */
  settings: {
    /** 提示词（当前由服务端独立生成，此参数暂不使用） */
    prompt?: string;
    /** 输出分辨率 */
    resolution: { width: number; height: number };
    /** 模型名称（可选，默认使用 gemini-3.1-flash-image-preview） */
    model?: string;
  };
}

/**
 * 图片生成结果
 */
export interface ImageGenerateResult {
  /** 是否成功 */
  success: boolean;
  /** 生成的图片URL（成功时返回） */
  imageUrl?: string;
  /** 错误信息（失败时返回） */
  error?: string;
}

/**
 * 换装输入参数（扩展 ImageGenerateInput）
 */
interface TryOnInput extends ImageGenerateInput {
  /** 模特图片URL（可选，某些类型需要） */
  modelImage?: string;
  /** 服装图片URL（可选，某些类型需要） */
  clothingImage?: string;
}

/**
 * 图片服务类
 *
 * 处理所有图片生成相关的业务逻辑
 */
class ImageService {
  /** OpenRouter API 地址 */
  private readonly OPENROUTER_API_URL = "https://openrouter.ai/api/v1";

  /** 默认图片生成模型 */
  private readonly IMAGE_MODEL = "google/gemini-3.1-flash-image-preview";

  /**
   * 主生成方法
   * 根据 combinationTypeId 分发到对应的处理方法
   *
   * @param input - 图片生成输入参数
   * @returns 生成结果，包含成功状态和图片URL或错误信息
   */
  async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    try {
      // 验证输入参数
      const validationError = this.validateInput(input);
      if (validationError) {
        console.error(`[图片服务] 输入验证失败: ${validationError}`);
        return { success: false, error: validationError };
      }

      console.log(`[图片服务] 开始处理生成请求，类型: ${input.combinationTypeId}`);

      // 根据组合类型分发处理
      switch (input.combinationTypeId) {
        case "simple-tryon":
          return this.handleSimpleTryon(input);
        case "fixed-face-tryon":
          return this.handleFixedFaceTryon(input);
        case "fixed-face-bg-tryon":
          return this.handleFixedFaceBgTryon(input);
        case "fixed-face-bg-pose-tryon":
          return this.handleFixedFaceBgPoseTryon(input);
        case "pose-fission":
          return this.handlePoseFission(input);
        default:
          console.error(`[图片服务] 不支持的组合类型: ${input.combinationTypeId}`);
          return { success: false, error: `不支持的组合类型: ${input.combinationTypeId}` };
      }
    } catch (error) {
      console.error(`[图片服务] 生成过程异常:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      };
    }
  }

  /**
   * 验证输入参数
   * 检查必填槽位是否都已提供
   *
   * @param input - 输入参数
   * @returns 验证错误信息，null 表示验证通过
   */
  private validateInput(input: ImageGenerateInput): string | null {
    const { combinationTypeId, slotContents } = input;

    // 各组合类型需要的必填槽位
    const requiredSlots: Record<string, string[]> = {
      "simple-tryon": ["model", "clothing"],
      "fixed-face-tryon": ["model", "face", "clothing"],
      "fixed-face-bg-tryon": ["model", "face", "background", "clothing"],
      "fixed-face-bg-pose-tryon": ["model", "face", "background", "pose", "clothing"],
      "pose-fission": ["source"],
    };

    // 检查组合类型是否支持
    const required = requiredSlots[combinationTypeId];
    if (!required) {
      return `不支持的组合类型: ${combinationTypeId}`;
    }

    // 检查每个必填槽位是否有图片
    for (const slotId of required) {
      const content = slotContents[slotId];
      if (!content?.imageUrl) {
        console.warn(`[图片服务] 缺少必填槽位: ${slotId}`);
        return `缺少必填槽位: ${slotId}`;
      }
    }

    return null;
  }

  /**
   * 处理简单换装
   * 将服装应用到模特身上，保持模特原有的姿势、脸型和体型
   */
  private async handleSimpleTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;
    const modelImage = slotContents.model?.imageUrl;
    const clothingImage = slotContents.clothing?.imageUrl;

    if (!modelImage || !clothingImage) {
      return { success: false, error: "缺少模特或服装图片" };
    }

    console.log(`[图片服务] 开始简单换装处理`);

    try {
      const resultImageUrl = await this.callTryOnAPI({
        combinationTypeId: "simple-tryon",
        slotContents,
        settings: input.settings,
        modelImage,
        clothingImage,
      });

      // 上传到 S3（如果已配置）
      const uploadedUrl = await this.uploadToS3IfNeeded(resultImageUrl);
      console.log(`[图片服务] 简单换装完成，输出图片: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[图片服务] 简单换装失败:`, error);
      return { success: false, error: error instanceof Error ? error.message : "换装失败" };
    }
  }

  /**
   * 处理固定人脸换装
   * 换装同时保留指定的人脸，使用第一张图作为身份参考
   */
  private async handleFixedFaceTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    console.log(`[图片服务] 开始固定人脸换装处理`);

    try {
      const resultImageUrl = await this.callTryOnAPI({
        combinationTypeId: "fixed-face-tryon",
        slotContents,
        settings: input.settings,
      });

      const uploadedUrl = await this.uploadToS3IfNeeded(resultImageUrl);
      console.log(`[图片服务] 固定人脸换装完成，输出图片: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[图片服务] 固定人脸换装失败:`, error);
      return { success: false, error: error instanceof Error ? error.message : "换装失败" };
    }
  }

  /**
   * 处理固定人脸背景换装
   * 换装同时保留指定的人脸和背景
   */
  private async handleFixedFaceBgTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    console.log(`[图片服务] 开始固定人脸背景换装处理`);

    try {
      const resultImageUrl = await this.callTryOnAPI({
        combinationTypeId: "fixed-face-bg-tryon",
        slotContents,
        settings: input.settings,
      });

      const uploadedUrl = await this.uploadToS3IfNeeded(resultImageUrl);
      console.log(`[图片服务] 固定人脸背景换装完成，输出图片: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[图片服务] 固定人脸背景换装失败:`, error);
      return { success: false, error: error instanceof Error ? error.message : "换装失败" };
    }
  }

  /**
   * 处理固定人脸背景姿势换装
   * 换装同时保留指定的人脸、背景和姿势
   */
  private async handleFixedFaceBgPoseTryon(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;

    console.log(`[图片服务] 开始固定人脸背景姿势换装处理`);

    try {
      const resultImageUrl = await this.callTryOnAPI({
        combinationTypeId: "fixed-face-bg-pose-tryon",
        slotContents,
        settings: input.settings,
      });

      const uploadedUrl = await this.uploadToS3IfNeeded(resultImageUrl);
      console.log(`[图片服务] 固定人脸背景姿势换装完成，输出图片: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[图片服务] 固定人脸背景姿势换装失败:`, error);
      return { success: false, error: error instanceof Error ? error.message : "换装失败" };
    }
  }

  /**
   * 处理姿势分解
   * 从源图片生成多个不同的姿势变体
   */
  private async handlePoseFission(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    const { slotContents } = input;
    const sourceImage = slotContents.source?.imageUrl;

    if (!sourceImage) {
      return { success: false, error: "缺少源图片" };
    }

    console.log(`[图片服务] 开始姿势分解处理`);

    try {
      const resultImageUrl = await this.callPoseFissionAPI({
        combinationTypeId: "pose-fission",
        slotContents,
        settings: input.settings,
      });

      const uploadedUrl = await this.uploadToS3IfNeeded(resultImageUrl);
      console.log(`[图片服务] 姿势分解完成，输出图片: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[图片服务] 姿势分解失败:`, error);
      return { success: false, error: error instanceof Error ? error.message : "姿势分解失败" };
    }
  }

  /**
   * 检查 API Key 是否已正确配置
   * 排除 placeholder 值
   */
  private isApiKeyConfigured(): boolean {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const isValid = !!(apiKey && apiKey !== "your_api_key_here" && apiKey.trim().length > 0);
    if (!isValid) {
      console.warn(`[图片服务] OpenRouter API Key 未配置或为占位符`);
    }
    return isValid;
  }

  /**
   * 调用 OpenRouter 图片生成 API（换装）
   *
   * @param input - 换装输入参数
   * @returns 生成的图片URL
   * @throws API 调用失败或未返回图片时抛出异常
   */
  private async callTryOnAPI(input: TryOnInput): Promise<string> {
    // 检查 API Key 配置
    if (!this.isApiKeyConfigured()) {
      throw new Error("OpenRouter API Key 未配置，请检查环境变量 OPENROUTER_API_KEY");
    }

    const apiKey = process.env.OPENROUTER_API_KEY!;
    const { combinationTypeId, slotContents, settings } = input;

    // 构建提示词（服务端独立生成）
    const prompt = this.buildTryOnPrompt(combinationTypeId, slotContents);
    console.log(`[图片服务] 生成提示词 [${combinationTypeId}]: ${prompt}`);

    // 收集所有图片 URL
    const imageParts: { slotId: string; url: string }[] = [];
    for (const [slotId, content] of Object.entries(slotContents)) {
      if (content?.imageUrl) {
        imageParts.push({ slotId, url: content.imageUrl });
        console.log(`[图片服务] 槽位 ${slotId}: ${content.imageUrl.substring(0, 80)}...`);
      }
    }

    if (imageParts.length === 0) {
      throw new Error("没有提供任何图片");
    }

    // 确定使用的模型
    const model = settings.model || this.IMAGE_MODEL;
    console.log(`[图片服务] 使用模型: ${model}`);

    // 构建请求体
    const requestBody = {
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            ...imageParts.map(({ url }) => ({
              type: "image_url",
              image_url: { url },
            })),
          ],
        },
      ],
      // 指定输出为图片和文本
      modalities: ["image", "text"] as const,
      max_tokens: 4096,
    };

    console.log(`[图片服务] 发送请求到 OpenRouter，图片数量: ${imageParts.length}`);

    // 调用 OpenRouter API
    const response = await fetch(this.OPENROUTER_API_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3001",
        "X-Title": "Joii Canvas",
      },
      body: JSON.stringify(requestBody),
    });

    // 处理 API 错误
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[图片服务] OpenRouter API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`图片生成请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[图片服务] 收到 OpenRouter 响应`);

    // 从响应中提取图片
    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      console.error(`[图片服务] 响应中未找到图片`);
      throw new Error("图片生成成功但未能提取图片");
    }

    console.log(`[图片服务] 成功提取图片: ${imageUrl.substring(0, 80)}...`);
    return imageUrl;
  }

  /**
   * 调用 OpenRouter 图片生成 API（姿势分解）
   */
  private async callPoseFissionAPI(input: ImageGenerateInput): Promise<string> {
    if (!this.isApiKeyConfigured()) {
      throw new Error("OpenRouter API Key 未配置，请检查环境变量 OPENROUTER_API_KEY");
    }

    const apiKey = process.env.OPENROUTER_API_KEY!;
    const { slotContents, settings } = input;
    const sourceImage = slotContents.source?.imageUrl;

    if (!sourceImage) {
      throw new Error("缺少源图片");
    }

    const prompt =
      "You are an expert fashion stylist. Generate 5 different natural pose variations of the person in the image. Each pose should be unique and realistic. Only output the final result images, no additional text or description.";

    console.log(`[图片服务] 姿势分解提示词: ${prompt}`);
    console.log(`[图片服务] 源图片: ${sourceImage.substring(0, 80)}...`);

    const model = settings.model || this.IMAGE_MODEL;
    console.log(`[图片服务] 使用模型: ${model}`);

    const requestBody = {
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: sourceImage } },
          ],
        },
      ],
      modalities: ["image", "text"] as const,
      max_tokens: 4096,
    };

    console.log(`[图片服务] 发送姿势分解请求到 OpenRouter`);

    const response = await fetch(this.OPENROUTER_API_URL + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:3001",
        "X-Title": "Joii Canvas",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[图片服务] OpenRouter 姿势分解 API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`姿势分解请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[图片服务] 收到 OpenRouter 姿势分解响应`);

    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      console.error(`[图片服务] 姿势分解响应中未找到图片`);
      throw new Error("姿势分解成功但未能提取图片");
    }

    console.log(`[图片服务] 成功提取姿势分解图片: ${imageUrl.substring(0, 80)}...`);
    return imageUrl;
  }

  /**
   * 根据组合类型构建换装提示词
   * 提示词由服务端独立生成，不使用前端传入的 prompt
   */
  private buildTryOnPrompt(
    combinationTypeId: string,
    slotContents: Record<string, { imageUrl?: string | null; text?: string | null }>
  ): string {
    const slotList = Object.keys(slotContents).filter((k) => slotContents[k]?.imageUrl);

    const prompts: Record<string, string> = {
      "simple-tryon":
        "You are an expert fashion stylist. Take the person from the first image and apply the clothing from the second image to them. The person should keep their natural pose, face, and body shape. The final image must look realistic, as if the person is genuinely wearing that clothing item. Important: Only output the final result image, no additional text or description.",
      "fixed-face-tryon":
        "You are an expert fashion stylist. Use the first image as reference for the person's identity. Apply the clothing from the third image to them while preserving the face from the second image. Maintain the natural pose and ensure a realistic appearance. Only output the final result image.",
      "fixed-face-bg-tryon":
        "You are an expert fashion stylist. Using the first image as reference: preserve the face from the second image, keep the background from the third image, and apply the clothing from the fourth image. Maintain the same pose and create a realistic, natural-looking composition. Only output the final result image.",
      "fixed-face-bg-pose-tryon":
        "You are an expert fashion stylist. Using the first image as reference: preserve the face from the second image, keep the background from the third image, use the pose from the fourth image, and apply the clothing from the fifth image. Create a natural, realistic result that looks like one coherent image. Only output the final result image.",
    };

    const prompt = prompts[combinationTypeId] || prompts["simple-tryon"];
    console.log(`[图片服务] 槽位列表 (${slotList.length}): ${slotList.join(", ")}`);

    return prompt;
  }

  /**
   * 从 OpenRouter 响应中提取图片URL
   * 支持多种响应格式
   */
  private extractImageFromResponse(data: any): string | null {
    try {
      // 获取消息内容
      const message = data?.choices?.[0]?.message;
      if (!message) {
        console.warn(`[图片服务] 响应中缺少 message 字段`);
        return null;
      }

      // 格式1: message.images 数组 (Gemini 模型常用格式)
      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageUrl = message.images[0].image_url?.url;
        if (imageUrl) {
          console.log(`[图片服务] 从 message.images 提取到图片`);
          return imageUrl;
        }
      }

      // 格式2: message.content 字符串，需要解析其中的 URL 或 base64
      const content = message.content;
      if (typeof content === "string") {
        // 尝试提取 URL
        const jsonMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
        if (jsonMatch) {
          console.log(`[图片服务] 从 content 字符串中提取到 URL`);
          return jsonMatch[1];
        }
        // 尝试提取 base64
        const base64Match = content.match(/"base64"\s*:\s*"([^"]+)"/);
        if (base64Match) {
          console.log(`[图片服务] 从 content 字符串中提取到 base64 图片`);
          return `data:image/png;base64,${base64Match[1]}`;
        }
      }

      // 格式3: message.content 数组
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === "image_url" && part.image_url?.url) {
            console.log(`[图片服务] 从 content 数组中提取到 image_url`);
            return part.image_url.url;
          }
          if (part?.type === "image" && part.data) {
            console.log(`[图片服务] 从 content 数组中提取到 image data`);
            return part.data.startsWith("data:") ? part.data : `data:image/png;base64,${part.data}`;
          }
        }
      }

      console.warn(`[图片服务] 无法从响应结构中提取图片`);
      console.log(`[图片服务] 响应结构: ${JSON.stringify(data).substring(0, 500)}`);
      return null;
    } catch (error) {
      console.error(`[图片服务] 提取图片时发生异常:`, error);
      return null;
    }
  }

  /**
   * 将图片上传到 S3（如果需要）
   * 如果图片已经是 S3 或 CDN URL，则直接返回
   * 如果是 data URL 或 blob URL，也直接返回
   */
  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    // 检查 S3 服务是否配置
    if (!s3UploadService.isConfigured()) {
      console.log(`[图片服务] S3 服务未配置，直接返回图片URL`);
      return imageUrl;
    }

    // 直接返回 data URL 或 blob URL
    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      console.log(`[图片服务] 检测到 data/blob URL，直接返回`);
      return imageUrl;
    }

    // 检查是否已经是 S3 或 CDN URL
    const cdnDomain = this.getCdnDomain();
    if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
      console.log(`[图片服务] 图片已在 S3/CDN，直接返回`);
      return imageUrl;
    }

    // 上传外部 URL 图片到 S3
    console.log(`[图片服务] 正在上传图片到 S3...`);
    const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");

    if (result.success && result.url) {
      console.log(`[图片服务] 图片上传成功: ${result.url}`);
      return result.url;
    }

    console.warn(`[图片服务] 图片上传失败，返回原始 URL: ${imageUrl}`);
    return imageUrl;
  }

  /**
   * 获取 CDN 域名
   */
  private getCdnDomain(): string {
    return process.env.BITIFUL_CDN_URL || "";
  }
}

// 导出单例实例
export const imageService = new ImageService();
