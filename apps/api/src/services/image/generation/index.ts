/**
 * 图片生成模块统一导出
 */

import { GenerationMode, ProviderId, GenerationStatus } from "../types.js";
import type {
  GenerationProvider,
  GenerationOptions,
  GenerationResult,
  ImageGenerateInput,
  ImageGenerateResult,
  ValidationResult,
  PromptTemplate,
  TaskInfo,
  SlotContent,
  GenerationSettings,
} from "../types.js";

export type {
  GenerationProvider,
  GenerationOptions,
  GenerationResult,
  ImageGenerateInput,
  ImageGenerateResult,
  ValidationResult,
  PromptTemplate,
  TaskInfo,
  SlotContent,
  GenerationSettings,
};

export { GenerationMode, ProviderId, GenerationStatus };

export { getProvider, getRegisteredProviderIds, resetProviderCache } from "./providers/index.js";
export { BaseProvider } from "./providers/base.js";
export { OpenRouterProvider } from "./providers/openrouter.js";
export { APIMartProvider } from "./providers/apimart.js";

export { ImageGenerationService, imageGenerationService } from "./service.js";

export { loadTemplate, getSupportedModes } from "./prompts/index.js";
export { PromptBuilder, promptBuilder } from "./prompts/builder.js";
