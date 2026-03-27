/**
 * 图片服务统一入口
 *
 * 整合上传服务、AI生成服务、LLM服务
 */

import { s3UploadService } from "../s3.js";
export { s3UploadService } from "../s3.js";

import { GenerationMode, ProviderId, GenerationStatus } from "./types.js";
import type {
  ImageGenerateInput,
  ImageGenerateResult,
  GenerationProvider,
  GenerationOptions,
  GenerationResult,
  ValidationResult,
  TaskInfo,
} from "./types.js";

export type {
  ImageGenerateInput,
  ImageGenerateResult,
  GenerationProvider,
  GenerationOptions,
  GenerationResult,
  ValidationResult,
  TaskInfo,
};

export { GenerationMode, ProviderId, GenerationStatus };

export {
  imageGenerationService,
  ImageGenerationService,
  getProvider,
  getDefaultProvider,
  getRegisteredProviderIds,
} from "./generation/index.js";

export { imageLLMService } from "./llm/index.js";
