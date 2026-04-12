import { MODEL_CONFIGS } from '../image/model-configs.js'

// 汇率：1元(CNY) = 100积分
export const CREDITS_PER_CNY = 100

// 目标利润倍数 (可根据需要随时调整为 4, 5 或者带小数的 3.5)
export const TARGET_PROFIT_MARGIN = 2

// 新用户注册赠送积分
export const SIGNUP_CREDITS = 1000

/**
 * 动态积分计算公式
 * @param pricing 包含 low 和 high 价格范围的对象。一般指调用该模型一次预估的人民币金额。
 * @param fallback 如果没有配置价格信息，则返回默认的备用积分
 * @returns 最终前端扣减和展示的积分数额
 *
 * 计算逻辑：
 * - 提取定价范围内的最高上限金额 `high` (防止一些极端高昂的情况导致亏损)
 * - 乘以 `TARGET_PROFIT_MARGIN` 锁定预期利润倍额
 * - 再乘以 `CREDITS_PER_CNY` 把货币金额转化为系统积分
 * - 最终结果向上取整以保障安全阈值
 */
export function calculateCredits(pricing?: { high?: number }, fallback: number = 100): number {
  if (pricing?.high) {
    return Math.ceil(pricing.high * TARGET_PROFIT_MARGIN * CREDITS_PER_CNY)
  }
  return fallback
}

export interface ModelPricing {
  id: string
  name: string
  provider: string
  credits: number
  pricing?: { low?: number; high?: number }
  category: 'image' | 'chat' | 'video'
  description?: string
  icon?: string
  enabled: boolean
}

/**
 * Chat 和 Video 模型定价配置
 * 图片模型定价已迁移到 model-configs.ts
 */
const CHAT_VIDEO_PRICING: Omit<ModelPricing, 'credits'>[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
    provider: 'deepseek',
    pricing: { low: 0.01, high: 0.02 }, // 示例预估成本，您可自由调整
    category: 'chat',
    description: '智能对话',
    enabled: true,
  },
  {
    id: 'deepseek/deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    provider: 'deepseek',
    pricing: { low: 0.02, high: 0.05 }, // 示例预估成本，您可自由调整
    category: 'chat',
    description: '深度推理对话',
    enabled: true,
  },
  {
    id: 'minimax/MiniMax-M2.7',
    name: 'MiniMax M2.7',
    provider: 'minimax',
    pricing: { low: 0.01, high: 0.02 }, // 示例预估成本，您可自由调整
    category: 'chat',
    description: '智能对话助手',
    enabled: true,
  },
  {
    id: 'video-gen-standard',
    name: '标准视频生成',
    provider: 'internal',
    pricing: { low: 0.5, high: 1.0 }, // 示例预估成本，您可自由调整
    category: 'video',
    description: '5秒标准视频',
    enabled: false,
  },
  {
    id: 'video-gen-hd',
    name: '高清视频生成',
    provider: 'internal',
    pricing: { low: 1.0, high: 2.0 }, // 示例预估成本，您可自由调整
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
    credits: calculateCredits(config.pricing),
    pricing: config.pricing,
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
  const dynamicChatVideo = CHAT_VIDEO_PRICING.map(model => ({
    ...model,
    credits: calculateCredits(model.pricing)
  }))
  return [...getImageModelPricing(), ...dynamicChatVideo]
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
