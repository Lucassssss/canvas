import db from '../database.js'
import { nanoid } from 'nanoid'
import { generateToken, blacklistToken } from '../../middleware/auth.js'
import { verifyCode, invalidateCode } from '../sms/index.js'
import type { User, VerifyCodeResponse } from '../../types/auth.js'

const SIGNUP_CREDITS = 100

export function getUserById(userId: string): User | null {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as {
    id: string
    phone: string
    nickname: string | null
    avatar_url: string | null
    credits: number
    credits_used: number
    vip_level: 'free' | 'pro' | 'enterprise'
    vip_expires_at: number | null
    created_at: number
    updated_at: number
  } | undefined
  
  if (!row) return null
  
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname || undefined,
    avatarUrl: row.avatar_url || undefined,
    credits: row.credits,
    creditsUsed: row.credits_used,
    vipLevel: row.vip_level,
    vipExpiresAt: row.vip_expires_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function getUserByPhone(phone: string): User | null {
  const row = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone) as {
    id: string
    phone: string
    nickname: string | null
    avatar_url: string | null
    credits: number
    credits_used: number
    vip_level: 'free' | 'pro' | 'enterprise'
    vip_expires_at: number | null
    created_at: number
    updated_at: number
  } | undefined
  
  if (!row) return null
  
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname || undefined,
    avatarUrl: row.avatar_url || undefined,
    credits: row.credits,
    creditsUsed: row.credits_used,
    vipLevel: row.vip_level,
    vipExpiresAt: row.vip_expires_at || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function createUser(phone: string): User {
  const id = `usr_${nanoid(12)}`
  const now = Date.now()
  
  db.prepare(
    'INSERT INTO users (id, phone, credits, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, phone, SIGNUP_CREDITS, now, now)
  
  addCreditTransaction(id, 'signup', SIGNUP_CREDITS, 0, SIGNUP_CREDITS, '新用户注册赠送')
  
  return getUserById(id)!
}

export function loginWithCode(phone: string, code: string): VerifyCodeResponse {
  if (!verifyCode(phone, code)) {
    return { success: false, error: '验证码错误或已过期' }
  }
  
  invalidateCode(phone)
  
  let user = getUserByPhone(phone)
  
  if (!user) {
    user = createUser(phone)
  }
  
  const { token, refreshToken, jti } = generateToken(user.id, user.phone)
  
  return {
    success: true,
    token,
    refreshToken,
    user,
  }
}

export function logout(jti: string, exp: number): void {
  blacklistToken(jti, exp * 1000)
}

function addCreditTransaction(
  userId: string,
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup',
  amount: number,
  balanceBefore: number,
  balanceAfter: number,
  description: string
): void {
  const id = `ct_${nanoid(12)}`
  const now = Date.now()
  
  db.prepare(
    'INSERT INTO credit_transactions (id, user_id, type, amount, balance_before, balance_after, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, userId, type, amount, balanceBefore, balanceAfter, description, now)
}
