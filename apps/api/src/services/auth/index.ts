import { db, users, creditTransactions } from '../../db/index.js'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { generateToken, blacklistToken } from '../../middleware/auth.js'
import { verifyCode, invalidateCode } from '../sms/index.js'
import type { User, VerifyCodeResponse } from '../../types/auth.js'

const SIGNUP_CREDITS = 100

export async function getUserById(userId: string): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.id, userId))
  
  if (!row) return null
  
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname ?? undefined,
    avatarUrl: row.avatarUrl ?? undefined,
    credits: row.credits,
    creditsUsed: row.creditsUsed,
    vipLevel: row.vipLevel,
    vipExpiresAt: row.vipExpiresAt?.getTime() ?? undefined,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  }
}

export async function getUserByPhone(phone: string): Promise<User | null> {
  const [row] = await db.select().from(users).where(eq(users.phone, phone))
  
  if (!row) return null
  
  return {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname ?? undefined,
    avatarUrl: row.avatarUrl ?? undefined,
    credits: row.credits,
    creditsUsed: row.creditsUsed,
    vipLevel: row.vipLevel,
    vipExpiresAt: row.vipExpiresAt?.getTime() ?? undefined,
    createdAt: row.createdAt.getTime(),
    updatedAt: row.updatedAt.getTime(),
  }
}

export async function createUser(phone: string): Promise<User> {
  const id = `usr_${nanoid(12)}`
  
  await db.insert(users).values({
    id,
    phone,
    credits: SIGNUP_CREDITS,
  })
  
  await addCreditTransaction(id, 'signup', SIGNUP_CREDITS, 0, SIGNUP_CREDITS, '新用户注册赠送')
  
  return (await getUserById(id))!
}

export async function loginWithCode(phone: string, code: string): Promise<VerifyCodeResponse> {
  if (!await verifyCode(phone, code)) {
    return { success: false, error: '验证码错误或已过期' }
  }
  
  await invalidateCode(phone)
  
  let user = await getUserByPhone(phone)
  
  if (!user) {
    user = await createUser(phone)
  }
  
  const { token, refreshToken } = generateToken(user.id, user.phone)
  
  return {
    success: true,
    token,
    refreshToken,
    user,
  }
}

export function logout(jti: string, exp: number): void {
  blacklistToken(jti, new Date(exp * 1000))
}

async function addCreditTransaction(
  userId: string,
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup',
  amount: number,
  balanceBefore: number,
  balanceAfter: number,
  description: string
): Promise<void> {
  const id = `ct_${nanoid(12)}`
  
  await db.insert(creditTransactions).values({
    id,
    userId,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    description,
  })
}
