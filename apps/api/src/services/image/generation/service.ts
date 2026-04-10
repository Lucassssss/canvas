/**
 * 图片生成服务
 *
 * 职责：
 * 1. 选择 Provider
 * 2. 构建提示词（系统内置模式 vs 自定义模式）
 * 3. 调用 Provider 并返回结果
 */

import type {
  ImageGenerateInput,
  ImageGenerateResult,
  GenerationProvider,
  GenerationOptions,
  SlotContent,
} from "../types.js";
import { GenerationMode } from "../types.js";
import { getProviderByModelId } from "./providers/index.js";
import { promptBuilder } from "./prompts/builder.js";

// 系统内置模式列表
const BUILTIN_MODES = new Set([
  GenerationMode.SIMPLE_TRYON,
  GenerationMode.FIXED_FACE_TRYON,
  GenerationMode.FIXED_FACE_BG_TRYON,
  GenerationMode.FIXED_FACE_BG_POSE_TRYON,
  GenerationMode.POSE_FISSION,
  GenerationMode.TEXT_TO_IMAGE,
  GenerationMode.IMAGE_TO_IMAGE,
]);

function isBuiltinMode(combinationTypeId: string): boolean {
  return BUILTIN_MODES.has(combinationTypeId as GenerationMode);
}

export class ImageGenerationService {
  async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    console.log(`[图片生成服务] 开始处理请求，类型: ${input.combinationTypeId}`);

    const modelId = input.settings?.model;
    if (!modelId) {
      console.error(`[图片生成服务] 请求中未指定模型`);
      return { success: false, images: [], error: "请在请求中指定要使用的模型" };
    }

    const provider = getProviderByModelId(modelId);
    if (!provider) {
      console.error(`[图片生成服务] 未找到支持模型 ${modelId} 的服务商`);
      return { success: false, images: [], error: `未找到支持模型 ${modelId} 的服务商` };
    }

    console.log(`[图片生成服务] 使用服务商: ${provider.name}`);

    const images = input.images || [];
    const settings = input.settings || {};

    // 构建提示词：系统内置模式 vs 自定义模式
    let prompt: string;
    const combinationTypeId = input.combinationTypeId as GenerationMode;

    if (isBuiltinMode(input.combinationTypeId)) {
      // 系统内置模式：使用 PromptBuilder 构建提示词
      const slotContents = this.extractSlotContents(input);
      prompt = promptBuilder.build(combinationTypeId, slotContents);
      console.log(`[图片生成服务] 内置模式提示词: ${prompt.substring(0, 100)}...`);
    } else {
      // 自定义模式：直接使用用户输入的 prompt
      prompt = input.prompt || "";
      if (!prompt) {
        console.error(`[图片生成服务] 自定义模式缺少提示词`);
        return { success: false, images: [], error: "自定义模式需要提供提示词" };
      }
    }

    const options: GenerationOptions = {
      images,
      prompt,
      settings,
    };

    const result = await provider.generate(options);

    if (result.success) {
      console.log(`[图片生成服务] 生成成功，返回 ${result.images.length} 张图片`);
    } else {
      console.error(`[图片生成服务] 生成失败: ${result.error}`);
    }

    return {
      success: result.success,
      images: result.images,
      error: result.error,
    };
  }

  /**
   * 从输入中提取 slotContents
   */
  private extractSlotContents(input: ImageGenerateInput): Record<string, SlotContent> {
    // 如果前端传递了 slotContents，直接使用
    if (input.slotContents) {
      return input.slotContents;
    }

    // 否则从 images 和 prompt 构建
    const slotContents: Record<string, SlotContent> = {};

    if (input.images && input.images.length > 0) {
      input.images.forEach((url, index) => {
        slotContents[`image${index + 1}`] = { imageUrl: url };
      });
    }

    if (input.prompt) {
      slotContents["prompt"] = { text: input.prompt };
    }

    return slotContents;
  }
}

export const imageGenerationService = new ImageGenerationService();
