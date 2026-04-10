/**
 * 火山引擎 Seedream 图片生成服务商
 *
 * 模型参数差异：
 * - Seedream 5.0 lite: 支持 2K, 3K，支持 output_format 参数
 * - Seedream 4.5: 支持 2K, 4K，不支持 output_format 参数
 * 
 * 尺寸计算：不支持 aspect_ratio + size 方式，需要计算真实像素尺寸
 */

import "dotenv/config";
import type { GenerationOptions, GenerationResult, GenerationProvider } from "../../types.js";
import { s3UploadService } from "../../../s3.js";
import { getModelConfig } from "../../model-configs.js";

const VOLCENGINE_API_URL = process.env.ARK_API_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";
const VOLCENGINE_IMAGES_ENDPOINT = "/images/generations";

// 官方文档推荐的宽高像素值
const PRECISE_PIXEL_DIMENSIONS: Record<string, Record<string, { width: number; height: number }>> = {
  "2K": {
    "1:1": { width: 2048, height: 2048 },
    "4:3": { width: 2304, height: 1728 },
    "3:4": { width: 1728, height: 2304 },
    "16:9": { width: 2848, height: 1600 },
    "9:16": { width: 1600, height: 2848 },
    "3:2": { width: 2496, height: 1664 },
    "2:3": { width: 1664, height: 2496 },
    "21:9": { width: 3136, height: 1344 },
  },
  "3K": {
    "1:1": { width: 3072, height: 3072 },
    "4:3": { width: 3456, height: 2592 },
    "3:4": { width: 2592, height: 3456 },
    "16:9": { width: 4096, height: 2304 },
    "9:16": { width: 2304, height: 4096 },
    "3:2": { width: 3744, height: 2496 },
    "2:3": { width: 2496, height: 3744 },
    "21:9": { width: 4704, height: 2016 },
  },
  "4K": {
    "1:1": { width: 4096, height: 4096 },
    "3:4": { width: 3520, height: 4704 },
    "4:3": { width: 4704, height: 3520 },
    "16:9": { width: 5504, height: 3040 },
    "9:16": { width: 3040, height: 5504 },
    "2:3": { width: 3328, height: 4992 },
    "3:2": { width: 4992, height: 3328 },
    "21:9": { width: 6240, height: 2656 },
  },
};

function calculatePixelDimensions(
  resolution: string, 
  aspectRatio: string
): { width: number; height: number } | null {
  const preciseDimensions = PRECISE_PIXEL_DIMENSIONS[resolution];
  if (preciseDimensions && preciseDimensions[aspectRatio]) {
    return preciseDimensions[aspectRatio];
  }
  return null;
}

export class VolcengineSeedreamProvider implements GenerationProvider {
  readonly id = "volcengine-seedream";
  readonly name = "火山引擎 Seedream";

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { images, prompt, settings } = options;
    const apiKey = process.env.ARK_API_KEY;

    console.log(`[火山引擎Seedream] 图片数: ${images.length}, 提示词: ${prompt.substring(0, 50)}...`);

    if (!apiKey) {
      return { success: false, images: [], error: "火山引擎 API Key 未配置" };
    }

    // 从 model-configs.ts 获取模型配置
    const modelConfig = getModelConfig(settings.model || "volcengine-seedream-5-0-lite");
    if (!modelConfig) {
      return { 
        success: false, 
        images: [], 
        error: `未找到模型配置: ${settings.model}` 
      };
    }

    const endpointId = modelConfig.modelId;
    const capabilities = modelConfig.capabilities;
    
    // 验证分辨率
    const resolution = settings.resolution || "2K";
    if (!capabilities.resolutions.includes(resolution)) {
      return { 
        success: false, 
        images: [], 
        error: `模型 ${modelConfig.name} 不支持分辨率 ${resolution}，支持的分辨率: ${capabilities.resolutions.join(", ")}` 
      };
    }

    // 计算像素尺寸
    const aspectRatio = settings.aspectRatio || "9:16";
    const pixelDimensions = calculatePixelDimensions(resolution, aspectRatio);
    
    if (!pixelDimensions) {
      return { 
        success: false, 
        images: [], 
        error: `不支持的比例 ${aspectRatio}，分辨率 ${resolution}` 
      };
    }

    const size = `${pixelDimensions.width}x${pixelDimensions.height}`;
    console.log(`[火山引擎Seedream] Endpoint: ${endpointId}, 尺寸: ${size}`);

    // 构建请求体
    const requestBody: Record<string, any> = {
      model: endpointId,
      prompt,
      size,
      response_format: "url",
      watermark: false,
      sequential_image_generation: "disabled",
    };

    // 只有 Seedream 5.0 lite 支持 output_format
    if (capabilities.supportsOutputFormat) {
      requestBody.output_format = "png";
    }

    // 图片输入：单图或多图都用 image 参数
    if (images.length > 0) {
      requestBody.image = images.length === 1 ? images[0] : images;
    }

    try {
      const response = await fetch(`${VOLCENGINE_API_URL}${VOLCENGINE_IMAGES_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[火山引擎Seedream] API 失败 [${response.status}]:`, errorText);
        return { success: false, images: [], error: `API 请求失败: ${response.status}` };
      }

      const data = await response.json();
      const imageUrl = data.data?.[0]?.url;

      if (!imageUrl) {
        return { success: false, images: [], error: "未能从响应中提取图片" };
      }

      const uploadedImages = await this.uploadImages([imageUrl]);
      console.log(`[火山引擎Seedream] 生成成功`);

      return { success: true, images: uploadedImages };
    } catch (error) {
      console.error(`[火山引擎Seedream] 生成异常:`, error);
      return { success: false, images: [], error: error instanceof Error ? error.message : "生成失败" };
    }
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
