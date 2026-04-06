import { db, verificationCodes } from '../../db/index.js'
import { eq, and, gt, isNull, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

const SMS_CODE_LENGTH = parseInt(process.env.SMS_CODE_LENGTH || '6')
const SMS_CODE_EXPIRY_MS = 5 * 60 * 1000

interface SendCodeResult {
  success: boolean
  message: string
}

export async function sendVerificationCode(phone: string): Promise<SendCodeResult> {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }
  
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
  
  const recentCodes = await db.select({ count: sql<number>`count(*)` })
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.phone, phone),
        gt(verificationCodes.createdAt, oneMinuteAgo)
      )
    )
    .limit(1)
  
  if (recentCodes[0] && recentCodes[0].count >= 3) {
    return { success: false, message: '发送过于频繁，请稍后再试' }
  }
  
  const code = Array.from({ length: SMS_CODE_LENGTH }, () => 
    Math.floor(Math.random() * 10).toString()
  ).join('')
  
  await db.update(verificationCodes)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(verificationCodes.phone, phone),
        isNull(verificationCodes.usedAt)
      )
    )
  
  const id = `vc_${nanoid(12)}`
  const expiresAt = new Date(Date.now() + SMS_CODE_EXPIRY_MS)
  
  await db.insert(verificationCodes).values({
    id,
    phone,
    code,
    expiresAt,
  })
  
  if (process.env.SMS_PROVIDER === 'aliyun') {
    await sendViaAliyun(phone, code)
  } else {
    console.log(`[SMS] Mock mode - Code for ${phone}: ${code}`)
  }
  
  return { success: true, message: '验证码已发送' }
}

async function sendViaAliyun(phone: string, code: string): Promise<void> {
  const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID
  const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET
  const signName = process.env.ALIYUN_SIGN_NAME
  const templateCode = process.env.ALIYUN_TEMPLATE_CODE
  
  if (!accessKeyId || !accessKeySecret || !signName || !templateCode) {
    console.log('[SMS] Aliyun credentials not configured, using mock mode')
    return
  }
  
  console.log(`[SMS] Sending via Aliyun to ${phone} with code ${code}`)
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  const now = new Date()
  
  const [record] = await db.select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.phone, phone),
        eq(verificationCodes.code, code),
        gt(verificationCodes.expiresAt, now),
        isNull(verificationCodes.usedAt)
      )
    )
    .orderBy(verificationCodes.createdAt)
    .limit(1)
  
  if (!record) {
    return false
  }
  
  await db.update(verificationCodes)
    .set({ usedAt: now })
    .where(eq(verificationCodes.id, record.id))
  
  return true
}

export async function invalidateCode(phone: string): Promise<void> {
  const now = new Date()
  await db.update(verificationCodes)
    .set({ usedAt: now })
    .where(
      and(
        eq(verificationCodes.phone, phone),
        isNull(verificationCodes.usedAt)
      )
    )
}
