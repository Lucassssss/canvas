import db from '../database.js'
import { nanoid } from 'nanoid'
import { getUserById } from '../auth/index.js'
import type { CreditsInfo, CreditTransaction, UsageLog, ConsumeCreditsResponse } from '../../types/auth.js'

export function getCreditsInfo(userId: string): CreditsInfo | null {
  const user = getUserById(userId)
  if (!user) return null
  
  return {
    balance: user.credits,
    used: user.creditsUsed,
  }
}

export function getTransactions(userId: string, limit = 50, offset = 0): CreditTransaction[] {
  const rows = db.prepare(
    'SELECT * FROM credit_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(userId, limit, offset) as Array<{
    id: string
    user_id: string
    type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup'
    amount: number
    balance_before: number
    balance_after: number
    description: string | null
    created_at: number
  }>
  
  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    type: row.type,
    amount: row.amount,
    balanceBefore: row.balance_before,
    balanceAfter: row.balance_after,
    description: row.description || undefined,
    createdAt: row.created_at,
  }))
}

export function getUsageLogs(userId: string, limit = 50, offset = 0): UsageLog[] {
  const rows = db.prepare(
    'SELECT * FROM usage_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
  ).all(userId, limit, offset) as Array<{
    id: string
    user_id: string
    action: string
    credits_cost: number
    details: string | null
    created_at: number
  }>
  
  return rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    action: row.action,
    creditsCost: row.credits_cost,
    details: row.details || undefined,
    createdAt: row.created_at,
  }))
}

export function consumeCredits(
  userId: string,
  amount: number,
  action: string,
  description: string,
  details?: Record<string, unknown>
): ConsumeCreditsResponse {
  const user = getUserById(userId)
  if (!user) {
    return { success: false, balanceBefore: 0, balanceAfter: 0, error: '用户不存在' }
  }
  
  if (user.credits < amount) {
    return {
      success: false,
      balanceBefore: user.credits,
      balanceAfter: user.credits,
      error: '积分不足',
    }
  }
  
  const balanceBefore = user.credits
  const balanceAfter = user.credits - amount
  const now = Date.now()
  
  db.prepare('UPDATE users SET credits = ?, credits_used = credits_used + ?, updated_at = ? WHERE id = ?')
    .run(balanceAfter, amount, now, userId)
  
  const transactionId = `ct_${nanoid(12)}`
  db.prepare(
    'INSERT INTO credit_transactions (id, user_id, type, amount, balance_before, balance_after, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(transactionId, userId, 'consume', -amount, balanceBefore, balanceAfter, description, now)
  
  const logId = `ul_${nanoid(12)}`
  const detailsJson = details ? JSON.stringify(details) : null
  db.prepare(
    'INSERT INTO usage_logs (id, user_id, action, credits_cost, details, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(logId, userId, action, amount, detailsJson, now)
  
  return {
    success: true,
    balanceBefore,
    balanceAfter,
    transactionId,
  }
}

export function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'gift' | 'admin' | 'refund',
  description: string
): CreditsInfo | null {
  const user = getUserById(userId)
  if (!user) return null
  
  const balanceBefore = user.credits
  const balanceAfter = user.credits + amount
  const now = Date.now()
  
  db.prepare('UPDATE users SET credits = ?, updated_at = ? WHERE id = ?')
    .run(balanceAfter, now, userId)
  
  const transactionId = `ct_${nanoid(12)}`
  db.prepare(
    'INSERT INTO credit_transactions (id, user_id, type, amount, balance_before, balance_after, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(transactionId, userId, type, amount, balanceBefore, balanceAfter, description, now)
  
  return { balance: balanceAfter, used: user.creditsUsed }
}
