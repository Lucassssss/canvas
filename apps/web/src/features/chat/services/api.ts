/**
 * 聊天服务 - 重构使用统一 API 客户端
 */
import { streamChat as apiStreamChat, type StreamEvent as ApiStreamEvent } from '@/lib/api/chat-api'
import type { Message, MessageBlock } from '../types'

export type { ApiStreamEvent as StreamEvent }
export type StreamHandler = (event: ApiStreamEvent) => void

export async function* streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  options?: {
    conversationId?: string
    mode?: 'auto' | 'agent'
    model?: string
    onEvent?: StreamHandler
  }
): AsyncGenerator<ApiStreamEvent> {
  yield* apiStreamChat(messages, options)
}

export function parseStreamEvents(
  messages: Message[],
  event: ApiStreamEvent
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
