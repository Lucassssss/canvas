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
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MODEL = "google/gemini-3.1-flash-image-preview";

/**
 * OpenRouter 图片生成服务商
 * 继承 BaseProvider，实现 OpenRouter API 调用逻辑
 */
export class OpenRouterProvider extends BaseProvider {
  /** 服务商唯一标识 */
  readonly id = "openrouter-gemini";

  /** 服务商名称 */
  readonly name = "OpenRouter Gemini";

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
      modalities: ["image", "text"] as const,
      max_tokens: 4096,
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
      modalities: ["image", "text"] as const,
      max_tokens: 4096,
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
      console.log(`[OpenRouter服务商] 检测到 data/blob URL，直接返回`);
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
