import { db, verificationCodes } from '../../db/index.js'
import { eq, and, gt, isNull, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525'
import * as $OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'

const SMS_CODE_LENGTH = parseInt(process.env.SMS_CODE_LENGTH || '6')
const SMS_CODE_EXPIRY_MS = 5 * 60 * 1000

interface SendCodeResult {
  success: boolean
  message: string
}

export async function sendVerificationCode(phone: string): Promise<SendCodeResult> {
  try {
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
  } catch (error) {
    console.error('[SMS] sendVerificationCode error:', error)
    return { success: false, message: '发送验证码失败，请稍后重试' }
  }
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
  
  try {
    let config = new $OpenApi.Config({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
    });
    config.endpoint = `dysmsapi.aliyuncs.com`;
    
    const client = new Dysmsapi20170525(config);
    
    let sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
      phoneNumbers: phone,
      signName: signName,
      templateCode: templateCode,
      templateParam: JSON.stringify({ code }),
    });
    
    let runtime = new $Util.RuntimeOptions({ });
    const response = await client.sendSmsWithOptions(sendSmsRequest, runtime);
    
    if (response.body?.code !== 'OK') {
      console.error('[SMS] Aliyun SMS send failed:', response.body);
      throw new Error(`Aliyun returned ${response.body?.code}: ${response.body?.message}`);
    }
    
    console.log(`[SMS] Successfully sent via Aliyun to ${phone}`);
  } catch (error) {
    console.error(`[SMS] Exception when sending Aliyun SMS to ${phone}:`, error);
    throw error;
  }
}

export async function verifyCode(phone: string, code: string): Promise<boolean> {
  try {
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
  } catch (error) {
    console.error('[SMS] verifyCode error:', error)
    return false
  }
}

export async function invalidateCode(phone: string): Promise<void> {
  try {
    const now = new Date()
    await db.update(verificationCodes)
      .set({ usedAt: now })
      .where(
        and(
          eq(verificationCodes.phone, phone),
          isNull(verificationCodes.usedAt)
        )
      )
  } catch (error) {
    console.error('[SMS] invalidateCode error:', error)
  }
}
