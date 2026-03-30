import "dotenv/config";
import { BaseProvider } from "./base.js";
import {
  GenerationOptions,
  GenerationResult,
  GenerationMode,
  SlotContent,
} from "../../types.js";
import { PromptBuilder } from "../prompts/builder.js";
import { s3UploadService } from "../../../s3.js";

const LOCAL_GEMINI_API_URL = process.env.LOCAL_GEMINI_API_URL || "http://localhost:8000";
const LOCAL_GEMINI_API_KEY = process.env.LOCAL_GEMINI_API_KEY || "han1234";

const DEFAULT_MODEL = "gemini-3.1-flash-image-landscape";

export class LocalGeminiProvider extends BaseProvider {
  readonly id = "local-gemini";
  readonly name = "Local Gemini";
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

    console.log(`[LocalGemini服务商] 开始生成图片，模式: ${mode}`);

    try {
      let imageUrl: string;
      switch (mode) {
        case GenerationMode.POSE_FISSION:
          imageUrl = await this.callPoseFissionAPI(slotContents, settings);
          break;
        default:
          imageUrl = await this.callTryOnAPI(mode, slotContents, settings);
      }

      const uploadedUrl = await this.uploadToS3IfNeeded(imageUrl);

      console.log(`[LocalGemini服务商] 生成成功: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[LocalGemini服务商] 生成失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "图片生成失败",
      };
    }
  }

  private async callTryOnAPI(
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: { model?: string }
  ): Promise<string> {
    const prompt = this.promptBuilder.build(mode, slotContents);
    console.log(`[LocalGemini服务商] 生成提示词: ${prompt.substring(0, 100)}...`);

    const imageParts: { slotId: string; url: string }[] = [];
    for (const [slotId, content] of Object.entries(slotContents)) {
      if (content?.imageUrl) {
        imageParts.push({ slotId, url: content.imageUrl });
        console.log(`[LocalGemini服务商] 槽位 ${slotId}: ${content.imageUrl.substring(0, 80)}...`);
      }
    }

    if (imageParts.length === 0) {
      throw new Error("没有提供任何图片");
    }

    const model = settings.model || DEFAULT_MODEL;
    console.log(`[LocalGemini服务商] 使用模型: ${model}`);

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
      stream: true,
    };

    console.log(`[LocalGemini服务商] 发送请求到 Local Gemini，图片数量: ${imageParts.length}`);

    const response = await fetch(`${LOCAL_GEMINI_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOCAL_GEMINI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LocalGemini服务商] API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`图片生成请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[LocalGemini服务商] 收到 Local Gemini 响应`);

    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      throw new Error("图片生成成功但未能提取图片");
    }

    return imageUrl;
  }

  private async callPoseFissionAPI(
    slotContents: Record<string, SlotContent>,
    settings: { model?: string }
  ): Promise<string> {
    const sourceImage = slotContents.source?.imageUrl;

    if (!sourceImage) {
      throw new Error("缺少源图片");
    }

    const prompt = this.promptBuilder.build(GenerationMode.POSE_FISSION, slotContents);
    const model = settings.model || DEFAULT_MODEL;

    console.log(`[LocalGemini服务商] 姿势分解提示词: ${prompt.substring(0, 100)}...`);
    console.log(`[LocalGemini服务商] 源图片: ${sourceImage.substring(0, 80)}...`);

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
      stream: true,
    };

    const response = await fetch(`${LOCAL_GEMINI_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOCAL_GEMINI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LocalGemini服务商] 姿势分解 API 调用失败 [${response.status}]:`, errorText);
      throw new Error(`姿势分解请求失败: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = this.extractImageFromResponse(data);
    if (!imageUrl) {
      throw new Error("姿势分解成功但未能提取图片");
    }

    return imageUrl;
  }

  private extractImageFromResponse(data: any): string | null {
    try {
      const message = data?.choices?.[0]?.message;
      if (!message) {
        console.warn(`[LocalGemini服务商] 响应中缺少 message 字段`);
        return null;
      }

      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageUrl = message.images[0].image_url?.url;
        if (imageUrl) {
          console.log(`[LocalGemini服务商] 从 message.images 提取到图片`);
          return imageUrl;
        }
      }

      const content = message.content;
      if (typeof content === "string") {
        const jsonMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
        if (jsonMatch) {
          console.log(`[LocalGemini服务商] 从 content 字符串中提取到 URL`);
          return jsonMatch[1];
        }
        const base64Match = content.match(/"base64"\s*:\s*"([^"]+)"/);
        if (base64Match) {
          console.log(`[LocalGemini服务商] 从 content 字符串中提取到 base64 图片`);
          return `data:image/png;base64,${base64Match[1]}`;
        }
      }

      if (Array.isArray(content)) {
        for (const part of content) {
          if (part?.type === "image_url" && part.image_url?.url) {
            console.log(`[LocalGemini服务商] 从 content 数组中提取到 image_url`);
            return part.image_url.url;
          }
          if (part?.type === "image" && part.data) {
            console.log(`[LocalGemini服务商] 从 content 数组中提取到 image data`);
            return part.data.startsWith("data:") ? part.data : `data:image/png;base64,${part.data}`;
          }
        }
      }

      console.warn(`[LocalGemini服务商] 无法从响应结构中提取图片`);
      return null;
    } catch (error) {
      console.error(`[LocalGemini服务商] 提取图片时发生异常:`, error);
      return null;
    }
  }

  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    if (!s3UploadService.isConfigured()) {
      console.log(`[LocalGemini服务商] S3 服务未配置，直接返回图片URL`);
      return imageUrl;
    }

    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      console.log(`[LocalGemini服务商] 检测到 data/blob URL，需要上传到 S3`);
      const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");
      if (result.success && result.url) {
        console.log(`[LocalGemini服务商] data URL 上传成功: ${result.url}`);
        return result.url;
      }
      console.warn(`[LocalGemini服务商] data URL 上传失败，返回原始 URL`);
      return imageUrl;
    }

    const cdnDomain = process.env.BITIFUL_CDN_URL || "";
    if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
      console.log(`[LocalGemini服务商] 图片已在 S3/CDN，直接返回`);
      return imageUrl;
    }

    console.log(`[LocalGemini服务商] 正在上传图片到 S3...`);
    const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");

    if (result.success && result.url) {
      console.log(`[LocalGemini服务商] 图片上传成功: ${result.url}`);
      return result.url;
    }

    console.warn(`[LocalGemini服务商] 图片上传失败，返回原始 URL: ${imageUrl}`);
    return imageUrl;
  }
}
