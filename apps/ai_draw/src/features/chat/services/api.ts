import type { Message, MessageBlock } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface StreamEvent {
  type: 'reasoning' | 'text' | 'tool_call' | 'tool_result' | 'tool_error' | 'artifact' | 'conversation_created' | 'title_generated'
  content?: string
  id?: string
  name?: string
  toolName?: string
  input?: string
  output?: string
  error?: string
  [key: string]: unknown
}

export type StreamHandler = (event: StreamEvent) => void

export async function* streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  options?: {
    conversationId?: string
    mode?: 'auto' | 'agent'
    model?: string
    onEvent?: StreamHandler
  }
): AsyncGenerator<StreamEvent> {
  const { conversationId, mode = 'agent', model, onEvent } = options || {}

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId,
      messages,
      mode,
      model,
    }),
  })

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`)
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

export function parseStreamEvents(
  messages: Message[],
  event: StreamEvent
): { updatedMessages: Message[]; newBlock?: MessageBlock } {
  const lastMessage = messages[messages.length - 1]
  let updatedMessages = [...messages]
  let newBlock: MessageBlock | undefined

  if (event.type === 'reasoning') {
    if (!lastMessage || lastMessage.role !== 'assistant') {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        blocks: [],
      }
      updatedMessages.push(newMessage)
    }
    const targetMessage = updatedMessages[updatedMessages.length - 1]
    if (!targetMessage.blocks) targetMessage.blocks = []

    const existingBlock = targetMessage.blocks.find(b => b.type === 'reasoning')
    if (existingBlock) {
      existingBlock.content = (existingBlock.content || '') + (event.content || '')
    } else {
      newBlock = {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: 'reasoning',
        content: event.content || '',
      }
      targetMessage.blocks.push(newBlock)
    }
  } else if (event.type === 'text') {
    if (!lastMessage || lastMessage.role !== 'assistant') {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: event.content || '',
        timestamp: Date.now(),
        blocks: [],
      }
      updatedMessages.push(newMessage)
    } else {
      const targetMessage = updatedMessages[updatedMessages.length - 1]
      targetMessage.content += event.content || ''
    }
  } else if (event.type === 'tool_call') {
    if (!lastMessage || lastMessage.role !== 'assistant') {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        blocks: [],
      }
      updatedMessages.push(newMessage)
    }
    const targetMessage = updatedMessages[updatedMessages.length - 1]
    if (!targetMessage.blocks) targetMessage.blocks = []

    newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'tool-call',
      name: event.name,
      input: event.input,
      status: 'running',
    }
    targetMessage.blocks.push(newBlock)
  } else if (event.type === 'tool_result') {
    if (lastMessage && lastMessage.blocks && lastMessage.blocks.length > 0) {
      const lastBlock = lastMessage.blocks[lastMessage.blocks.length - 1]
      if (lastBlock.type === 'tool-call' && lastBlock.status === 'running') {
        lastBlock.output = event.output
        lastBlock.status = 'completed'
      }
    }
  } else if (event.type === 'tool_error') {
    if (lastMessage && lastMessage.blocks && lastMessage.blocks.length > 0) {
      const lastBlock = lastMessage.blocks[lastMessage.blocks.length - 1]
      if (lastBlock.type === 'tool-call') {
        lastBlock.output = event.error
        lastBlock.status = 'error'
      }
    }
  } else if (event.type === 'artifact') {
    if (!lastMessage || lastMessage.role !== 'assistant') {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        blocks: [],
      }
      updatedMessages.push(newMessage)
    }
    const targetMessage = updatedMessages[updatedMessages.length - 1]
    if (!targetMessage.blocks) targetMessage.blocks = []

    newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: 'tool-result',
      name: event.type,
      output: JSON.stringify(event),
      status: 'completed',
    }
    targetMessage.blocks.push(newBlock)
  }

  return { updatedMessages, newBlock }
}
