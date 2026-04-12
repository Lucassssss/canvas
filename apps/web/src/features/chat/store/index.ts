import { create } from 'zustand'
import type { Message, ChatThread, MessageBlock } from '../types'
import { streamChat } from '../services/api'
import { projectApi } from '@/lib/api/project-api'
import { useAuth } from '@/features/auth/useAuth'
import { canvasToolExecutor } from '../services/canvas-executor'

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
  currentProjectId: string | null
  abortController: AbortController | null

  setInput: (input: string) => void
  setLoading: (loading: boolean) => void
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  clearMessages: () => void
  addThread: () => Promise<void>
  selectThread: (id: string) => Promise<void>
  addBlockToMessage: (messageId: string, block: MessageBlock) => void
  updateBlock: (messageId: string, blockId: string, updates: Partial<MessageBlock>) => void
  sendMessage: (content: string, options?: { model?: string, resolution?: string, aspectRatio?: string }) => Promise<void>
  setConversationId: (id: string | null) => void
  setCurrentProjectId: (id: string | null) => void
  loadProjectConversations: (projectId: string) => Promise<void>
  createProjectConversation: (projectId: string, title?: string) => Promise<void>
  stopMessage: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  threads: [],
  currentThreadId: '',
  isLoading: false,
  input: '',
  conversationId: null,
  currentProjectId: null,
  abortController: null,

  setInput: (input) => set({ input }),

  setLoading: (loading) => set({ isLoading: loading }),

  stopMessage: () => {
    const { abortController } = get()
    if (abortController) {
      abortController.abort()
      set({ abortController: null, isLoading: false })
    }
  },

  setCurrentProjectId: (id) => {
    set({ currentProjectId: id })
  },

  loadProjectConversations: async (projectId) => {
    
    // 清空当前消息和会话状态
    set({ 
      messages: [], 
      threads: [],
      currentThreadId: '',
      conversationId: null,
    })
    
    try {
      const conversations = await projectApi.getProjectConversations(projectId)
      
      // 将后端会话转换为前端 threads
      const threads: ChatThread[] = conversations.map((conv) => ({
        id: conv.id,
        title: conv.title,
        messages: [], // 消息需要单独加载
        createdAt: conv.createdAt,
      }))
      
      set({ threads, currentProjectId: projectId })
      
      // 如果有会话，自动选择最后一个（最新的）
      if (threads.length > 0) {
        const latestThread = threads[0] // 已经按 updated_at DESC 排序
        await get().selectThread(latestThread.id)
      }
    } catch (error) {
    }
  },

  createProjectConversation: async (projectId, title) => {
    try {
      const result = await projectApi.createConversation(projectId, title)
      
      // 重新加载会话列表
      await get().loadProjectConversations(projectId)
      
      // 选择新创建的会话
      await get().selectThread(result.id)
    } catch (error) {
      console.error('[Chat Store] Failed to create conversation:', error)
    }
  },

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

  addThread: async () => {
    const { currentProjectId, createProjectConversation } = get()
    
    // 如果有当前项目，创建项目会话
    if (currentProjectId) {
      await createProjectConversation(currentProjectId, '新对话')
    } else {
      // 否则创建本地临时会话
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
      })
    }
  },

  selectThread: async (id) => {
    const thread = get().threads.find((t) => t.id === id)
    if (thread) {
      
      // 如果消息为空，从后端加载
      if (thread.messages.length === 0 && !id.startsWith('thread-')) {
        try {
          const messages = await projectApi.getConversationMessages(id)
          
          // 转换消息格式
          const formattedMessages: Message[] = messages.map((msg) => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
            images: msg.images,
            timestamp: msg.createdAt,
            blocks: [],
          }))
          
          // 更新 thread 的消息
          set((state) => ({
            currentThreadId: id,
            messages: formattedMessages,
            conversationId: id,
            threads: state.threads.map((t) =>
              t.id === id ? { ...t, messages: formattedMessages } : t
            ),
          }))
        } catch (error) {
          console.error('[Chat Store] Failed to load messages:', error)
          set({
            currentThreadId: id,
            messages: [],
            conversationId: id,
          })
        }
      } else {
        set({
          currentThreadId: id,
          messages: thread.messages,
          conversationId: id.startsWith('thread-') ? null : id,
        })
      }
    }
  },

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

  sendMessage: async (content: string, options?: { model?: string, resolution?: string, aspectRatio?: string, images?: string[] }) => {
    const { 
      addMessage, 
      setLoading, 
      updateMessage, 
      setConversationId,
      createProjectConversation 
    } = get()

    if (!content.trim() || get().isLoading) return

    // 如果有项目但没有当前会话，先创建会话
    if (get().currentProjectId && !get().currentThreadId) {
      await createProjectConversation(get().currentProjectId!, '新对话')
    }

    const userMessage: Message = {
      id: `msg-${generateId()}`,
      role: 'user',
      content,
      images: options?.images,
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
      .map((m) => ({ role: m.role, content: m.content, images: m.images }))

    // Init AbortController
    const controller = new AbortController()
    set({ abortController: controller })

    try {
      for await (const event of streamChat(uiMessages, {
        conversationId: get().conversationId || undefined,
        mode: 'agent',
        model: '',
        imageModel: options?.model, // Treat the passed generic model as the image generation model
        resolution: options?.resolution,
        aspectRatio: options?.aspectRatio,
        signal: controller.signal,
      })) {
        if (event.type === 'conversation_created') {
          const newConvId = event.id as string
          setConversationId(newConvId)
          
          // 如果有项目，关联会话到项目
          const projectId = get().currentProjectId
          if (projectId) {
            try {
              await projectApi.linkConversation(projectId, newConvId)
            } catch (error) {
              console.error('[Chat Store] Failed to link conversation:', error)
            }
          }
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
              // 拦截并独立处理画布相关的 Tool Calls
              canvasToolExecutor.executeTool(lastBlock.name || '', event.output || '');

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
      useAuth.getState().fetchUser()
    }
  },
}))
