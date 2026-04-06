/**
 * 会话 API
 */
import apiClient from './client'

export interface Conversation {
  id: string
  userId: string
  title: string
  model: string
  mode: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
}

export const conversationApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<{ conversations: Conversation[] }>('/conversations')
    return response.conversations
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get<{ conversation: Conversation }>(`/conversations/${id}`)
    return response.conversation
  },

  async createConversation(params?: { title?: string; model?: string; mode?: string }): Promise<Conversation> {
    const response = await apiClient.post<{ conversation: Conversation }>('/conversations', params)
    return response.conversation
  },

  async updateConversation(id: string, params: { title?: string; model?: string; mode?: string }): Promise<void> {
    await apiClient.put(`/conversations/${id}`, params)
  },

  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}`)
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<{ conversationId: string; messages: Message[] }>(
      `/conversations/${conversationId}/messages`
    )
    return response.messages
  },

  async clearMessages(conversationId: string): Promise<void> {
    await apiClient.delete(`/conversations/${conversationId}/messages`)
  },
}
