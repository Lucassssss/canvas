import { create } from 'zustand'

export interface User {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
  credits: number
  creditsUsed: number
  vipLevel: 'free' | 'pro' | 'enterprise'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isLoginModalOpen: boolean
  login: (phone: string, code: string) => Promise<void>
  logout: () => void
  openLoginModal: () => void
  closeLoginModal: () => void
}

// Mock initial user for testing (or null for real flow)
const MOCK_USER: User = {
  id: 'usr_1',
  phone: '138****8888',
  nickname: 'Joii Designer',
  credits: 1016,
  creditsUsed: 24,
  vipLevel: 'free',
}

export const useAuth = create<AuthState>((set) => ({
  user: null, // Initially null
  isAuthenticated: false,
  isLoading: false,
  isLoginModalOpen: false,
  login: async (phone: string, code: string) => {
    set({ isLoading: true })
    // Mock network request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (code === '123456') { // Mock valid code
      set({
        user: { ...MOCK_USER, phone },
        isAuthenticated: true,
        isLoading: false,
        isLoginModalOpen: false,
      })
    } else {
      set({ isLoading: false })
      throw new Error('验证码错误')
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}))
