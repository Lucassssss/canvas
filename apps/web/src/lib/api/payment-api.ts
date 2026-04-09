const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface RechargePackage {
  id: string
  credits: number
  price: number
  unitPrice: number
  savings: number
  popular: boolean
}

export interface Order {
  id: string
  orderNo: string
  credits: number
  amount: number
  status: 'pending' | 'paid' | 'expired' | 'cancelled' | 'refunded'
  qrCodeUrl?: string
  expireAt: string
  paidAt?: string
  createdAt: string
}

export interface CreateOrderResponse {
  success: boolean
  data?: {
    orderId: string
    orderNo: string
    credits: number
    amount: number
    qrCodeUrl: string
    expireAt: string
  }
  error?: string
}

export async function getRechargePackages(): Promise<RechargePackage[]> {
  const res = await fetch(`${API_BASE}/api/payments/packages`, {
    credentials: 'include',
  })
  const result = await res.json()
  return result.data || []
}

export async function createOrder(credits: number): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/api/payments/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credits }),
  })
  return res.json()
}

export async function getOrderStatus(orderId: string): Promise<{ success: boolean; data?: Order; error?: string }> {
  const res = await fetch(`${API_BASE}/api/payments/order/${orderId}`, {
    credentials: 'include',
  })
  return res.json()
}

export async function getUserOrders(page = 1, limit = 10): Promise<{
  success: boolean
  data?: { orders: Order[]; total: number; page: number; limit: number }
  error?: string
}> {
  const res = await fetch(`${API_BASE}/api/payments/orders?page=${page}&limit=${limit}`, {
    credentials: 'include',
  })
  return res.json()
}

export interface QueryPaymentResult {
  success: boolean
  data?: Order
  error?: string
  message?: string
  code?: string
  waitSeconds?: number
}

export async function queryPaymentStatus(orderId: string): Promise<QueryPaymentResult> {
  const res = await fetch(`${API_BASE}/api/payments/query/${orderId}`, {
    method: 'POST',
    credentials: 'include',
  })
  return res.json()
}
