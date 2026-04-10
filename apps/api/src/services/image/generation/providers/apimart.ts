/**
 * APIMart 图片生成服务商
 *
 * 概念简化：只负责调用 API，返回图片列表
 */

import "dotenv/config";
import type { GenerationOptions, GenerationResult, GenerationProvider } from "../../types.js";
import { s3UploadService } from "../../../s3.js";

const APIMART_API_URL = process.env.APIMART_API_BASE_URL || "https://api.apimart.ai";
const APIMART_IMAGES_ENDPOINT = "/v1/images/generations";
const APIMART_TASKS_ENDPOINT = "/v1/tasks";
const DEFAULT_MODEL = "gemini-3-pro-image-preview";
const DEFAULT_RESOLUTION = "4K";
const DEFAULT_ASPECT_RATIO = "9:16";

const MAX_POLL_RETRIES = 120;
const POLL_INTERVAL_MS = 2000;

export class APIMartProvider implements GenerationProvider {
  readonly id = "apimart";
  readonly name = "APIMart";

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const { images, prompt, settings } = options;
    const apiKey = process.env.APIMART_API_KEY;

    console.log(`[APIMart] 图片数: ${images.length}, 提示词: ${prompt.substring(0, 50)}...`);

    if (!apiKey) {
      return { success: false, images: [], error: "APIMart API Key 未配置" };
    }

    const requestBody: Record<string, any> = {
      model: settings.model || DEFAULT_MODEL,
      prompt,
      size: settings.aspectRatio || DEFAULT_ASPECT_RATIO,
      n: 1,
      resolution: settings.resolution || DEFAULT_RESOLUTION,
      official_fallback: true,
    };

    if (images.length > 0) {
      requestBody.image_urls = images;
    }

    try {
      const response = await fetch(`${APIMART_API_URL}${APIMART_IMAGES_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[APIMart] 提交任务失败 [${response.status}]:`, errorText);
        return { success: false, images: [], error: `提交任务失败: ${response.status}` };
      }

      const data = await response.json();
      const taskId = data?.data?.[0]?.task_id;

      if (!taskId) {
        return { success: false, images: [], error: "未能获取 task_id" };
      }

      console.log(`[APIMart] 任务已提交: ${taskId}`);

      const resultImages = await this.pollTaskResult(taskId, apiKey);
      const uploadedImages = await this.uploadImages(resultImages);

      return { success: true, images: uploadedImages };
    } catch (error) {
      console.error(`[APIMart] 生成异常:`, error);
      return { success: false, images: [], error: error instanceof Error ? error.message : "生成失败" };
    }
  }

  private async pollTaskResult(taskId: string, apiKey: string): Promise<string[]> {
    for (let attempt = 1; attempt <= MAX_POLL_RETRIES; attempt++) {
    const response = await fetch(`${APIMART_API_URL}${APIMART_TASKS_ENDPOINT}/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`查询任务状态失败: ${response.status}`);
      }

      const data = await response.json();
      const status = data?.data?.status;

      if (status === "completed") {
        const images = data?.data?.result?.images || [];
        return images
          .filter((img: any) => img?.url?.[0])
          .map((img: any) => img.url[0]);
      }

      if (status === "failed") {
        throw new Error(`任务执行失败: ${data?.data?.error || "未知错误"}`);
      }

      if (status === "cancelled") {
        throw new Error("任务已被取消");
      }

      if (attempt < MAX_POLL_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
    }

    throw new Error(`任务轮询超时`);
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
