import { create } from 'zustand'
import { 
  getRechargePackages, 
  createOrder, 
  queryPaymentStatus,
  type RechargePackage, 
  type Order,
  type QueryPaymentResult,
} from '@/lib/api/payment-api'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const POLL_CONFIG = {
  INITIAL_INTERVAL: 2000,
  MAX_INTERVAL: 5000,
  BACKOFF_FACTOR: 1.2,
  MAX_POLLS: 60,
}

interface ConsumeCreditsParams {
  amount: number
  action: string
  description: string
  details?: Record<string, unknown>
  onConfirm?: () => Promise<{ success: boolean; error?: string }>
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
  
  packages: RechargePackage[]
  currentOrder: Order | null
  isPaying: boolean
  paymentError: string | null
  pollTimerId: NodeJS.Timeout | null
  pollCount: number
  isManualQuerying: boolean
  
  openConsumeModal: (params: ConsumeCreditsParams) => void
  closeConsumeModal: () => void
  openInsufficientModal: () => void
  closeInsufficientModal: () => void
  consumeCredits: () => Promise<ConsumeResult>
  
  loadPackages: () => Promise<void>
  createPaymentOrder: (credits: number) => Promise<{ success: boolean; qrCodeUrl?: string; error?: string }>
  startPolling: (orderId: string) => void
  manualQueryPayment: () => Promise<QueryPaymentResult>
  stopPolling: () => void
  resetPayment: () => void
}

export const useCredits = create<CreditsState>((set, get) => ({
  isConsuming: false,
  isModalOpen: false,
  isInsufficientModalOpen: false,
  pendingConsume: null,
  lastConsumeResult: null,
  
  packages: [],
  currentOrder: null,
  isPaying: false,
  paymentError: null,
  pollTimerId: null,
  pollCount: 0,
  isManualQuerying: false,

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
    const { pollTimerId } = get()
    if (pollTimerId) {
      clearTimeout(pollTimerId)
    }
    set({ 
      isInsufficientModalOpen: false, 
      currentOrder: null, 
      paymentError: null,
      isPaying: false,
      pollTimerId: null,
      pollCount: 0,
      isManualQuerying: false,
    })
  },

  consumeCredits: async () => {
    const { pendingConsume } = get()
    if (!pendingConsume) {
      return { success: false, balanceBefore: 0, balanceAfter: 0, error: 'No pending consume' }
    }

    set({ isConsuming: true })
    
    try {
      if (pendingConsume.onConfirm) {
        const result = await pendingConsume.onConfirm()
        set({ 
          isConsuming: false, 
          isModalOpen: false, 
          pendingConsume: null,
        })
        return { 
          success: result.success, 
          balanceBefore: 0, 
          balanceAfter: 0, 
          error: result.error 
        }
      }

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

  loadPackages: async () => {
    try {
      const packages = await getRechargePackages()
      set({ packages })
    } catch (error) {
      console.error('Load packages error:', error)
    }
  },

  createPaymentOrder: async (credits: number) => {
    set({ isPaying: true, paymentError: null, pollCount: 0 })
    
    try {
      const result = await createOrder(credits)
      
      if (result.success && result.data) {
        set({
          currentOrder: {
            id: result.data.orderId,
            orderNo: result.data.orderNo,
            credits: result.data.credits,
            amount: result.data.amount,
            status: 'pending',
            qrCodeUrl: result.data.qrCodeUrl,
            expireAt: result.data.expireAt,
            createdAt: new Date().toISOString(),
          },
        })
        
        get().startPolling(result.data.orderId)
        
        return { success: true, qrCodeUrl: result.data.qrCodeUrl }
      }
      
      set({ isPaying: false, paymentError: result.error || '创建订单失败' })
      return { success: false, error: result.error }
    } catch (error) {
      set({ isPaying: false, paymentError: '网络错误，请稍后重试' })
      return { success: false, error: '网络错误' }
    }
  },

  startPolling: (orderId: string) => {
    const { pollTimerId } = get()
    if (pollTimerId) {
      clearTimeout(pollTimerId)
    }
    
    let currentPollCount = 0
    let currentInterval = POLL_CONFIG.INITIAL_INTERVAL
    
    const poll = async () => {
      const { currentOrder, pollCount } = get()
      
      if (!currentOrder || currentOrder.status !== 'pending') {
        return
      }
      
      if (pollCount >= POLL_CONFIG.MAX_POLLS) {
        set({ 
          isPaying: false, 
          paymentError: '查询次数已达上限，如已支付请联系客服',
          pollTimerId: null 
        })
        return
      }
      
      const expireAt = new Date(currentOrder.expireAt)
      if (expireAt < new Date()) {
        set({ 
          currentOrder: { ...currentOrder, status: 'expired' },
          isPaying: false, 
          paymentError: '订单已过期',
          pollTimerId: null 
        })
        return
      }
      
      try {
        const result = await queryPaymentStatus(orderId)
        
        if (result.data) {
          set({ 
            currentOrder: result.data,
            pollCount: pollCount + 1,
          })
          
          if (result.code === 'PAYMENT_SUCCESS' || result.data.status === 'paid') {
            set({ isPaying: false, pollTimerId: null })
            return
          }
          
          if (result.code === 'ORDER_EXPIRED' || result.data.status === 'expired') {
            set({ isPaying: false, paymentError: '订单已过期', pollTimerId: null })
            return
          }
          
          if (result.code === 'PAYMENT_FAILED' || result.data.status === 'cancelled') {
            set({ isPaying: false, paymentError: '支付失败', pollTimerId: null })
            return
          }
          
          if (result.code === 'POLL_LIMIT_REACHED') {
            set({ 
              isPaying: false, 
              paymentError: '查询次数已达上限，如已支付请联系客服',
              pollTimerId: null 
            })
            return
          }
        }
        
        currentPollCount++
        currentInterval = Math.min(
          currentInterval * POLL_CONFIG.BACKOFF_FACTOR,
          POLL_CONFIG.MAX_INTERVAL
        )
        
        const timerId = setTimeout(poll, currentInterval)
        set({ pollTimerId: timerId })
        
      } catch (error) {
        console.error('Poll error:', error)
        currentPollCount++
        currentInterval = Math.min(
          currentInterval * POLL_CONFIG.BACKOFF_FACTOR,
          POLL_CONFIG.MAX_INTERVAL
        )
        
        const timerId = setTimeout(poll, currentInterval)
        set({ pollTimerId: timerId })
      }
    }
    
    poll()
  },

  manualQueryPayment: async () => {
    const { currentOrder, isManualQuerying } = get()
    
    if (!currentOrder || isManualQuerying) {
      return { success: false, error: '无法查询' }
    }
    
    set({ isManualQuerying: true })
    
    try {
      const result = await queryPaymentStatus(currentOrder.id)
      
      if (result.data) {
        set({ currentOrder: result.data })
        
        if (result.code === 'PAYMENT_SUCCESS' || result.data.status === 'paid') {
          set({ isPaying: false, isManualQuerying: false })
          get().stopPolling()
          return result
        }
        
        if (result.code === 'POLL_TOO_FAST' && result.waitSeconds) {
          set({ isManualQuerying: false })
          return { 
            ...result, 
            message: `请${result.waitSeconds}秒后再试` 
          }
        }
      }
      
      set({ isManualQuerying: false })
      return result
      
    } catch (error) {
      set({ isManualQuerying: false })
      return { success: false, error: '查询失败，请稍后重试' }
    }
  },

  stopPolling: () => {
    const { pollTimerId } = get()
    if (pollTimerId) {
      clearTimeout(pollTimerId)
      set({ pollTimerId: null })
    }
  },

  resetPayment: () => {
    get().stopPolling()
    set({
      currentOrder: null,
      isPaying: false,
      paymentError: null,
      pollCount: 0,
      isManualQuerying: false,
    })
  },
}))
