/**
 * 图片生成服务主类
 *
 * 负责协调各服务商，处理生成请求的分发
 */

import { GenerationMode } from "../types.js";
import type {
  ImageGenerateInput,
  ImageGenerateResult,
  GenerationProvider,
} from "../types.js";
import { getDefaultProvider, getProvider } from "./providers/index.js";

export class ImageGenerationService {
  private currentProvider: GenerationProvider | null = null;

  constructor() {
    this.currentProvider = getDefaultProvider();
  }

  async generate(input: ImageGenerateInput): Promise<ImageGenerateResult> {
    console.log(`[图片生成服务] 开始处理请求，类型: ${input.combinationTypeId}`);

    const provider = this.getProvider();
    if (!provider) {
      console.error(`[图片生成服务] 未配置任何服务商`);
      return { success: false, error: "未配置图片生成服务商" };
    }

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

  setProvider(providerId: string): boolean {
    const provider = getProvider(providerId);
    if (!provider) {
      console.error(`[图片生成服务] 无法设置服务商，不存在的 ID: ${providerId}`);
      return false;
    }
    this.currentProvider = provider;
    console.log(`[图片生成服务] 已切换到服务商: ${provider.name}`);
    return true;
  }

  getProvider(): GenerationProvider | null {
    return this.currentProvider;
  }
}

export const imageGenerationService = new ImageGenerationService();
