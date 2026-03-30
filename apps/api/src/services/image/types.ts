/**
 * 图片生成服务公共类型定义
 *
 * 此模块定义了图片生成服务的核心类型，包括：
 * - 生成模式枚举
 * - 服务商接口
 * - 生成选项和结果类型
 */

export enum GenerationMode {
  SIMPLE_TRYON = "simple-tryon",
  FIXED_FACE_TRYON = "fixed-face-tryon",
  FIXED_FACE_BG_TRYON = "fixed-face-bg-tryon",
  FIXED_FACE_BG_POSE_TRYON = "fixed-face-bg-pose-tryon",
  POSE_FISSION = "pose-fission",
}

export enum ProviderId {
  OPENROUTER_GEMINI = "openrouter-gemini",
  NANO_BANANA_2 = "nano-banana-2",
  NANO_BANANA_PRO = "nano-banana-pro",
  GPT_IMAGE_1_5 = "gpt-image-1.5",
  FLUX_2_PRO = "flux-2-pro",
  FLUX_2_MAX = "flux-2-max",
  SEEDREAM_5 = "seedream-5",
}

export enum GenerationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export type SlotContent = {
  imageUrl?: string | null;
  text?: string | null;
};

export type ImageGenerateInput = {
  combinationTypeId: string;
  slotContents: Record<string, SlotContent>;
  settings: GenerationSettings;
};

export type GenerationSettings = {
  prompt?: string;
  resolution: { width: number; height: number };
  model?: string;
};

export type ImageGenerateResult = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

export type GenerationOptions = {
  mode: GenerationMode;
  slotContents: Record<string, SlotContent>;
  settings: GenerationSettings;
};

export type GenerationResult = {
  success: boolean;
  imageUrl?: string;
  error?: string;
  rawData?: unknown;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export type GenerationProvider = {
  readonly id: string;
  readonly name: string;
  readonly model: string;
  readonly supportedModes: GenerationMode[];
  generate(options: GenerationOptions): Promise<GenerationResult>;
  validateInput(input: ImageGenerateInput): ValidationResult;
};

export type PromptTemplate = {
  mode: GenerationMode;
  name: string;
  template: string;
  variables: string[];
  description?: string;
};

export type TaskInfo = {
  taskId: string;
  status: GenerationStatus;
  createdAt: Date;
  completedAt?: Date;
  result?: GenerationResult;
};
