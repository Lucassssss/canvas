import { create } from 'zustand'
import { nanoid } from 'nanoid'

// 生图步骤
export type DetailImageStep = 'input' | 'analyzing' | 'planning' | 'generating' | 'done'

// 图片尺寸比例
export type AspectRatio = '1:1' | '3:4 竖版' | '4:3 横版' | '9:16 竖版' | '16:9 横版'

// 清晰度
export type Resolution = '1K 标准' | '2K 高清' | '4K 超清'

// 模型
export type ModelType = 'Nano Banana' | 'Nano Banana Pro'

// 生图速度
export type GenerationSpeed = 'standard' | 'fast' | 'ultra'

// 目标语言
export type TargetLanguage = '无文字（纯视觉）' | '中文（简体）' | '英文' | '日文'

// 图片计划条目
export interface ImagePlanItem {
  id: string
  title: string
  description: string
  isExpanded: boolean
}

// 设计规范
export interface DesignSpec {
  content: string
  isExpanded: boolean
}

// 详情图状态
interface DetailImageStore {
  // 步骤
  step: DetailImageStep

  // 产品图
  productImages: string[]   // 上传的图片 URL 列表
  maxProductImages: number

  // 当前 tab
  activeTab: 'main' | 'detail'

  // 表单配置
  requirementText: string
  targetLanguage: TargetLanguage
  model: ModelType
  aspectRatio: AspectRatio
  resolution: Resolution
  generationCount: number
  generationSpeed: GenerationSpeed

  // AI 帮写
  aiWriteLoading: boolean
  aiWriteSuggestions: string[]   // 3 个方案
  aiWriteSelectedIndex: number
  showAIWriteModal: boolean

  // 设计规划 (步骤3 右侧)
  designSpec: DesignSpec
  imagePlanItems: ImagePlanItem[]

  // 生成结果
  generatedImages: string[]

  // 容器控制
  isOpen: boolean
  openDetailImage: () => void
  closeDetailImage: () => void

  // 操作
  setStep: (step: DetailImageStep) => void
  addProductImage: (url: string) => void
  removeProductImage: (index: number) => void
  setActiveTab: (tab: 'main' | 'detail') => void
  setRequirementText: (text: string) => void
  setTargetLanguage: (lang: TargetLanguage) => void
  setModel: (model: ModelType) => void
  setAspectRatio: (ratio: AspectRatio) => void
  setResolution: (res: Resolution) => void
  setGenerationCount: (count: number) => void
  setGenerationSpeed: (speed: GenerationSpeed) => void
  setAIWriteSuggestions: (suggestions: string[]) => void
  setAIWriteSelectedIndex: (index: number) => void
  setShowAIWriteModal: (show: boolean) => void
  setAIWriteLoading: (loading: boolean) => void
  confirmAIWriteSuggestion: () => void
  setDesignSpec: (spec: Partial<DesignSpec>) => void
  toggleDesignSpecExpanded: () => void
  addImagePlanItem: () => void
  updateImagePlanItem: (id: string, updates: Partial<ImagePlanItem>) => void
  removeImagePlanItem: (id: string) => void
  toggleImagePlanItemExpanded: (id: string) => void
  setGeneratedImages: (images: string[]) => void
  addGeneratedImage: (url: string) => void
  reset: () => void

  // 流程动作
  startAnalyzing: () => Promise<void>
  confirmPlan: () => Promise<void>
}

const initialState = {
  step: 'input' as DetailImageStep,
  productImages: [] as string[],
  maxProductImages: 6,
  activeTab: 'detail' as 'main' | 'detail',
  requirementText: '',
  targetLanguage: '无文字（纯视觉）' as TargetLanguage,
  model: 'Nano Banana Pro' as ModelType,
  aspectRatio: '3:4 竖版' as AspectRatio,
  resolution: '2K 高清' as Resolution,
  generationCount: 1,
  generationSpeed: 'standard' as GenerationSpeed,
  aiWriteLoading: false,
  aiWriteSuggestions: [] as string[],
  aiWriteSelectedIndex: 0,
  showAIWriteModal: false,
  designSpec: {
    content: '',
    isExpanded: true,
  } as DesignSpec,
  imagePlanItems: [] as ImagePlanItem[],
  generatedImages: [] as string[],
  isOpen: false,
}

export const useDetailImageStore = create<DetailImageStore>((set, get) => ({
  ...initialState,

  openDetailImage: () => set({ isOpen: true }),
  closeDetailImage: () => set({ isOpen: false }),

  setStep: (step) => set({ step }),

  addProductImage: (url) => {
    const { productImages, maxProductImages } = get()
    if (productImages.length < maxProductImages) {
      set({ productImages: [...productImages, url] })
    }
  },

  removeProductImage: (index) => {
    const { productImages } = get()
    set({ productImages: productImages.filter((_, i) => i !== index) })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setRequirementText: (text) => set({ requirementText: text }),
  setTargetLanguage: (lang) => set({ targetLanguage: lang }),
  setModel: (model) => set({ model }),
  setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
  setResolution: (res) => set({ resolution: res }),
  setGenerationCount: (count) => set({ generationCount: count }),
  setGenerationSpeed: (speed) => set({ generationSpeed: speed }),

  setAIWriteSuggestions: (suggestions) => set({ aiWriteSuggestions: suggestions }),
  setAIWriteSelectedIndex: (index) => set({ aiWriteSelectedIndex: index }),
  setShowAIWriteModal: (show) => set({ showAIWriteModal: show }),
  setAIWriteLoading: (loading) => set({ aiWriteLoading: loading }),

  confirmAIWriteSuggestion: () => {
    const { aiWriteSuggestions, aiWriteSelectedIndex } = get()
    const selected = aiWriteSuggestions[aiWriteSelectedIndex]
    if (selected) {
      set({ requirementText: selected, showAIWriteModal: false })
    }
  },

  setDesignSpec: (spec) => {
    set((state) => ({ designSpec: { ...state.designSpec, ...spec } }))
  },

  toggleDesignSpecExpanded: () => {
    set((state) => ({
      designSpec: { ...state.designSpec, isExpanded: !state.designSpec.isExpanded },
    }))
  },

  addImagePlanItem: () => {
    const newItem: ImagePlanItem = {
      id: nanoid(),
      title: '新场景',
      description: '描述这张图片的场景和视觉风格',
      isExpanded: false,
    }
    set((state) => ({ imagePlanItems: [...state.imagePlanItems, newItem] }))
  },

  updateImagePlanItem: (id, updates) => {
    set((state) => ({
      imagePlanItems: state.imagePlanItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  },

  removeImagePlanItem: (id) => {
    set((state) => ({
      imagePlanItems: state.imagePlanItems.filter((item) => item.id !== id),
    }))
  },

  toggleImagePlanItemExpanded: (id) => {
    set((state) => ({
      imagePlanItems: state.imagePlanItems.map((item) =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      ),
    }))
  },

  setGeneratedImages: (images) => set({ generatedImages: images }),

  addGeneratedImage: (url) => {
    set((state) => ({ generatedImages: [...state.generatedImages, url] }))
  },

  reset: () => set({ ...initialState }),

  // 开始分析：模拟 AI 分析阶段，然后跳转到规划
  startAnalyzing: async () => {
    set({ step: 'analyzing' })
    // 模拟分析延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const { requirementText, generationCount } = get()
    
    // 生成设计规范内容
    const specContent = requirementText || '描述您的产品信息和期望的详情图风格，AI 将为您生成专属的设计方案。'
    
    // 生成图片计划条目
    const planItems: ImagePlanItem[] = Array.from({ length: generationCount }, (_, i) => ({
      id: nanoid(),
      title: `场景 ${i + 1}`,
      description: `在专业场景中展示产品的核心卖点与视觉美感，突出产品独特设计与品质感。`,
      isExpanded: false,
    }))

    set({
      step: 'planning',
      designSpec: {
        content: specContent,
        isExpanded: true,
      },
      imagePlanItems: planItems,
    })
  },

  // 确认规划并开始生成
  confirmPlan: async () => {
    set({ step: 'generating' })
    // 模拟生成延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))
    set({ step: 'done' })
  },
}))
