/**
 * 图片生成服务公共类型定义
 */

export enum GenerationMode {
  TEXT_TO_IMAGE = "text-to-image",
  IMAGE_TO_IMAGE = "image-to-image",
  SIMPLE_TRYON = "simple-tryon",
  FIXED_FACE_TRYON = "fixed-face-tryon",
  FIXED_FACE_BG_TRYON = "fixed-face-bg-tryon",
  FIXED_FACE_BG_POSE_TRYON = "fixed-face-bg-pose-tryon",
  POSE_FISSION = "pose-fission",
  CUSTOM = "custom",
}

export enum ProviderId {
  OPENROUTER_GEMINI = "openrouter-gemini",
  LOCAL_GEMINI = "local-gemini",
  APIMART_GEMINI = "apimart-gemini",
  VOLCENGINE_SEEDREAM_5_LITE = "volcengine-seedream-5-0-lite",
  VOLCENGINE_SEEDREAM_4_5 = "volcengine-seedream-4-5",
}

export enum GenerationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

/**
 * 生成配置
 */
export interface GenerationSettings {
  model?: string;
  resolution?: string;
  aspectRatio?: string;
  outputCount?: number;
}

/**
 * 生成选项 - Provider 的输入
 */
export interface GenerationOptions {
  images: string[];
  prompt: string;
  settings: GenerationSettings;
}

/**
 * 生成结果 - Provider 的输出
 */
export interface GenerationResult {
  success: boolean;
  images: string[];
  error?: string;
}

/**
 * 服务商接口
 */
export interface GenerationProvider {
  readonly id: string;
  readonly name: string;
  generate(options: GenerationOptions): Promise<GenerationResult>;
}

/**
 * API 输入格式（前端调用）
 */
export interface ImageGenerateInput {
  combinationTypeId: string;
  images: string[];
  prompt: string;
  settings: GenerationSettings;
  slotContents?: Record<string, SlotContent>;
}

/**
 * API 输出格式
 */
export interface ImageGenerateResult {
  success: boolean;
  images: string[];
  error?: string;
  required?: number;
  current?: number;
}

export type SlotContent = {
  imageUrl?: string | null;
  text?: string | null;
};

export type ValidationResult = {
  valid: boolean;
  error?: string;
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
