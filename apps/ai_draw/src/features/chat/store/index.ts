import { create } from 'zustand'
import type { Message, ChatThread, MessageBlock } from '../types'
import { streamChat } from '../services/api'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

interface ChatStore {
  messages: Message[]
  threads: ChatThread[]
  currentThreadId: string
  isLoading: boolean
  input: string
  conversationId: string | null

  setInput: (input: string) => void
  setLoading: (loading: boolean) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  clearMessages: () => void
  addThread: () => void
  selectThread: (id: string) => void
  addBlockToMessage: (messageId: string, block: MessageBlock) => void
  updateBlock: (messageId: string, blockId: string, updates: Partial<MessageBlock>) => void
  sendMessage: (content: string) => Promise<void>
  setConversationId: (id: string | null) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  threads: [],
  currentThreadId: '',
  isLoading: false,
  input: '',
  conversationId: null,

  setInput: (input) => set({ input }),

  setLoading: (loading) => set({ isLoading: loading }),

  addMessage: (message) =>
    set((state) => {
      const newMessages = [...state.messages, message]
      if (state.currentThreadId) {
        return {
          messages: newMessages,
          threads: state.threads.map((t) =>
            t.id === state.currentThreadId
              ? { ...t, messages: [...t.messages, message] }
              : t
          ),
        }
      }
      return { messages: newMessages }
    }),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  clearMessages: () =>
    set((state) => {
      if (state.currentThreadId) {
        return {
          messages: [],
          threads: state.threads.map((t) =>
            t.id === state.currentThreadId ? { ...t, messages: [] } : t
          ),
        }
      }
      return { messages: [] }
    }),

  addThread: () =>
    set((state) => {
      const newThread: ChatThread = {
        id: `thread-${generateId()}`,
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
      }
      return {
        threads: [newThread, ...state.threads],
        currentThreadId: newThread.id,
        messages: [],
        conversationId: null,
      }
    }),

  selectThread: (id) =>
    set((state) => {
      const thread = state.threads.find((t) => t.id === id)
      if (thread) {
        return {
          currentThreadId: id,
          messages: thread.messages,
          conversationId: thread.id.startsWith('thread-') ? null : thread.id,
        }
      }
      return {}
    }),

  addBlockToMessage: (messageId, block) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? { ...m, blocks: [...(m.blocks || []), block] }
          : m
      ),
    })),

  updateBlock: (messageId, blockId, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              blocks: m.blocks?.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
              ),
            }
          : m
      ),
    })),

  setConversationId: (id) => set({ conversationId: id }),

  sendMessage: async (content) => {
    const { conversationId, addMessage, setLoading, updateMessage, setConversationId } = get()

    if (!content.trim() || get().isLoading) return

    const userMessage: Message = {
      id: `msg-${generateId()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    addMessage(userMessage)
    setLoading(true)

    const assistantMessage: Message = {
      id: `msg-${generateId()}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      blocks: [],
    }
    addMessage(assistantMessage)

    const currentMessages = get().messages
    const uiMessages = currentMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, content: m.content }))

    try {
      for await (const event of streamChat(uiMessages, {
        conversationId: conversationId || undefined,
        mode: 'agent',
        model: 'deepseek/deepseek-chat',
      })) {
        if (event.type === 'conversation_created') {
          setConversationId(event.id as string)
        } else if (event.type === 'reasoning') {
          const targetMsg = get().messages[get().messages.length - 1]
          if (targetMsg && targetMsg.role === 'assistant') {
            if (!targetMsg.blocks) {
              updateMessage(targetMsg.id, { blocks: [] })
            }

            const existingReasoning = targetMsg.blocks?.find((b) => b.type === 'reasoning')
            if (existingReasoning) {
              updateMessage(targetMsg.id, {
                blocks: targetMsg.blocks?.map((b) =>
                  b.id === existingReasoning.id
                    ? { ...b, content: (b.content || '') + (event.content || '') }
                    : b
                ),
              })
            } else {
              const newBlock: MessageBlock = {
                id: `block-${generateId()}`,
                type: 'reasoning',
                content: event.content || '',
              }
              updateMessage(targetMsg.id, {
                blocks: [...(targetMsg.blocks || []), newBlock],
              })
            }
          }
        } else if (event.type === 'text') {
          const targetMsg = get().messages[get().messages.length - 1]
          if (targetMsg && targetMsg.role === 'assistant') {
            updateMessage(targetMsg.id, {
              content: targetMsg.content + (event.content || ''),
            })
          }
        } else if (event.type === 'tool_call') {
          const targetMsg = get().messages[get().messages.length - 1]
          if (targetMsg && targetMsg.role === 'assistant') {
            const newBlock: MessageBlock = {
              id: `block-${generateId()}`,
              type: 'tool-call',
              name: event.name,
              input: event.input,
              status: 'running',
            }
            updateMessage(targetMsg.id, {
              blocks: [...(targetMsg.blocks || []), newBlock],
            })
          }
        } else if (event.type === 'tool_result') {
          const targetMsg = get().messages[get().messages.length - 1]
          if (targetMsg && targetMsg.role === 'assistant' && targetMsg.blocks) {
            const lastBlock = targetMsg.blocks[targetMsg.blocks.length - 1]
            if (lastBlock && lastBlock.type === 'tool-call' && lastBlock.status === 'running') {
              updateMessage(targetMsg.id, {
                blocks: targetMsg.blocks.map((b) =>
                  b.id === lastBlock.id
                    ? { ...b, output: event.output, status: 'completed' as const }
                    : b
                ),
              })
            }
          }
        } else if (event.type === 'tool_error') {
          const targetMsg = get().messages[get().messages.length - 1]
          if (targetMsg && targetMsg.role === 'assistant' && targetMsg.blocks) {
            const lastBlock = targetMsg.blocks[targetMsg.blocks.length - 1]
            if (lastBlock && lastBlock.type === 'tool-call') {
              updateMessage(targetMsg.id, {
                blocks: targetMsg.blocks.map((b) =>
                  b.id === lastBlock.id
                    ? { ...b, output: event.error, status: 'error' as const }
                    : b
                ),
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      const targetMsg = get().messages[get().messages.length - 1]
      if (targetMsg && targetMsg.role === 'assistant') {
        updateMessage(targetMsg.id, {
          content: '抱歉，发生了错误。请稍后重试。',
        })
      }
    } finally {
      setLoading(false)
    }
  },
}))
