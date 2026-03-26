import { SlotContent } from './types'

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
  async generate(
    instance: GenerateInput
  ): Promise<GenerationResult> {
    const contents = instance.slotContents

    const missingSlots = this.validateSlots(contents)
    if (missingSlots.length > 0) {
      return {
        success: false,
        error: `缺少必填图片: ${missingSlots.join(', ')}`,
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      success: true,
      imageUrl: `https://picsum.photos/768/1024?random=${Date.now()}`,
    }
  }

  private validateSlots(contents: Record<string, SlotContent>): string[] {
    const missing: string[] = []
    for (const [slotId, content] of Object.entries(contents)) {
      if (!content.imageUrl) {
        missing.push(slotId)
      }
    }
    return missing
  }
}

export const aiCombinationService = new AICombinationService()
