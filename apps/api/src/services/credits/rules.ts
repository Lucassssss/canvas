export interface ModelPricing {
  id: string
  name: string
  provider: string
  credits: number
  category: 'image' | 'chat' | 'video'
  description?: string
  icon?: string
  enabled: boolean
}

export const MODEL_PRICING: ModelPricing[] = [
  // 1.4
  // {
  //   id: 'gemini-3-pro-image-preview',
  //   name: 'Nano Banana Pro',
  //   provider: 'google',
  //   credits: 5,
  //   category: 'image',
  //   description: '高质量图片生成',
  //   icon: 'google',
  //   enabled: true,
  // },
  {
    id: 'gemini-3.1-flash-image-preview',
    name: 'Nano Banana 2',
    provider: 'google',
    credits: 150,
    category: 'image',
    description: '快速图片生成',
    icon: 'google',
    enabled: true,
  },
  {
    id: 'gemini-2.5-flash-image',
    name: 'Nano Banana',
    provider: 'google',
    credits: 120,
    category: 'image',
    description: '基础图片生成',
    icon: 'google',
    enabled: true,
  },
  {
    id: 'seedream-4.5',
    name: 'Seedream 4.5',
    provider: 'seedream',
    credits: 300,
    category: 'image',
    description: '专业级图片生成',
    icon: 'seedream',
    enabled: true,
  },
  // 3
  {
    id: 'seedream-5-0-lite',
    name: 'Seedream 5.0',
    provider: 'seedream',
    credits: 3,
    category: 'image',
    description: '最新一代高质量图片生成，支持 3K 分辨率和 PNG 输出',
    icon: 'seedream',
    enabled: true,
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    credits: 10,
    category: 'chat',
    description: '智能对话',
    enabled: true,
  },
  {
    id: 'deepseek/deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    credits: 20,
    category: 'chat',
    description: '深度推理对话',
    enabled: true,
  },
  {
    id: 'minimax/MiniMax-M2.7',
    name: 'MiniMax M2.7',
    provider: 'minimax',
    credits: 15,
    category: 'chat',
    description: '智能对话助手',
    enabled: true,
  },
  {
    id: 'video-gen-standard',
    name: '标准视频生成',
    provider: 'internal',
    credits: 500,
    category: 'video',
    description: '5秒标准视频',
    enabled: false,
  },
  {
    id: 'video-gen-hd',
    name: '高清视频生成',
    provider: 'internal',
    credits: 1000,
    category: 'video',
    description: '10秒高清视频',
    enabled: false,
  },
]

export function getModelPricing(modelId: string): ModelPricing | undefined {
  return MODEL_PRICING.find(m => m.id === modelId && m.enabled)
}

export function getCreditsForModel(modelId: string): number {
  const pricing = getModelPricing(modelId)
  if (!pricing) {
    console.warn(`[积分定价警告] 未找到模型定价配置: modelId="${modelId}", 使用默认值 100 积分。请在 MODEL_PRICING 中添加该模型的定价配置。`)
    return 100
  }
  return pricing.credits
}

export function getEnabledImageModels(): ModelPricing[] {
  return MODEL_PRICING.filter(m => m.category === 'image' && m.enabled)
}

export function getEnabledChatModels(): ModelPricing[] {
  return MODEL_PRICING.filter(m => m.category === 'chat' && m.enabled)
}

export function getEnabledVideoModels(): ModelPricing[] {
  return MODEL_PRICING.filter(m => m.category === 'video' && m.enabled)
}

export function getAllEnabledModels(): ModelPricing[] {
  return MODEL_PRICING.filter(m => m.enabled)
}
