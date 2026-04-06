import { db, users, creditTransactions, usageLogs } from '../../db/index.js'
import { eq, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { getUserById } from '../auth/index.js'
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

export async function consumeCredits(
  userId: string,
  amount: number,
  action: string,
  description: string,
  details?: Record<string, unknown>
): Promise<ConsumeCreditsResponse> {
  const user = await getUserById(userId)
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
  
  try {
    await db.transaction(async (tx) => {
      await tx.update(users)
        .set({ 
          credits: balanceAfter, 
          creditsUsed: user.creditsUsed + amount, 
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
    })
    
    return {
      success: true,
      balanceBefore,
      balanceAfter,
      transactionId: `ct_${nanoid(12)}`,
    }
  } catch (error) {
    console.error('[Credits] Consume credits transaction failed:', error)
    return {
      success: false,
      balanceBefore,
      balanceAfter: balanceBefore,
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
