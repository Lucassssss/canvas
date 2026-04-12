import { MODEL_CONFIGS } from '../image/model-configs.js'

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

/**
 * Chat 和 Video 模型定价配置
 * 图片模型定价已迁移到 model-configs.ts
 */
const CHAT_VIDEO_PRICING: ModelPricing[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    credits: 1,
    category: 'chat',
    description: '智能对话',
    enabled: true,
  },
  {
    id: 'deepseek/deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    credits: 1,
    category: 'chat',
    description: '深度推理对话',
    enabled: true,
  },
  {
    id: 'minimax/MiniMax-M2.7',
    name: 'MiniMax M2.7',
    provider: 'minimax',
    credits: 1,
    category: 'chat',
    description: '智能对话助手',
    enabled: true,
  },
  {
    id: 'video-gen-standard',
    name: '标准视频生成',
    provider: 'internal',
    credits: 5,
    category: 'video',
    description: '5秒标准视频',
    enabled: false,
  },
  {
    id: 'video-gen-hd',
    name: '高清视频生成',
    provider: 'internal',
    credits: 5,
    category: 'video',
    description: '10秒高清视频',
    enabled: false,
  },
]

/**
 * 获取图片模型定价列表（从 model-configs.ts 动态生成）
 */
function getImageModelPricing(): ModelPricing[] {
  return MODEL_CONFIGS.map(config => ({
    id: config.id,
    name: config.name,
    provider: config.provider,
    credits: config.credits,
    category: 'image' as const,
    description: config.description,
    icon: config.providerId,
    enabled: config.enabled,
  }))
}

/**
 * 获取所有模型定价
 */
export function getAllModelPricing(): ModelPricing[] {
  return [...getImageModelPricing(), ...CHAT_VIDEO_PRICING]
}

export function getModelPricing(modelId: string): ModelPricing | undefined {
  const allModels = getAllModelPricing()
  return allModels.find(m => m.id === modelId && m.enabled)
}

export function getCreditsForModel(modelId: string): number {
  const pricing = getModelPricing(modelId)
  if (!pricing) {
    console.warn(`[积分定价警告] 未找到模型定价配置: modelId="${modelId}", 使用默认值 100 积分。请在模型配置中添加该模型的定价配置。`)
    return 100
  }
  return pricing.credits
}

export function getEnabledImageModels(): ModelPricing[] {
  return getImageModelPricing().filter(m => m.enabled)
}

export function getEnabledChatModels(): ModelPricing[] {
  return CHAT_VIDEO_PRICING.filter(m => m.category === 'chat' && m.enabled)
}

export function getEnabledVideoModels(): ModelPricing[] {
  return CHAT_VIDEO_PRICING.filter(m => m.category === 'video' && m.enabled)
}

export function getAllEnabledModels(): ModelPricing[] {
  return getAllModelPricing().filter(m => m.enabled)
}
