/**
 * Local Gemini 图片生成服务商
 *
 * 概念简化：只负责调用 API，返回图片列表
 */

import "dotenv/config";
import type { GenerationOptions, GenerationResult, GenerationProvider } from "../../types.js";
import { s3UploadService } from "../../../s3.js";

const LOCAL_GEMINI_API_URL = process.env.LOCAL_GEMINI_API_URL || "http://localhost:8000";
const LOCAL_GEMINI_API_KEY = process.env.LOCAL_GEMINI_API_KEY || "han1234";
const DEFAULT_MODEL = "gemini-3.1-flash-image-landscape";

export class LocalGeminiProvider implements GenerationProvider {
  readonly id = "local-gemini";
  readonly name = "Local Gemini";

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { images, prompt, settings } = options;

    console.log(`[LocalGemini] 图片数: ${images.length}, 提示词: ${prompt.substring(0, 50)}...`);

    const content: any[] = [{ type: "text", text: prompt }];
    for (const imageUrl of images) {
      content.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    const requestBody = {
      model: settings.model || DEFAULT_MODEL,
      messages: [{ role: "user", content }],
      stream: true,
    };

    try {
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
        console.error(`[LocalGemini] API 失败 [${response.status}]:`, errorText);
        return { success: false, images: [], error: `API 请求失败: ${response.status}` };
      }

      const data = await response.json();
      const extractedImages = this.extractImages(data);

      if (extractedImages.length === 0) {
        return { success: false, images: [], error: "未能从响应中提取图片" };
      }

      const uploadedImages = await this.uploadImages(extractedImages);
      console.log(`[LocalGemini] 生成成功，返回 ${uploadedImages.length} 张图片`);

      return { success: true, images: uploadedImages };
    } catch (error) {
      console.error(`[LocalGemini] 生成异常:`, error);
      return { success: false, images: [], error: error instanceof Error ? error.message : "生成失败" };
    }
  }

  private extractImages(data: any): string[] {
    const images: string[] = [];
    const message = data?.choices?.[0]?.message;
    if (!message) return images;

    if (message.images && Array.isArray(message.images)) {
      for (const img of message.images) {
        if (img.image_url?.url) images.push(img.image_url.url);
      }
    }

    const content = message.content;
    if (typeof content === "string") {
      const urlMatch = content.match(/"url"\s*:\s*"([^"]+)"/);
      if (urlMatch) images.push(urlMatch[1]);
      const base64Match = content.match(/"base64"\s*:\s*"([^"]+)"/);
      if (base64Match) images.push(`data:image/png;base64,${base64Match[1]}`);
    }

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
