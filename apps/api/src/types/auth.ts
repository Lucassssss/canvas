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

export interface UserProfile {
  id: string
  phone: string
  nickname?: string
  avatarUrl?: string
}

export interface SendCodeRequest {
  phone: string
}

export interface SendCodeResponse {
  success: boolean
  message: string
}

export interface VerifyCodeRequest {
  phone: string
  code: string
}

export interface VerifyCodeResponse {
  success: boolean
  token?: string
  refreshToken?: string
  user?: User
  error?: string
}

export interface AuthTokens {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface CreditsInfo {
  balance: number
  used: number
}

export interface CreditTransaction {
  id: string
  userId: string
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description?: string
  createdAt: number
}

export interface UsageLog {
  id: string
  userId: string
  action: string
  creditsCost: number
  details?: string
  createdAt: number
}

export interface ConsumeCreditsRequest {
  amount: number
  description: string
  action: string
  details?: Record<string, unknown>
}

export interface ConsumeCreditsResponse {
  success: boolean
  balanceBefore: number
  balanceAfter: number
  transactionId?: string
  error?: string
}

export interface JWTPayload {
  userId: string
  phone: string
  jti: string
  iat: number
  exp: number
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}
