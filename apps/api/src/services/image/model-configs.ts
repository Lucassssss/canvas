/**
 * 图片生成模型配置
 *
 * 集中管理所有图片生成服务商的配置信息
 * 直接在此文件中配置模型的启用状态
 */

/**
 * 模型能力配置
 */
export interface ModelCapability {
  /** 最大输入图片数 */
  maxImages: number;
  /** 支持的分辨率 */
  resolutions: string[];
  /** 支持的宽高比 */
  aspectRatios?: string[];
  /** 输出模式（OpenRouter 专用） */
  modalities?: ("image" | "text")[];
  /** 是否支持异步生成 */
  async: boolean;
  /** 是否支持流式输出 */
  stream: boolean;
  /** 是否支持 output_format 参数（火山引擎专用） */
  supportsOutputFormat?: boolean;
}

/**
 * 模型配置
 */
export interface ModelConfig {
  /** 模型唯一标识 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 服务商名称 */
  provider: string;
  /** 服务商 ID */
  providerId: string;
  /** 服务商注册表 ID（用于获取 provider 实例） */
  registryProviderId: string;
  /** 实际调用模型 ID */
  modelId: string;
  /** 模型描述 */
  description: string;
  /** 模型能力 */
  capabilities: ModelCapability;
  /** 价格信息（元/张） */
  pricing?: {
    low?: number;
    high?: number;
  };
  /** 是否启用 */
  enabled: boolean;
  /** 是否为推荐模型 */
  recommended?: boolean;
  /** 标签 */
  tags?: string[];
}

/**
 * 所有模型配置
 */
export const MODEL_CONFIGS: ModelConfig[] = [
  // ==================== 火山引擎 Seedream ====================
  {
    id: "volcengine-seedream-5-0-lite",
    name: "Seedream 5.0 Lite",
    provider: "火山引擎",
    providerId: "volcengine-seedream",
    registryProviderId: "volcengine-seedream-5-0-lite",
    modelId: "doubao-seedream-5-0-260128",
    description: "火山引擎最新图像生成模型，专为换装场景优化，效果最佳",
    capabilities: {
      maxImages: 15,
      resolutions: ["2K", "3K"],
      async: false,
      stream: false,
      supportsOutputFormat: true,
    },
    pricing: { low: 0.1, high: 0.3 },
    enabled: true,
    recommended: true,
    tags: ["换装", "高质量", "推荐"],
  },
  {
    id: "volcengine-seedream-4-5",
    name: "Seedream 4.5",
    provider: "火山引擎",
    providerId: "volcengine-seedream",
    registryProviderId: "volcengine-seedream-4-5",
    modelId: "doubao-seedream-4-5-251128",
    description: "火山引擎图像生成模型，支持更高分辨率",
    capabilities: {
      maxImages: 15,
      resolutions: ["2K", "4K"],
      async: false,
      stream: false,
      supportsOutputFormat: false,
    },
    pricing: { low: 0.1, high: 0.3 },
    enabled: true,
    tags: ["换装", "高分辨率"],
  },

  // ==================== OpenRouter ====================
  {
    id: "openrouter-gemini-3-flash-preview",
    name: "Nano Banana 2",
    provider: "OpenRouter",
    providerId: "openrouter",
    registryProviderId: "openrouter-gemini",
    modelId: "google/gemini-3.1-flash-image-preview",
    description: "Google Gemini 3.1 Flash 图像生成，支持 0.5K 和极端宽高比，速度快，性价比高",
    capabilities: {
      maxImages: 10,
      resolutions: ["0.5K", "1K", "2K", "4K"],
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9", "1:4", "4:1", "1:8", "8:1"],
      modalities: ["image"],
      async: false,
      stream: false,
    },
    pricing: { low: 0.46, high: 0.69 },
    enabled: true,
    tags: ["快速", "性价比"],
  },
  {
    id: "openrouter-gemini-2-5-flash",
    name: "Nano Banana",
    provider: "OpenRouter",
    providerId: "openrouter",
    registryProviderId: "openrouter-gemini",
    modelId: "google/gemini-2.5-flash-image",
    description: "Google Gemini 2.5 Flash 图像生成，速度快，性价比高",
    capabilities: {
      maxImages: 10,
      resolutions: ["1K", "2K", "4K"],
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"],
      modalities: ["image"],
      async: false,
      stream: false,
    },
    pricing: { low: 0.27, high: 0.27 },
    enabled: true,
    recommended: true,
    tags: ["快速", "性价比", "推荐"],
  },
  {
    id: "openrouter-gemini-3-pro",
    name: "Nano Banana3 Pro",
    provider: "OpenRouter",
    providerId: "openrouter",
    registryProviderId: "openrouter-gemini",
    modelId: "google/gemini-3-pro-image-preview",
    description: "Nano Banana3 Pro 图像生成，效果优秀",
    capabilities: {
      maxImages: 10,
      resolutions: ["1K", "2K", "4K"],
      aspectRatios: ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"],
      modalities: ["image"],
      async: false,
      stream: false,
    },
    pricing: { low: 1, high: 1.7 },
    enabled: true,
    recommended: true,
    tags: ["高质量", "推荐"],
  },
  {
    id: "openrouter-flux-2-max",
    name: "Flux 2 Max",
    provider: "OpenRouter",
    providerId: "openrouter",
    registryProviderId: "openrouter-gemini",
    modelId: "black-forest-labs/flux.2-max",
    description: "Flux 2 Max 图像生成，多图性能优秀",
    capabilities: {
      maxImages: 10,
      resolutions: ["1K", "2K"],
      aspectRatios: ["1:1", "9:16", "16:9"],
      modalities: ["image"],
      async: false,
      stream: false,
    },
    pricing: { low: 0.69, high: 1.31 },
    enabled: false,
    tags: ["多图", "高质量"],
  },

  // ==================== APIMart ====================
  {
    id: "apimart-gemini-3-pro",
    name: "Gemini 3 Pro (APIMart)",
    provider: "APIMart",
    providerId: "apimart",
    registryProviderId: "apimart-gemini",
    modelId: "gemini-3-pro-image-preview",
    description: "通过 APIMart 调用 Gemini 3 Pro，支持极端宽高比",
    capabilities: {
      maxImages: 14,
      resolutions: ["0.5K", "1K", "2K", "4K"],
      async: true,
      stream: false,
    },
    pricing: { low: 0.5, high: 2.0 },
    enabled: false,
    tags: ["高分辨率", "极端宽高比"],
  },

  // ==================== 腾讯混元 ====================
  {
    id: "tencent-hunyuan-tryon",
    name: "混元换装",
    provider: "腾讯云",
    providerId: "tencent-hunyuan",
    registryProviderId: "tencent-hunyuan",
    modelId: "hunyuan-tryon",
    description: "腾讯混元专用换装模型，效果稳定",
    capabilities: {
      maxImages: 2,
      resolutions: ["1K", "2K"],
      async: true,
      stream: false,
    },
    pricing: { low: 0.2, high: 0.5 },
    enabled: false,
    tags: ["换装", "稳定"],
  },

  // ==================== MiniMax ====================
  {
    id: "minimax-image-01",
    name: "MiniMax Image-01",
    provider: "MiniMax",
    providerId: "minimax",
    registryProviderId: "minimax-image",
    modelId: "image-01",
    description: "MiniMax 图像生成模型，支持人物参考",
    capabilities: {
      maxImages: 5,
      resolutions: ["1K", "2K"],
      async: false,
      stream: false,
    },
    pricing: { low: 0.1, high: 0.3 },
    enabled: false,
    tags: ["人物参考", "快速"],
  },

  // ==================== 本地模型 ====================
  {
    id: "local-gemini",
    name: "本地 Gemini",
    provider: "本地",
    providerId: "local-gemini",
    registryProviderId: "local-gemini",
    modelId: "gemini-local",
    description: "本地部署的 Gemini 模型，无需外部 API",
    capabilities: {
      maxImages: 10,
      resolutions: ["1K", "2K"],
      async: false,
      stream: false,
    },
    enabled: false,
    tags: ["本地", "免费"],
  },
];

/**
 * 获取所有启用的模型
 */
export function getEnabledModels(): ModelConfig[] {
  return MODEL_CONFIGS.filter((model) => model.enabled);
}

/**
 * 获取推荐的模型
 */
export function getRecommendedModels(): ModelConfig[] {
  return getEnabledModels().filter((model) => model.recommended);
}

/**
 * 根据 ID 获取模型配置
 */
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_CONFIGS.find((model) => model.id === modelId);
}

/**
 * 根据服务商 ID 获取模型列表
 */
export function getModelsByProvider(providerId: string): ModelConfig[] {
  return getEnabledModels().filter((model) => model.providerId === providerId);
}

/**
 * 获取模型统计信息
 */
export function getModelStats(): {
  total: number;
  enabled: number;
  providers: string[];
} {
  const enabled = getEnabledModels();
  const providers = [...new Set(enabled.map((m) => m.provider))];

  return {
    total: MODEL_CONFIGS.length,
    enabled: enabled.length,
    providers,
  };
}
