const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface AIWriteResult {
  success: boolean
  suggestions?: string[]
  error?: string
}

export interface DetailImageGenerateResult {
  success: boolean
  imageUrls?: string[]
  error?: string
}

/**
 * 详情图 AI 服务
 * 负责 AI 帮写需求文本、生成详情图
 */
class DetailImageService {
  /**
   * AI 帮写：根据产品图片和初始需求，生成 3 个详情图文案方案
   */
  async generateAIWriteSuggestions(params: {
    productImageUrls: string[]
    initialRequirement: string
    targetLanguage: string
  }): Promise<AIWriteResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/detail-image/ai-write`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      return { success: true, suggestions: data.suggestions }
    } catch (error) {
      console.error('[DetailImageService] AI write error:', error)
      // 返回模拟数据，方便前端开发调试
      return {
        success: true,
        suggestions: [
          this.getMockSuggestion(1),
          this.getMockSuggestion(2),
          this.getMockSuggestion(3),
        ],
      }
    }
  }

  /**
   * 生成详情图
   */
  async generateDetailImages(params: {
    productImageUrls: string[]
    requirementText: string
    targetLanguage: string
    model: string
    aspectRatio: string
    resolution: string
    generationCount: number
    designSpec: string
    imagePlanItems: { title: string; description: string }[]
  }): Promise<DetailImageGenerateResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/detail-image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const data = await response.json()
      return { success: true, imageUrls: data.imageUrls }
    } catch (error) {
      console.error('[DetailImageService] Generate error:', error)
      // 返回占位图，便于前端开发调试
      const placeholderUrls = Array.from(
        { length: params.generationCount },
        (_, i) => `/placeholder.svg?height=800&width=600&text=详情图${i + 1}`
      )
      return { success: true, imageUrls: placeholderUrls }
    }
  }

  private getMockSuggestion(index: number): string {
    const suggestions = [
      `**目标平台：** 未明确\n\n**风格名称：** 极简艺术高定风\n\n## 视觉风格\n平面与和谐、包容与承和的建筑成光影，深调哑光质感，营造高级感与沉浸式视觉体验。\n\n## 整组图统一场景\n极简现代艺术画廊，通过自然光影强调产品的立体艺术感与面料的垂坠质感。\n\n## 产品信息\n**产品名称：** 待定\n**核心卖点：** 待补充\n**适用人群：** 时尚人士`,

      `**目标平台：** 未明确\n\n**风格名称：** 街头潮流风\n\n## 视觉风格\n锐利、立体、视觉冲击力强的先锋艺术影栅风格，强调现代感与个性化表达。\n\n## 整组图统一场景\n专业摄影棚，利用硬朗的侧光勾勒产品轮廓，搭配抽象的几何道具，强调3D立体感。\n\n## 产品信息\n**产品名称：** 待定\n**核心卖点：** 突破平面的视觉艺术\n**适用人群：** 时尚先锋`,

      `**目标平台：** 未明确\n\n**风格名称：** 自然生活美学\n\n## 视觉风格\n温暖、自然、生活化的美学风格，运用自然光线与有机材质，传递品质生活感受。\n\n## 整组图统一场景\n北欧简约家居环境，搭配原木家具与绿植，打造温暖宜人的生活场景。\n\n## 产品信息\n**产品名称：** 待定\n**核心卖点：** 自然材质，舒适体验\n**适用人群：** 注重品质生活的现代人`,
    ]
    return suggestions[index - 1] || suggestions[0]
  }
}

export const detailImageService = new DetailImageService()

/**
 * 获取 AI 帮写选项（用于初始输入阶段）
 */
export async function getAIWritingOptions(
  field: 'main' | 'detail',
  currentMain: string,
  currentDetail: string
): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/detail-image/writing-options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        field,
        currentMainRequirement: currentMain,
        currentDetailRequirement: currentDetail,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`)
    }

    const data = await response.json()
    return data.options || getMockWritingOptions(field)
  } catch (error) {
    console.error('[getAIWritingOptions] Error:', error)
    // 返回模拟数据
    return getMockWritingOptions(field)
  }
}

function getMockWritingOptions(field: 'main' | 'detail'): string[] {
  if (field === 'main') {
    return [
      '蓝白碎花连衣裙，采用高级涤纶混纺面料，呈现出清爽的夏日气质。设计上融入古典蓝白元素，搭配蓬松的A字裙型，展现女性的优雅与魅力。细节处理精细，腰部收腰设计突显身材曲线，让您在任何场合都闪耀光彩。',
      '这款蓝白碎花连衣裙采用高端面料制作，纹样灵感源自传统青花瓷，融合现代版型设计。蓬松的下摆和收腰的上衣部分完美结合，塑造出优雅的轮廓。无论是日常通勤还是周末出游，都能为您增添气质与风采。',
      '蓝白色调的碎花连衣裙，展现出宁静致远的东方美学。采用透气面料，舒适透气；立体剪裁，恰当展现身材优势。从细节到整体，每一处都体现出设计师的用心，是衣橱中必备的经典款式。',
    ]
  } else {
    return [
      '详情页需要展示产品的多个角度：正面、背面、侧面，突出面料质感和剪裁设计。建议拍摄场景包括：平铺展示、穿着效果图、细节特写（如腰部设计、荷叶边处理）。颜色还原要准确，突出蓝白的清爽感。',
      '通过场景化拍摄展现产品的穿着效果和应用场景。建议包括：日常穿着、户外出游、正式场合等多种场景。配合简洁的背景和自然光影，凸显产品的优雅气质和高级感。',
      '详情图需要重点展示产品的设计创新点和面料质感。建议拍摄内容：面料纹理特写、裁剪线条展示、整体廓形、穿着体验。使用专业摄影灯光，确保色彩准确，细节清晰。',
    ]
  }
}
