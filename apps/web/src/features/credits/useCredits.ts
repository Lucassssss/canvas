import { create } from 'zustand'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ConsumeCreditsParams {
  amount: number
  action: string
  description: string
  details?: Record<string, unknown>
}

interface ConsumeResult {
  success: boolean
  balanceBefore: number
  balanceAfter: number
  transactionId?: string
  error?: string
}

interface CreditsState {
  isConsuming: boolean
  isModalOpen: boolean
  isInsufficientModalOpen: boolean
  pendingConsume: ConsumeCreditsParams | null
  lastConsumeResult: ConsumeResult | null
  openConsumeModal: (params: ConsumeCreditsParams) => void
  closeConsumeModal: () => void
  openInsufficientModal: () => void
  closeInsufficientModal: () => void
  consumeCredits: () => Promise<ConsumeResult>
}

export const useCredits = create<CreditsState>((set, get) => ({
  isConsuming: false,
  isModalOpen: false,
  isInsufficientModalOpen: false,
  pendingConsume: null,
  lastConsumeResult: null,

  openConsumeModal: (params: ConsumeCreditsParams) => {
    set({ isModalOpen: true, pendingConsume: params })
  },

  closeConsumeModal: () => {
    set({ isModalOpen: false, pendingConsume: null })
  },

  openInsufficientModal: () => {
    set({ isInsufficientModalOpen: true })
  },

  closeInsufficientModal: () => {
    set({ isInsufficientModalOpen: false })
  },

  consumeCredits: async () => {
    const { pendingConsume } = get()
    if (!pendingConsume) {
      return { success: false, balanceBefore: 0, balanceAfter: 0, error: 'No pending consume' }
    }

    set({ isConsuming: true })
    
    try {
      const res = await fetch(`${API_BASE}/api/credits/consume`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingConsume),
      })

      const result: ConsumeResult = await res.json()
      
      set({ 
        isConsuming: false, 
        isModalOpen: false, 
        pendingConsume: null,
        lastConsumeResult: result 
      })
      
      return result
    } catch (error) {
      const result: ConsumeResult = { 
        success: false, 
        balanceBefore: 0, 
        balanceAfter: 0, 
        error: '网络错误，请稍后重试' 
      }
      set({ isConsuming: false, lastConsumeResult: result })
      return result
    }
  },
}))
