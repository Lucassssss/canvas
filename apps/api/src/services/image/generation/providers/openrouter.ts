/**
 * OpenRouter 图片生成服务商适配器
 *
 * 基于 OpenRouter API 的多模态图片生成实现
 * 支持的模型：google/gemini-3.1-flash-image-preview
 */

import "dotenv/config";
import { BaseProvider } from "./base.js";
import {
  GenerationOptions,
  GenerationResult,
  GenerationMode,
  ImageGenerateInput,
  SlotContent,
} from "../../types.js";
import { PromptBuilder } from "../prompts/builder.js";
import { s3UploadService } from "../../../s3.js";

/**
 * OpenRouter 服务商配置
 */
const OPENROUTER_API_URL = process.env.OPENROUTER_API_BASE_URL;

const image_size = '1k'
// const image_size = '2k'
// const image_size = '4k'
// ----------------------------------------------------------


/** 
 * 单图 8分，多图8分，4K图超强
 * 价格：￥0.48-￥1.06(2k-4k)
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/90a4b220-b382-4c2d-ad70-acf74cb1e851.png,https://d-assets-cn.joii.cc/ai-generated/b0c07b7e-e9d7-4d55-8dee-988ffe1c9b26.png
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/e6f5c6a5-8de8-48ec-999d-708408e44ef7.png
 * 4k: https://d-assets-cn.joii.cc/ai-generated/bcbbb83d-2493-499c-8c3a-24f5917947ef.png
**/
// const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview";

/** 
 * 单图 6分，多图未遵循关键词，只给了单图，不支持4k
 * 价格：￥0.0012-￥0.54-￥1.34(2k)
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/11c14d69-d010-44f5-848d-1bc8228c3d53.png
**/
const DEFAULT_MODEL = "google/gemini-2.5-flash-image";

/** 
 * 单图 9分，多图9分，完美
 * 价格：￥0.95-￥1.69(2k-4k)
 * 单图2k：https://d-assets-cn.joii.cc/ai-generated/51a0d894-a696-4af9-9cb6-2ce62ed9deb3.png
 * 多图4k: https://d-assets-cn.joii.cc/ai-generated/b4b9b57d-6596-452e-b17d-8fa283bbd5fa.png
 * 单图4k: https://d-assets-cn.joii.cc/ai-generated/7001aabd-18b2-4765-aecd-57cac68e498a.png
**/
// const DEFAULT_MODEL = "google/gemini-3-pro-image-preview";


/** 多图性能一般，不支持4k, 单图发虚
 * 价格：￥0.14
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/8fcfd2bf-96a2-4ad1-99fa-3dd2f5d0252d.png
**/
// const DEFAULT_MODEL = "sourceful/riverflow-v2-fast";

/** 多图性能尚可，支持4k
 * 价格：￥1.04(2k)
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/50b95b63-ba9b-4523-91e3-0d1f666d714e.png
**/
// const DEFAULT_MODEL = "sourceful/riverflow-v2-pro";


/** 单图换装可能出现服装没换成功问题，多图变形3条腿。
* 价格：￥0.10
* 生成图：https://d-assets-cn.joii.cc/ai-generated/912489d7-0dee-49ae-86ce-51fc65928ce4.png
**/
// const DEFAULT_MODEL = "black-forest-labs/flux.2-klein-4b";

/** 多图、单图性能优秀，多图提示词5张给了3张
 * 价格：￥0.69-￥1.31(2k)
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/71ed7136-20b7-4b1b-a247-5ec55bfed5df.png
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/847cad0e-1105-424d-abb7-9f0fa08efd4d.png
 * 
**/
// const DEFAULT_MODEL = "black-forest-labs/flux.2-max";

/** 
 * 单图完全不听提示词，多图7分
 * 价格：￥0.28(2k)
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/71ed7136-20b7-4b1b-a247-5ec55bfed5df.png
 * 生成图：https://d-assets-cn.joii.cc/ai-generated/847cad0e-1105-424d-abb7-9f0fa08efd4d.png
 * 
**/
// const DEFAULT_MODEL = "bytedance-seed/seedream-4.5";

// ----------------------------------------------------------

/**
 * OpenRouter 图片生成服务商
 * 继承 BaseProvider，实现 OpenRouter API 调用逻辑
 */
export class OpenRouterProvider extends BaseProvider {
  /** 服务商唯一标识 */
  readonly id = "openrouter";

  /** 服务商名称 */
  readonly name = "OpenRouter";

  /** 当前使用模型 */
  readonly model = DEFAULT_MODEL;

  /** 支持的生成模式 */
  readonly supportedModes: GenerationMode[] = [
    GenerationMode.SIMPLE_TRYON,
    GenerationMode.FIXED_FACE_TRYON,
    GenerationMode.FIXED_FACE_BG_TRYON,
    GenerationMode.FIXED_FACE_BG_POSE_TRYON,
    GenerationMode.POSE_FISSION,
  ];

  /** 提示词构建器 */
  private promptBuilder: PromptBuilder;

  constructor() {
    super();
    this.promptBuilder = new PromptBuilder();
  }

  /**
   * 生成图片
   * 根据生成模式调用不同的处理逻辑
   */
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { mode, slotContents, settings } = options;

    console.log(`[OpenRouter服务商] 开始生成图片，模式: ${mode}`);

    try {
      // 验证 API Key
      if (!this.isApiKeyConfigured()) {
        return {
          success: false,
          error: "OpenRouter API Key 未配置，请检查环境变量 OPENROUTER_API_KEY",
        };
      }

      // 根据模式调用不同的处理方法
      let imageUrl: string;
      switch (mode) {
        case GenerationMode.POSE_FISSION:
          imageUrl = await this.callPoseFissionAPI(slotContents, settings);
          break;
        default:
          imageUrl = await this.callTryOnAPI(mode, slotContents, settings);
      }

      // 上传到 S3（如果需要）
      const uploadedUrl = await this.uploadToS3IfNeeded(imageUrl);

      console.log(`[OpenRouter服务商] 生成成功: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[OpenRouter服务商] 生成失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "图片生成失败",
      };
    }
  }

  /**
   * 调用换装 API
   */
  private async callTryOnAPI(
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: { model?: string }
  ): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY!;

    // 构建提示词
    const prompt = this.promptBuilder.build(mode, slotContents);
    console.log(`[OpenRouter服务商] 生成提示词: ${prompt.substring(0, 100)}...`);

    // 收集图片
    const imageParts: { slotId: string; url: string }[] = [];
    for (const [slotId, content] of Object.entries(slotContents)) {
      if (content?.imageUrl) {
        imageParts.push({ slotId, url: content.imageUrl });
        console.log(`[OpenRouter服务商] 槽位 ${slotId}: ${content.imageUrl.substring(0, 80)}...`);
      }
    }

    if (imageParts.length === 0) {
      throw new Error("没有提供任何图片");
    }

    const model = settings.model || DEFAULT_MODEL;
    console.log(`[OpenRouter服务商] 使用模型: ${model}`);

    // 构建请求
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
      // modalities: ["image", "text"] as const,
      modalities: ["image"] as const,
      // max_tokens: 4096,
      image_config: {
        aspect_ratio: '9:16',
        image_size: image_size,
      }
    };

    console.log(`[OpenRouter服务商] 发送请求到 OpenRouter，图片数量: ${imageParts.length}`);

    // 调用 API
    const response = await fetch(OPENROUTER_API_URL + "/chat/completions", {
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
      console.error(`[OpenRouter服务商] API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`图片生成请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[OpenRouter服务商] 收到 OpenRouter 响应`);

    // 提取图片
    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      throw new Error("图片生成成功但未能提取图片");
    }

    return imageUrl;
  }

  /**
   * 调用姿势分解 API
   */
  private async callPoseFissionAPI(
    slotContents: Record<string, SlotContent>,
    settings: { model?: string }
  ): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY!;
    const sourceImage = slotContents.source?.imageUrl;

    if (!sourceImage) {
      throw new Error("缺少源图片");
    }

    const prompt = this.promptBuilder.build(GenerationMode.POSE_FISSION, slotContents);
    const model = settings.model || DEFAULT_MODEL;

    console.log(`[OpenRouter服务商] 姿势分解提示词: ${prompt.substring(0, 100)}...`);
    console.log(`[OpenRouter服务商] 源图片: ${sourceImage.substring(0, 80)}...`);

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
      image_config: {
        aspect_ratio: '9:16',
        image_size: image_size,
      },
      // modalities: ["image", "text"] as const,
      modalities: ["image"] as const,
      // max_tokens: 4096,
    };

    const response = await fetch(OPENROUTER_API_URL + "/chat/completions", {
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
      console.error(`[OpenRouter服务商] 姿势分解 API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`姿势分解请求失败: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      throw new Error("姿势分解成功但未能提取图片");
    }

    return imageUrl;
  }

  /**
   * 从响应中提取图片 URL
   */
  private extractImageFromResponse(data: any): string | null {
    try {
      const message = data?.choices?.[0]?.message;
      if (!message) {
        console.warn(`[OpenRouter服务商] 响应中缺少 message 字段`);
        return null;
      }

      // 格式1: message.images 数组
      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageUrl = message.images[0].image_url?.url;
        if (imageUrl) {
          console.log(`[OpenRouter服务商] 从 message.images 提取到图片`);
          return imageUrl;
        }
      }

      // 格式2: message.content 字符串
      const content = message.content;
      if (typeof content === "string") {
        const jsonMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
        if (jsonMatch) {
          console.log(`[OpenRouter服务商] 从 content 字符串中提取到 URL`);
          return jsonMatch[1];
        }
        const base64Match = content.match(/"base64"\s*:\s*"([^"]+)"/);
        if (base64Match) {
          console.log(`[OpenRouter服务商] 从 content 字符串中提取到 base64 图片`);
          return `data:image/png;base64,${base64Match[1]}`;
        }
      }

      // 格式3: message.content 数组
      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === "image_url" && part.image_url?.url) {
            console.log(`[OpenRouter服务商] 从 content 数组中提取到 image_url`);
            return part.image_url.url;
          }
          if (part?.type === "image" && part.data) {
            console.log(`[OpenRouter服务商] 从 content 数组中提取到 image data`);
            return part.data.startsWith("data:") ? part.data : `data:image/png;base64,${part.data}`;
          }
        }
      }

      console.warn(`[OpenRouter服务商] 无法从响应结构中提取图片`);
      return null;
    } catch (error) {
      console.error(`[OpenRouter服务商] 提取图片时发生异常:`, error);
      return null;
    }
  }

  /**
   * 上传到 S3（如果需要）
   */
  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    if (!s3UploadService.isConfigured()) {
      console.log(`[OpenRouter服务商] S3 服务未配置，直接返回图片URL`);
      return imageUrl;
    }

    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      console.log(`[OpenRouter服务商] 检测到 data/blob URL，需要上传到 S3`);
      const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");
      if (result.success && result.url) {
        console.log(`[OpenRouter服务商] data URL 上传成功: ${result.url}`);
        return result.url;
      }
      console.warn(`[OpenRouter服务商] data URL 上传失败，返回原始 URL`);
      return imageUrl;
    }

    const cdnDomain = process.env.BITIFUL_CDN_URL || "";
    if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
      console.log(`[OpenRouter服务商] 图片已在 S3/CDN，直接返回`);
      return imageUrl;
    }

    console.log(`[OpenRouter服务商] 正在上传图片到 S3...`);
    const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");

    if (result.success && result.url) {
      console.log(`[OpenRouter服务商] 图片上传成功: ${result.url}`);
      return result.url;
    }

    console.warn(`[OpenRouter服务商] 图片上传失败，返回原始 URL: ${imageUrl}`);
    return imageUrl;
  }

  /**
   * 检查 API Key 是否配置
   */
  private isApiKeyConfigured(): boolean {
    const apiKey = process.env.OPENROUTER_API_KEY;
    return !!(apiKey && apiKey !== "your_api_key_here" && apiKey.trim().length > 0);
  }
}
