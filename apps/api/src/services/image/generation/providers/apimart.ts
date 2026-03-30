/**
 * APIMart 图片生成服务商适配器
 *
 * 基于 APIMart API 的图片生成实现
 * 支持：text-to-image, image-to-image, up to 4K resolution
 * 支持最多 14 张参考图片，支持极端宽高比 (1:4, 4:1, 1:8, 8:1)
 * 模型：gemini-3.1-flash-image-preview, gemini-3-pro-image-preview
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

/**
 * APIMart 服务商配置
 */
const APIMART_API_URL = process.env.APIMART_API_BASE_URL || "https://api.apimart.ai";
const APIMART_IMAGES_ENDPOINT = "/v1/images/generations";
const APIMART_TASKS_ENDPOINT = "/v1/tasks";

// ----------------------------------------------------------
// 可用模型
const DEFAULT_MODEL = "gemini-3-pro-image-preview";
// const DEFAULT_MODEL = "gemini-3.1-flash-image-preview";

// 可用分辨率: 0.5K (~512px), 1K (~1024px), 2K (~2048px), 4K (~4096px)
const DEFAULT_RESOLUTION = "4K";

// 可用宽高比
const ASPECT_RATIOS = {
  "1:1": "1:1",     // 方形
  "3:2": "3:2",     // 标准照片
  "2:3": "2:3",     // 竖向照片
  "4:3": "4:3",     // 传统显示比例
  "3:4": "3:4",     // 竖向显示比例
  "16:9": "16:9",   // 宽屏
  "9:16": "9:16",   // 竖屏
  "5:4": "5:4",     // Instagram
  "4:5": "4:5",     // Instagram 竖向
  "21:9": "21:9",   // 超宽横幅
  "1:4": "1:4",     // 长海报
  "4:1": "4:1",     // 横向长海报
  "1:8": "1:8",     // 超长图片
  "8:1": "8:1",     // 超长横向图片
} as const;

// 默认宽高比
const DEFAULT_ASPECT_RATIO = "9:16";

// 是否使用官方渠道回退
const DEFAULT_OFFICIAL_FALLBACK = true;
// ----------------------------------------------------------

const MAX_POLL_RETRIES = 120;
const POLL_INTERVAL_MS = 2000;

/**
 * APIMart 图片生成服务商
 * 继承 BaseProvider，实现 APIMart API 调用逻辑
 */
export class APIMartProvider extends BaseProvider {
  /** 服务商唯一标识 */
  readonly id = "apimart";

  /** 服务商名称 */
  readonly name = "APIMart";

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

    console.log(`[APIMart服务商] 开始生成图片，模式: ${mode}`);

    try {
      // 验证 API Key
      if (!this.isApiKeyConfigured()) {
        return {
          success: false,
          error: "APIMart API Key 未配置，请检查环境变量 APIMART_API_KEY",
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

      console.log(`[APIMart服务商] 生成成功: ${uploadedUrl.substring(0, 80)}...`);
      return { success: true, imageUrl: uploadedUrl };
    } catch (error) {
      console.error(`[APIMart服务商] 生成失败:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "图片生成失败",
      };
    }
  }

  /**
   * 调用试穿 API（通用换装场景）
   */
  private async callTryOnAPI(
    mode: GenerationMode,
    slotContents: Record<string, SlotContent>,
    settings: GenerationSettings
  ): Promise<string> {
    const prompt = this.promptBuilder.build(mode, slotContents);

    console.log(`[APIMart服务商] 构建提示词: ${prompt.substring(0, 100)}...`);

    const imageUrls = this.extractImageUrls(slotContents);
    console.log(`[APIMart服务商] 收集到 ${imageUrls.length} 张参考图片`);

    const requestBody: Record<string, any> = {
      model: this.model,
      prompt: prompt,
      size: DEFAULT_ASPECT_RATIO,
      n: 1,
      resolution: DEFAULT_RESOLUTION,
      official_fallback: DEFAULT_OFFICIAL_FALLBACK,
    };

    if (imageUrls.length > 0) {
      requestBody.image_urls = imageUrls;
    }

    console.log(`[APIMart服务商] 提交图片生成任务到 APIMart`);

    const apiKey = process.env.APIMART_API_KEY;

    const response = await fetch(APIMART_API_URL + APIMART_IMAGES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[APIMart服务商] 提交任务失败 [${response.status}]:`, errorText);
      throw new Error(`提交图片生成任务失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[APIMart服务商] 收到提交响应:`, JSON.stringify(data));

    const taskId = this.extractTaskIdFromResponse(data);
    if (!taskId) {
      throw new Error("提交任务成功但未能获取 task_id");
    }

    console.log(`[APIMart服务商] 任务已提交，task_id: ${taskId}，开始轮询...`);

    const imageUrl = await this.pollTaskResult(taskId);

    return imageUrl;
  }

  /**
   * 调用姿势分解 API
   */
  private async callPoseFissionAPI(
    slotContents: Record<string, SlotContent>,
    settings: GenerationSettings
  ): Promise<string> {
    const sourceImage = slotContents["source"];
    if (!sourceImage?.imageUrl) {
      throw new Error("姿势分解需要源图片");
    }

    const prompt = this.promptBuilder.build(GenerationMode.POSE_FISSION, slotContents);

    console.log(`[APIMart服务商] 姿势分解提示词: ${prompt.substring(0, 100)}...`);
    console.log(`[APIMart服务商] 姿势分解源图片: ${sourceImage.imageUrl.substring(0, 80)}...`);

    const requestBody: Record<string, any> = {
      model: this.model,
      prompt: prompt,
      size: DEFAULT_ASPECT_RATIO,
      n: 1,
      resolution: DEFAULT_RESOLUTION,
      official_fallback: DEFAULT_OFFICIAL_FALLBACK,
      image_urls: [sourceImage.imageUrl],
    };

    console.log(`[APIMart服务商] 提交姿势分解任务`);

    const apiKey = process.env.APIMART_API_KEY;

    const response = await fetch(APIMART_API_URL + APIMART_IMAGES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[APIMart服务商] 姿势分解任务提交失败 [${response.status}]:`, errorText);
      throw new Error(`姿势分解任务提交失败: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[APIMart服务商] 姿势分解任务提交响应:`, JSON.stringify(data));

    const taskId = this.extractTaskIdFromResponse(data);
    if (!taskId) {
      throw new Error("姿势分解任务提交成功但未能获取 task_id");
    }

    console.log(`[APIMart服务商] 姿势分解任务已提交，task_id: ${taskId}，开始轮询...`);

    const imageUrl = await this.pollTaskResult(taskId);

    return imageUrl;
  }

  /**
   * 从提交响应中提取 task_id
   */
  private extractTaskIdFromResponse(data: any): string | null {
    try {
      if (data?.data?.[0]?.task_id) {
        console.log(`[APIMart服务商] 从响应中提取到 task_id: ${data.data[0].task_id}`);
        return data.data[0].task_id;
      }

      console.warn(`[APIMart服务商] 无法从提交响应中提取 task_id:`, JSON.stringify(data));
      return null;
    } catch (error) {
      console.error(`[APIMart服务商] 提取 task_id 时发生异常:`, error);
      return null;
    }
  }

  /**
   * 轮询任务结果直到完成
   */
  private async pollTaskResult(taskId: string): Promise<string> {
    const apiKey = process.env.APIMART_API_KEY;

    for (let attempt = 1; attempt <= MAX_POLL_RETRIES; attempt++) {
      console.log(`[APIMart服务商] 轮询任务状态 [${attempt}/${MAX_POLL_RETRIES}]: ${taskId}`);

      const response = await fetch(`${APIMART_API_URL}${APIMART_TASKS_ENDPOINT}/${taskId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[APIMart服务商] 查询任务状态失败 [${response.status}]:`, errorText);
        throw new Error(`查询任务状态失败: ${response.status}`);
      }

      const data = await response.json();
      const status = data?.data?.status;

      // console.log(`[APIMart服务商] 任务状态: ${status}, 进度: ${data?.data?.progress || 0}%`);

      if (status === "completed") {
        console.log(`[APIMart服务商] 任务完成，提取图片...`);
        const imageUrl = this.extractImageFromTaskResult(data);
        if (!imageUrl) {
          throw new Error("任务完成但未能提取图片");
        }
        return imageUrl;
      }

      if (status === "failed") {
        throw new Error(`任务执行失败: ${data?.data?.error || "未知错误"}`);
      }

      if (status === "cancelled") {
        throw new Error("任务已被取消");
      }

      if (attempt < MAX_POLL_RETRIES) {
        await this.sleep(POLL_INTERVAL_MS);
      }
    }

    throw new Error(`任务轮询超时，已达到最大重试次数 ${MAX_POLL_RETRIES}`);
  }

  /**
   * 从任务结果中提取图片 URL
   */
  private extractImageFromTaskResult(data: any): string | null {
    try {
      const images = data?.data?.result?.images;
      if (images && images.length > 0 && images[0].url && images[0].url.length > 0) {
        console.log(`[APIMart服务商] 从任务结果中提取到图片 URL`);
        return images[0].url[0];
      }

      console.warn(`[APIMart服务商] 无法从任务结果中提取图片:`, JSON.stringify(data));
      return null;
    } catch (error) {
      console.error(`[APIMart服务商] 提取图片时发生异常:`, error);
      return null;
    }
  }

  /**
   * 从 slotContents 中提取所有图片 URL
   */
  private extractImageUrls(slotContents: Record<string, SlotContent>): string[] {
    const imageUrls: string[] = [];
    for (const [slotId, content] of Object.entries(slotContents)) {
      if (content?.imageUrl) {
        console.log(`[APIMart服务商] 槽位 ${slotId}: ${content.imageUrl.substring(0, 80)}...`);
        imageUrls.push(content.imageUrl);
      }
    }
    return imageUrls;
  }

  /**
   * 休眠工具函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 上传到 S3（如果需要）
   */
  private async uploadToS3IfNeeded(imageUrl: string): Promise<string> {
    if (!s3UploadService.isConfigured()) {
      console.log(`[APIMart服务商] S3 服务未配置，直接返回图片URL`);
      return imageUrl;
    }

    if (imageUrl.startsWith("data:") || imageUrl.startsWith("blob:")) {
      console.log(`[APIMart服务商] 检测到 data/blob URL，需要上传到 S3`);
      const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");
      if (result.success && result.url) {
        console.log(`[APIMart服务商] data URL 上传成功: ${result.url}`);
        return result.url;
      }
      console.warn(`[APIMart服务商] data URL 上传失败，返回原始 URL`);
      return imageUrl;
    }

    const cdnDomain = process.env.BITIFUL_CDN_URL || "";
    if (imageUrl.includes(".s3.amazonaws.com") || (cdnDomain && imageUrl.includes(cdnDomain))) {
      console.log(`[APIMart服务商] 图片已在 S3/CDN，直接返回`);
      return imageUrl;
    }

    console.log(`[APIMart服务商] 正在上传图片到 S3...`);
    const result = await s3UploadService.uploadFromUrl(imageUrl, "ai-generated");

    if (result.success && result.url) {
      console.log(`[APIMart服务商] 图片上传成功: ${result.url}`);
      return result.url;
    }

    console.warn(`[APIMart服务商] 图片上传失败，返回原始 URL: ${imageUrl}`);
    return imageUrl;
  }

  /**
   * 检查 API Key 是否配置
   */
  private isApiKeyConfigured(): boolean {
    const apiKey = process.env.APIMART_API_KEY;
    return !!(apiKey && apiKey !== "your_api_key_here" && apiKey.trim().length > 0);
  }
}
