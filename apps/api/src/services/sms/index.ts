import db from '../database.js'
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
  
  const now = Date.now()
  const oneMinuteAgo = now - 60 * 1000
  const recentCodes = db.prepare(
    'SELECT COUNT(*) as count FROM verification_codes WHERE phone = ? AND created_at > ?'
  ).get(phone, oneMinuteAgo) as { count: number }
  
  if (recentCodes.count >= 3) {
    return { success: false, message: '发送过于频繁，请稍后再试' }
  }
  
  const code = Array.from({ length: SMS_CODE_LENGTH }, () => 
    Math.floor(Math.random() * 10).toString()
  ).join('')
  
  db.prepare(
    'UPDATE verification_codes SET used_at = ? WHERE phone = ? AND used_at IS NULL'
  ).run(now, phone)
  
  const id = `vc_${nanoid(12)}`
  const expiresAt = now + SMS_CODE_EXPIRY_MS
  
  db.prepare(
    'INSERT INTO verification_codes (id, phone, code, expires_at) VALUES (?, ?, ?, ?)'
  ).run(id, phone, code, expiresAt)
  
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

export function verifyCode(phone: string, code: string): boolean {
  const now = Date.now()
  
  const record = db.prepare(
    'SELECT * FROM verification_codes WHERE phone = ? AND code = ? AND expires_at > ? AND used_at IS NULL ORDER BY created_at DESC LIMIT 1'
  ).get(phone, code, now) as { id: string; attempts?: number } | undefined
  
  if (!record) {
    return false
  }
  
  db.prepare('UPDATE verification_codes SET used_at = ? WHERE id = ?').run(now, record.id)
  
  return true
}

export function invalidateCode(phone: string): void {
  const now = Date.now()
  db.prepare(
    'UPDATE verification_codes SET used_at = ? WHERE phone = ? AND used_at IS NULL'
  ).run(now, phone)
}
