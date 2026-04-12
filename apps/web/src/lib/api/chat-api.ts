/**
 * 聊天 API (支持流式响应)
 * 流式响应由调用方自行处理错误
 */
import apiClient, { ApiError } from './client'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface StreamEvent {
  type: 'reasoning' | 'text' | 'tool_call' | 'tool_result' | 'tool_error' | 'artifact' | 'conversation_created' | 'title_generated' | 'error' | 'done'
  content?: string
  id?: string
  name?: string
  toolName?: string
  input?: string
  output?: string
  error?: string
  title?: string
  [key: string]: unknown
}

export type StreamHandler = (event: StreamEvent) => void

export async function* streamChat(
  messages: ChatMessage[],
  options?: {
    conversationId?: string
    mode?: 'auto' | 'agent'
    model?: string
    imageModel?: string
    resolution?: string
    aspectRatio?: string
    onEvent?: StreamHandler
  }
): AsyncGenerator<StreamEvent> {
  const { conversationId, mode = 'agent', model, imageModel, resolution, aspectRatio, onEvent } = options || {}

  const { response } = await apiClient.stream('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      conversationId,
      messages,
      mode,
      model,
      imageModel,
      resolution,
      aspectRatio,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
    const error = new ApiError(
      errorData.error || errorData.message || '请稍后重试',
      response.status,
      errorData
    )
    throw error
  }

  if (!response.body) {
    throw new Error('No response body')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') {
            return
          }
          try {
            const event = JSON.parse(data) as StreamEvent
            onEvent?.(event)
            yield event
          } catch (e) {
            console.error('Failed to parse SSE event:', e)
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
