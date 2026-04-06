/**
 * 认证 API
 */
import apiClient from './client'

export interface User {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
  credits: number
  creditsUsed: number
  vipLevel: 'free' | 'pro' | 'enterprise'
  vipExpiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  refreshToken?: string
  user?: User
  error?: string
}

export interface SendCodeResponse {
  success: boolean
  message: string
}

export const authApi = {
  async sendCode(phone: string): Promise<SendCodeResponse> {
    return apiClient.post('/api/auth/send-code', { phone })
  },

  async verifyCode(phone: string, code: string): Promise<LoginResponse> {
    return apiClient.post('/api/auth/verify-code', { phone, code })
  },

  async logout(): Promise<{ success: boolean }> {
    return apiClient.post('/api/auth/logout')
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/api/auth/me')
    } catch (error: any) {
      if (error.status === 401) return null
      throw error
    }
  },
}
