const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface GenerationResult {
  success: boolean
  images: string[]
  error?: string
  required?: number
  current?: number
}

export interface ImageGenerateInput {
  combinationTypeId: string
  images: string[]
  prompt: string
  settings: {
    model?: string
    resolution?: string
    aspectRatio?: string
  }
}

class ImageGenerationService {
  async generate(input: ImageGenerateInput): Promise<GenerationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      })
      const data = await response.json()
      
      return {
        success: data.success,
        images: data.images || [],
        error: data.error,
        required: data.required,
        current: data.current
      }
    } catch (error) {
      return { success: false, images: [], error: String(error) }
    }
  }
}

export const imageGenerationService = new ImageGenerationService()
