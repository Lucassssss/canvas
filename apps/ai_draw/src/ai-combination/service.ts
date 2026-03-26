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

interface UploadResult {
  success: boolean
  url?: string
  error?: string
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

  async uploadImage(file: File, folder: string = 'uploads'): Promise<UploadResult> {
    try {
      const signedUrlResponse = await fetch(`${API_BASE_URL}/api/upload/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder,
        }),
      })

      if (!signedUrlResponse.ok) {
        const errorData = await signedUrlResponse.json().catch(() => ({ error: 'Failed to get signed URL' }))
        return {
          success: false,
          error: errorData.error || `HTTP error ${signedUrlResponse.status}`,
        }
      }

      const signedData = await signedUrlResponse.json()
      if (!signedData.success || !signedData.uploadUrl) {
        return { success: false, error: signedData.error || 'Failed to get signed URL' }
      }

      const uploadResponse = await fetch(signedData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        return { success: false, error: `Upload to S3 failed: ${uploadResponse.status}` }
      }

      const uploadedUrl = signedData.url
      if (!uploadedUrl) {
        return { success: false, error: 'Failed to get uploaded URL' }
      }

      return { success: true, url: uploadedUrl }
    } catch (error) {
      console.error('[AICombinationService] Upload error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  async uploadImageFromUrl(imageUrl: string, folder: string = 'uploads'): Promise<UploadResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          folder,
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
      if (data.success && data.url) {
        return { success: true, url: data.url }
      } else {
        return { success: false, error: data.error || 'Upload failed' }
      }
    } catch (error) {
      console.error('[AICombinationService] Upload from URL error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // @ts-expect-error - Reserved for future use when server-side base64 encoding is needed
  private _fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

export const aiCombinationService = new AICombinationService()
