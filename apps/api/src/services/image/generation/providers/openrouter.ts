/**
 * OpenRouter 图片生成服务商
 *
 * 配置统一从 model-configs.ts 获取
 */

import "dotenv/config";
import type { GenerationOptions, GenerationResult, GenerationProvider } from "../../types.js";
import { s3UploadService } from "../../../s3.js";
import { getModelConfig } from "../../model-configs.js";

const OPENROUTER_API_URL = process.env.OPENROUTER_API_BASE_URL;
const DEFAULT_MODEL = "openrouter-gemini-2-5-flash";

export class OpenRouterProvider implements GenerationProvider {
  readonly id = "openrouter";
  readonly name = "OpenRouter";

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { images, prompt, settings } = options;
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return { success: false, images: [], error: "OpenRouter API Key 未配置" };
    }

    // 从 model-configs.ts 获取模型配置
    const modelConfig = getModelConfig(settings.model || DEFAULT_MODEL);
    if (!modelConfig) {
      return { success: false, images: [], error: `未找到模型配置: ${settings.model}` };
    }

    const model = modelConfig.modelId;
    const capabilities = modelConfig.capabilities;

    // 验证并选择分辨率
    const requestedSize = settings.resolution || "2K";
    const imageSize = capabilities.resolutions.includes(requestedSize) ? requestedSize : "2K";

    // 验证并选择比例
    const requestedRatio = settings.aspectRatio || "9:16";
    const aspectRatios = capabilities.aspectRatios || ["1:1", "9:16", "16:9"];
    const aspectRatio = aspectRatios.includes(requestedRatio) ? requestedRatio : "9:16";

    // 获取 modalities
    const modalities = capabilities.modalities || ["image"];

    console.log(`[OpenRouter] 模型: ${model}, 图片数: ${images.length}, 尺寸: ${imageSize}, 比例: ${aspectRatio}`);
    console.log(`[OpenRouter] 提示词: ${prompt.substring(0, 50)}...`);

    const content: any[] = [{ type: "text", text: prompt }];
    for (const imageUrl of images) {
      content.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    const requestBody = {
      model,
      messages: [{ role: "user", content }],
      modalities,
      image_config: {
        aspect_ratio: aspectRatio,
        image_size: imageSize,
      },
    };

    try {
      const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
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
        console.error(`[OpenRouter] API 失败 [${response.status}]:`, errorText);
        return { success: false, images: [], error: `API 请求失败: ${response.status}` };
      }

      const data = await response.json();
      const extractedImages = this.extractImages(data);

      if (extractedImages.length === 0) {
        return { success: false, images: [], error: "未能从响应中提取图片" };
      }

      const uploadedImages = await this.uploadImages(extractedImages);
      console.log(`[OpenRouter] 生成成功，返回 ${uploadedImages.length} 张图片`);

      return { success: true, images: uploadedImages };
    } catch (error) {
      console.error(`[OpenRouter] 生成异常:`, error);
      return { success: false, images: [], error: error instanceof Error ? error.message : "生成失败" };
    }
  }

  private extractImages(data: any): string[] {
    const images: string[] = [];
    const message = data?.choices?.[0]?.message;
    if (!message) return images;

    // 格式1: message.images 数组
    if (message.images && Array.isArray(message.images)) {
      for (const img of message.images) {
        if (img.image_url?.url) images.push(img.image_url.url);
      }
    }

    // 格式2: message.content 字符串
    const content = message.content;
    if (typeof content === "string") {
      const urlMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
      if (urlMatch) images.push(urlMatch[1]);
      const base64Match = content.match(/"base64"\s*:\s*"([^"]+)"/);
      if (base64Match) images.push(`data:image/png;base64,${base64Match[1]}`);
    }

    // 格式3: message.content 数组
    if (Array.isArray(content)) {
      for (const part of content) {
        if (part?.type === "image_url" && part.image_url?.url) {
          images.push(part.image_url.url);
        }
        if (part?.type === "image" && part.data) {
          images.push(part.data.startsWith("data:") ? part.data : `data:image/png;base64,${part.data}`);
        }
      }
    }

    return images;
  }

  private async uploadImages(images: string[]): Promise<string[]> {
    if (!s3UploadService.isConfigured()) return images;

    const results: string[] = [];
    for (const imageUrl of images) {
      if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
        const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");
        results.push(result.success && result.url ? result.url : imageUrl);
      } else {
        const cdnDomain = process.env.BITIFUL_CDN_URL || "";
        if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
          results.push(imageUrl);
        } else {
          const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");
          results.push(result.success && result.url ? result.url : imageUrl);
        }
      }
    }
    return results;
  }
}
