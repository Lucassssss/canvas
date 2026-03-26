import { SlotContent } from './types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface GenerationResult {
  success: boolean
  imageUrl?: string
  error?: string
}

interface GenerateInput {
  id: string
  combinationTypeId: string
  slotContents: Record<string, SlotContent>
  settings: {
    prompt: string
    resolution: { width: number; height: number }
  }
}

class AICombinationService {
  async generate(instance: GenerateInput): Promise<GenerationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          combinationTypeId: instance.combinationTypeId,
          slotContents: instance.slotContents,
          settings: instance.settings,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        return {
          success: false,
          error: errorData.error || `HTTP error ${response.status}`,
        }
      }

      const data = await response.json()

      if (data.success && data.imageUrl) {
        return {
          success: true,
          imageUrl: data.imageUrl,
        }
      } else {
        return {
          success: false,
          error: data.error || 'Generation failed',
        }
      }
    } catch (error) {
      console.error('[AICombinationService] Generate error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }
}

export const aiCombinationService = new AICombinationService()
