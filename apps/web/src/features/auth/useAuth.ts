import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
  credits: number
  creditsUsed: number
  vipLevel: 'free' | 'pro' | 'enterprise'
  vipExpiresAt?: number
  createdAt: number
  updatedAt: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isLoginModalOpen: boolean
  sendCode: (phone: string) => Promise<{ success: boolean; message: string }>
  login: (phone: string, code: string) => Promise<void>
  logout: () => Promise<void>
  fetchUser: () => Promise<void>
  openLoginModal: () => void
  closeLoginModal: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isLoginModalOpen: false,
      
      sendCode: async (phone: string) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE}/api/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone }),
          })
          const data = await res.json()
          set({ isLoading: false })
          return data
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: '发送验证码失败，请稍后重试' }
        }
      },
      
      login: async (phone: string, code: string) => {
        set({ isLoading: true })
        try {
          const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code }),
          })
          const data = await res.json()
          
          if (data.success) {
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
              isLoginModalOpen: false,
            })
          } else {
            set({ isLoading: false })
            throw new Error(data.error || '验证码错误')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      
      logout: async () => {
        const { token } = get()
        if (token) {
          try {
            await fetch(`${API_BASE}/api/auth/logout`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            })
          } catch (error) {
            console.error('Logout error:', error)
          }
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
      
      fetchUser: async () => {
        const { token } = get()
        if (!token) return
        
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          })
          if (res.ok) {
            const data = await res.json()
            set({ user: data.user, isAuthenticated: true })
          } else {
            set({ user: null, token: null, isAuthenticated: false })
          }
        } catch {
          set({ user: null, token: null, isAuthenticated: false })
        }
      },
      
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
)
