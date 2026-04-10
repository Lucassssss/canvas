/**
 * 火山引擎 Seedream 图片生成服务商
 *
 * 使用火山方舟官方 API 调用 Seedream 模型
 *
 * 支持的模型：
 * - doubao-seedream-4-5-251128 (Seedream 4.5)
 * - doubao-seedream-5-0-260128 (Seedream 5.0 lite)
 *
 * 参考文档: https://www.volcengine.com/docs/82379/1824121
 */

import "dotenv/config";
import { BaseProvider } from "./base.js";
import {
  GenerationOptions,
  GenerationResult,
  GenerationMode,
  SlotContent,
  GenerationSettings,
} from "../../types.js";
import { PromptBuilder } from "../prompts/builder.js";
import { s3UploadService } from "../../../s3.js";

const VOLCENGINE_API_URL = process.env.ARK_API_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";
const VOLCENGINE_IMAGES_ENDPOINT = "/images/generations";

type SeedreamModel = "doubao-seedream-4-5-251128" | "doubao-seedream-5-0-260128";

const DEFAULT_MODEL: SeedreamModel = "doubao-seedream-5-0-260128";

const MODEL_CONFIG: Record<SeedreamModel, { resolutions: string[]; outputFormat?: "png" | "jpeg" }> = {
  "doubao-seedream-4-5-251128": {
    resolutions: ["2K", "4K"],
  },
  "doubao-seedream-5-0-260128": {
    resolutions: ["2K", "3K"],
    outputFormat: "png",
  },
};

const RESOLUTION_BASE_PIXELS: Record<string, number> = {
  "0.5K": 512,
  "1K": 1024,
  "2K": 2048,
  "3K": 3072,
  "4K": 4096,
};

const ASPECT_RATIO_CONFIG: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1, height: 1 },
  "2:3": { width: 2, height: 3 },
  "3:4": { width: 3, height: 4 },
  "4:5": { width: 4, height: 5 },
  "9:16": { width: 9, height: 16 },
  "3:2": { width: 3, height: 2 },
  "4:3": { width: 4, height: 3 },
  "16:9": { width: 16, height: 9 },
  "21:9": { width: 21, height: 9 },
};

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
    "2:3": { width: 2496, height: 3744 },
    "3:2": { width: 3744, height: 2496 },
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
): { width: number; height: number } {
  const preciseDimensions = PRECISE_PIXEL_DIMENSIONS[resolution];
  
  if (preciseDimensions && preciseDimensions[aspectRatio]) {
    return preciseDimensions[aspectRatio];
  }

  const basePixel = RESOLUTION_BASE_PIXELS[resolution];
  
  if (!basePixel) {
    console.warn(`[火山引擎Seedream] 未知分辨率 ${resolution}，使用 2K 基准`);
    return calculatePixelDimensions("2K", aspectRatio);
  }

  const ratio = ASPECT_RATIO_CONFIG[aspectRatio];
  
  if (!ratio) {
    console.warn(`[火山引擎Seedream] 未知宽高比 ${aspectRatio}，使用 1:1`);
    return calculatePixelDimensions(resolution, "1:1");
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(ratio.width, ratio.height);
  const ratioW = ratio.width / divisor;
  const ratioH = ratio.height / divisor;

  let width: number, height: number;
  
  if (ratioW > ratioH) {
    width = basePixel;
    height = Math.round(basePixel * ratioH / ratioW);
    const heightGcd = gcd(width, height);
    width = Math.round(width / heightGcd) * 16;
    height = Math.round(height / heightGcd) * 16;
    if (width < 512) {
      width = 512;
      height = Math.round(width * ratioH / ratioW);
    }
  } else {
    height = basePixel;
    width = Math.round(basePixel * ratioW / ratioH);
    const widthGcd = gcd(width, height);
    width = Math.round(width / widthGcd) * 16;
    height = Math.round(height / widthGcd) * 16;
    if (height < 512) {
      height = 512;
      width = Math.round(height * ratioW / ratioH);
    }
  }

  width = Math.max(512, width);
  height = Math.max(512, height);

  return { width, height };
}

function formatSize(width: number, height: number): string {
  return `${width}x${height}`;
}

function normalizeResolution(
  resolution: string,
  model: SeedreamModel
): string {
  const availableSizes = MODEL_CONFIG[model].resolutions;
  
  const normalizedResolution = resolution.toUpperCase();
  
  if (availableSizes.includes(normalizedResolution)) {
    return normalizedResolution;
  }
  
  console.warn(`[火山引擎Seedream] 分辨率 ${resolution} 不被支持，使用默认: ${availableSizes[0]}`);
  return availableSizes[0];
}

export class VolcengineSeedreamProvider extends BaseProvider {
  readonly id = "volcengine-seedream";
  readonly name = "火山引擎 Seedream";
  readonly model = DEFAULT_MODEL;

  readonly supportedModes: GenerationMode[] = [
    GenerationMode.SIMPLE_TRYON,
    GenerationMode.FIXED_FACE_TRYON,
    GenerationMode.FIXED_FACE_BG_TRYON,
    GenerationMode.FIXED_FACE_BG_POSE_TRYON,
    GenerationMode.POSE_FISSION,
  ];

  private promptBuilder: PromptBuilder;

  constructor() {
    super();
    this.promptBuilder = new PromptBuilder();
  }

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { mode, slotContents, settings } = options;

    console.log(`[火山引擎Seedream] 开始生成图片，模式: ${mode}`);

    try {
      if (!this.isApiKeyConfigured()) {
        return {
          success: false,
          error: "火山引擎 API Key 未配置，请设置环境变量 ARK_API_KEY",
        };
      }

      const model = this.resolveModel(settings.model);
      const imageUrl = await this.callAPI(mode, slotContents, settings, model);
      const uploadedUrl = await this.uploadToS3IfNeeded(imageUrl);

      console.log(`[火山引擎Seedream] 生成成功: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[火山引擎Seedream] 生成失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "图片生成失败",
      };
    }
  }

  private resolveModel(modelId?: string): SeedreamModel {
    if (!modelId) return DEFAULT_MODEL;

    const normalizedId = modelId.toLowerCase();

    if (normalizedId.includes("5-0") || normalizedId.includes("5.0") || normalizedId === "seedream-5-0-lite") {
      return "doubao-seedream-5-0-260128";
    }
    if (normalizedId.includes("4-5") || normalizedId.includes("4.5")) {
      return "doubao-seedream-4-5-251128";
    }

    if (modelId in MODEL_CONFIG) {
      return modelId as SeedreamModel;
    }

    console.warn(`[火山引擎Seedream] 未知模型 ${modelId}，使用默认模型`);
    return DEFAULT_MODEL;
  }

  private async callAPI(
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: GenerationSettings,
    model: SeedreamModel
  ): Promise<string> {
    const prompt = this.promptBuilder.build(mode, slotContents);
    const images = this.collectImages(slotContents);

    if (images.length === 0) {
      throw new Error("没有提供任何图片");
    }

    const aspectRatio = settings.aspectRatio || "1:1";
    const pixelDimensions = calculatePixelDimensions(settings.resolution, aspectRatio);
    const size = formatSize(pixelDimensions.width, pixelDimensions.height);
    const outputFormat = MODEL_CONFIG[model].outputFormat;

    console.log(`[火山引擎Seedream] 输入图片数量: ${images.length}`);
    console.log(`[火山引擎Seedream] 提示词: ${prompt}`);
    console.log(`[火山引擎Seedream] 模型: ${model}, 分辨率: ${settings.resolution}, 宽高比: ${aspectRatio}, 像素尺寸: ${size}, 格式: ${outputFormat || '默认(jpeg)'}`);

    const requestBody: Record<string, any> = {
      model,
      prompt,
      size,
      response_format: "url",
      watermark: false,
      sequential_image_generation: "auto",
      sequential_image_generation_options: {
        max_images: 1,
      },
    };

    if (outputFormat) {
      requestBody.output_format = outputFormat;
    }

    if (images.length === 1) {
      requestBody.image = images[0];
    } else {
      requestBody.image = images;
    }

    const apiKey = process.env.ARK_API_KEY;
    const endpoint = `${VOLCENGINE_API_URL}${VOLCENGINE_IMAGES_ENDPOINT}`;

    console.log(`[火山引擎Seedream] 调用 API: ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`[火山引擎Seedream] 调用 API 失败: ${response.status} - ${errorText}`);
      throw new Error('图片生成失败');
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("图片生成成功但未能提取图片 URL");
    }

    return imageUrl;
  }

  private collectImages(slotContents: Record<string, SlotContent>): string[] {
    const images: string[] = [];
    for (const content of Object.values(slotContents)) {
      if (content?.imageUrl) {
        images.push(content.imageUrl);
      }
    }
    return images;
  }

  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    if (!s3UploadService.isConfigured()) {
      return imageUrl;
    }

    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated-seedream");
      return result.success && result.url ? result.url : imageUrl;
    }

    const cdnDomain = process.env.BITIFUL_CDN_URL || "";
    if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
      return imageUrl;
    }

    const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated-seedream");
    return result.success && result.url ? result.url : imageUrl;
  }

  private isApiKeyConfigured(): boolean {
    const apiKey = process.env.ARK_API_KEY;
    return !!(apiKey && apiKey.trim().length > 0);
  }
}
