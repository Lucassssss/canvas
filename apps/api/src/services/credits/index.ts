import { db, users, creditTransactions, usageLogs } from '../../db/index.js'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getUserById } from '../auth/index.js'
import { getCreditsForModel, getAllEnabledModels } from './rules.js'
import type { CreditsInfo, CreditTransaction, UsageLog, ConsumeCreditsResponse } from '../../types/auth.js'

export async function getCreditsInfo(userId: string): Promise<CreditsInfo | null> {
  const user = await getUserById(userId)
  if (!user) return null
  
  return {
    balance: user.credits,
    used: user.creditsUsed,
  }
}

export async function getTransactions(userId: string, limit = 50, offset = 0): Promise<CreditTransaction[]> {
  const rows = await db.select().from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit)
    .offset(offset)
  
  return rows.map(row => ({
    id: row.id,
    userId: row.userId,
    type: row.type,
    amount: row.amount,
    balanceBefore: row.balanceBefore,
    balanceAfter: row.balanceAfter,
    description: row.description ?? undefined,
    createdAt: row.createdAt,
  }))
}

export async function getUsageLogs(userId: string, limit = 50, offset = 0): Promise<UsageLog[]> {
  const rows = await db.select().from(usageLogs)
    .where(eq(usageLogs.userId, userId))
    .orderBy(desc(usageLogs.createdAt))
    .limit(limit)
    .offset(offset)
  
  return rows.map(row => ({
    id: row.id,
    userId: row.userId,
    action: row.action,
    creditsCost: row.creditsCost ?? 0,
    details: row.details ?? undefined,
    createdAt: row.createdAt,
  }))
}

export async function getPricingInfo() {
  return getAllEnabledModels()
}

export async function checkCredits(userId: string, modelId: string): Promise<{
  sufficient: boolean
  required: number
  current: number
}> {
  const user = await getUserById(userId)
  if (!user) {
    return { sufficient: false, required: 0, current: 0 }
  }
  
  const required = getCreditsForModel(modelId)
  
  return {
    sufficient: user.credits >= required,
    required,
    current: user.credits,
  }
}

export async function consumeCredits(
  userId: string,
  modelId: string,
  action: string,
  description: string,
  details?: Record<string, unknown>
): Promise<ConsumeCreditsResponse> {
  const amount = getCreditsForModel(modelId)
  
  try {
    return await db.transaction(async (tx) => {
      const userResult = await tx.select({
        credits: users.credits,
        creditsUsed: users.creditsUsed
      })
      .from(users)
      .where(eq(users.id, userId))
      .for('update')
      .limit(1)
      
      if (userResult.length === 0) {
        return { success: false, balanceBefore: 0, balanceAfter: 0, error: '用户不存在' }
      }
      
      const userRow = userResult[0]
      const currentCredits = userRow.credits
      const currentCreditsUsed = userRow.creditsUsed
      
      if (currentCredits < amount) {
        return {
          success: false,
          balanceBefore: currentCredits,
          balanceAfter: currentCredits,
          error: '积分不足',
        }
      }
      
      const balanceBefore = currentCredits
      const balanceAfter = currentCredits - amount
      
      await tx.update(users)
        .set({ 
          credits: balanceAfter, 
          creditsUsed: currentCreditsUsed + amount, 
        })
        .where(eq(users.id, userId))
      
      const transactionId = `ct_${nanoid(12)}`
      await tx.insert(creditTransactions).values({
        id: transactionId,
        userId,
        type: 'consume',
        amount: -amount,
        balanceBefore,
        balanceAfter,
        description,
      })
      
      const logId = `ul_${nanoid(12)}`
      const detailsJson = details ? JSON.stringify(details) : null
      await tx.insert(usageLogs).values({
        id: logId,
        userId,
        action,
        creditsCost: amount,
        details: detailsJson,
      })
      
      return {
        success: true,
        balanceBefore,
        balanceAfter,
        transactionId,
      }
    })
  } catch (error) {
    console.error('[Credits] Consume credits transaction failed:', error)
    return {
      success: false,
      balanceBefore: 0,
      balanceAfter: 0,
      error: '积分消费失败，请重试',
    }
  }
}

export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'gift' | 'admin' | 'refund',
  description: string
): Promise<CreditsInfo | null> {
  const user = await getUserById(userId)
  if (!user) return null
  
  const balanceBefore = user.credits
  const balanceAfter = user.credits + amount
  
  try {
    await db.transaction(async (tx) => {
      await tx.update(users)
        .set({ credits: balanceAfter })
        .where(eq(users.id, userId))
      
      const transactionId = `ct_${nanoid(12)}`
      await tx.insert(creditTransactions).values({
        id: transactionId,
        userId,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        description,
      })
    })
    
    return { balance: balanceAfter, used: user.creditsUsed }
  } catch (error) {
    console.error('[Credits] Add credits transaction failed:', error)
    return null
  }
}
