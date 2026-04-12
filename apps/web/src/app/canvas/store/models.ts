import { create } from 'zustand'

export interface ModelCapability {
  maxImages: number
  resolutions: string[]
  async: boolean
  stream: boolean
}

export interface ModelConfig {
  id: string
  name: string
  provider: string
  providerId: string
  modelId: string
  description: string
  capabilities: ModelCapability
  pricing?: {
    low?: number
    high?: number
  }
  credits: number
  enabled: boolean
  recommended?: boolean
  tags?: string[]
}

interface ModelsState {
  models: ModelConfig[]
  defaultModel: string
  loading: boolean
  error: string | null
  initialized: boolean
}

interface ModelsActions {
  fetchModels: () => Promise<void>
  getModelById: (id: string) => ModelConfig | undefined
  getModelsByProvider: (providerId: string) => ModelConfig[]
  getRecommendedModels: () => ModelConfig[]
  getResolutionsForModel: (modelId: string) => string[]
}

type ModelsStore = ModelsState & ModelsActions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const useModelsStore = create<ModelsStore>((set, get) => ({
  models: [],
  defaultModel: '',
  loading: false,
  error: null,
  initialized: false,

  fetchModels: async () => {
    const { initialized, loading } = get()
    
    // 如果已初始化或正在加载，直接返回
    if (initialized || loading) {
      return
    }

    try {
      set({ loading: true })

      const response = await fetch(`${API_BASE_URL}/api/models`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.data.models.length > 0) {
        set({
          models: data.data.models,
          defaultModel: data.data.defaultModel || data.data.models[0]?.id || '',
          loading: false,
          error: null,
          initialized: true,
        })

      } else {
        throw new Error('后端返回的模型列表为空')
      }
    } catch (err) {
      console.error('[ModelsStore] 获取模型列表失败:', err)
      set({
        error: err instanceof Error ? err.message : '获取模型列表失败',
        loading: false,
      })
    }
  },

  getModelById: (id) => {
    return get().models.find(m => m.id === id)
  },

  getModelsByProvider: (providerId) => {
    return get().models.filter(m => m.providerId === providerId)
  },

  getRecommendedModels: () => {
    return get().models.filter(m => m.recommended)
  },

  getResolutionsForModel: (modelId) => {
    const model = get().models.find(m => m.id === modelId)
    return model?.capabilities.resolutions || ['2K']
  },
}))
