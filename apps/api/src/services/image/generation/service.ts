/**
 * 图片生成服务主类
 *
 * 负责协调各服务商，处理生成请求的分发
 * 根据请求中的 model 字段选择对应的服务商
 */

import { GenerationMode } from "../types.js";
import type {
  ImageGenerateInput,
  ImageGenerateResult,
  GenerationProvider,
} from "../types.js";
import { getProvider, getProviderByModelId } from "./providers/index.js";

export class ImageGenerationService {
  async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    console.log(`[图片生成服务] 开始处理请求，类型: ${input.combinationTypeId}`);

    const modelId = input.settings?.model;
    if (!modelId) {
      console.error(`[图片生成服务] 请求中未指定模型`);
      return { success: false, error: "请在请求中指定要使用的模型" };
    }

    const provider = this.getProviderByModel(modelId);
    if (!provider) {
      console.error(`[图片生成服务] 未找到支持模型 ${modelId} 的服务商`);
      return { success: false, error: `未找到支持模型 ${modelId} 的服务商` };
    }

    console.log(`[图片生成服务] 使用服务商: ${provider.name} (模型: ${provider.model})`);

    const validationResult = provider.validateInput(input);
    if (!validationResult.valid) {
      console.error(`[图片生成服务] 输入验证失败: ${validationResult.error}`);
      return { success: false, error: validationResult.error };
    }

    const mode = input.combinationTypeId as GenerationMode;
    const options = {
      mode,
      slotContents: input.slotContents,
      settings: input.settings,
    };

    const result = await provider.generate(options);

    if (result.success) {
      console.log(`[图片生成服务] 生成成功`);
    } else {
      console.error(`[图片生成服务] 生成失败: ${result.error}`);
    }

    return result;
  }

  private getProviderByModel(modelId: string): GenerationProvider | null {
    return getProviderByModelId(modelId);
  }
}

export const imageGenerationService = new ImageGenerationService();
