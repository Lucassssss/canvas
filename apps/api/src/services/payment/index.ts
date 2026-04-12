import Payment from 'wechatpay-node-v3'
import { db } from '../../db'
import { orders, rechargePackages, users, creditTransactions } from '../../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs'

const RECHARGE_PACKAGES = [
  { id: 'pkg_50', credits: 50, price: 10, unitPrice: '0.1000', savings: 0, popular: 0, sortOrder: 1 },
  { id: 'pkg_200', credits: 200, price: 18, unitPrice: '0.0900', savings: 10, popular: 0, sortOrder: 2 },
  { id: 'pkg_500', credits: 500, price: 40, unitPrice: '0.0800', savings: 20, popular: 1, sortOrder: 3 },
  { id: 'pkg_1000', credits: 1000, price: 70, unitPrice: '0.0700', savings: 30, popular: 0, sortOrder: 4 },
  { id: 'pkg_2000', credits: 2000, price: 120, unitPrice: '0.0600', savings: 40, popular: 0, sortOrder: 5 },
  { id: 'pkg_5000', credits: 5000, price: 250, unitPrice: '0.0500', savings: 50, popular: 0, sortOrder: 6 },
]

const POLL_CONFIG = {
  MAX_POLL_COUNT: 30,
  MIN_POLL_INTERVAL_MS: 2000,
  ORDER_EXPIRE_MINUTES: 30,
}

function getPaymentInstance() {
  const privateKeyPath = path.resolve(process.cwd(), process.env.WECHAT_PRIVATE_KEY_PATH || 'certs/apiclient_key.pem')
  const publicKeyPath = path.resolve(process.cwd(), process.env.WECHAT_PUBLIC_KEY_PATH || 'certs/apiclient_cert.pem')

  let privateKey = ''
  let publicKey = ''

  try {
    privateKey = fs.readFileSync(privateKeyPath, 'utf-8')
    publicKey = fs.readFileSync(publicKeyPath, 'utf-8')
  } catch (error) {
    console.error('Failed to read WeChat Pay certificates:', error)
    throw new Error('WeChat Pay certificates not found')
  }

  return new Payment({
    appid: process.env.WECHAT_APPID || '',
    mchid: process.env.WECHAT_MCH_ID || '',
    publicKey: Buffer.from(publicKey),
    privateKey: Buffer.from(privateKey),
    key: process.env.WECHAT_API_V3_KEY || '',
  })
}

export async function getRechargePackages() {
  const packages = await db.select()
    .from(rechargePackages)
    .where(eq(rechargePackages.isActive, 1))
    .orderBy(rechargePackages.sortOrder)

  if (packages.length === 0) {
    return RECHARGE_PACKAGES
  }

  return packages.map(pkg => ({
    id: pkg.id,
    credits: pkg.credits,
    price: pkg.price,
    unitPrice: parseFloat(pkg.unitPrice),
    savings: pkg.savings || 0,
    popular: pkg.popular === 1,
  }))
}

export async function createPaymentOrder(userId: string, credits: number) {
  console.log('[Payment] createPaymentOrder called:', { userId, credits })

  const packages = await getRechargePackages()
  const selectedPackage = packages.find(pkg => pkg.credits === credits)

  console.log('[Payment] Selected package:', selectedPackage)

  if (!selectedPackage) {
    console.error('[Payment] Invalid package for credits:', credits)
    return { success: false, error: '无效的积分套餐' }
  }

  const orderId = `ord_${nanoid(16)}`
  const orderNo = `${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  const expireAt = new Date(Date.now() + 30 * 60 * 1000)

  console.log('[Payment] Order created:', { orderId, orderNo, expireAt })

  try {
    console.log('[Payment] Checking WeChat Pay config:', {
      appid: process.env.WECHAT_APPID ? '已配置' : '未配置',
      mchid: process.env.WECHAT_MCH_ID ? '已配置' : '未配置',
      apiKey: process.env.WECHAT_API_V3_KEY ? '已配置' : '未配置',
      notifyUrl: process.env.WECHAT_NOTIFY_URL || '未配置',
      privateKeyPath: process.env.WECHAT_PRIVATE_KEY_PATH || '默认路径',
    })

    const payment = getPaymentInstance()
    console.log('[Payment] Payment instance created')

    const orderParams = {
      description: `Joii积分充值-${credits}积分`,
      out_trade_no: orderNo,
      amount: {
        total: selectedPackage.price * 100,
        currency: 'CNY',
      },
      notify_url: process.env.WECHAT_NOTIFY_URL || '',
    }
    console.log('[Payment] Calling WeChat Pay API with params:', JSON.stringify(orderParams, null, 2))

    const result = await payment.transactions_native(orderParams)
    console.log('[Payment] WeChat Pay API response:', JSON.stringify(result, null, 2))

    const codeUrl = result?.data?.code_url

    if (!codeUrl) {
      console.error('[Payment] WeChat Pay response missing code_url:', result)
      return { success: false, error: '微信支付下单失败' }
    }

    await db.insert(orders).values({
      id: orderId,
      orderNo,
      userId,
      credits: selectedPackage.credits,
      amount: selectedPackage.price * 100,
      status: 'pending',
      paymentMethod: 'wechat',
      qrCodeUrl: codeUrl,
      expireAt,
    })

    console.log('[Payment] Order saved to database:', orderId)

    return {
      success: true,
      data: {
        orderId,
        orderNo,
        credits: selectedPackage.credits,
        amount: selectedPackage.price * 100,
        qrCodeUrl: codeUrl,
        expireAt,
      },
    }
  } catch (error: any) {
    console.error('[Payment] Create payment order error:', {
      message: error?.message,
      stack: error?.stack,
      response: error?.response?.data,
      code: error?.code,
    })
    return { success: false, error: '创建订单失败: ' + (error?.message || '未知错误') }
  }
}

export async function getOrderStatus(orderId: string, userId: string) {
  const order = await db.select()
    .from(orders)
    .where(and(
      eq(orders.id, orderId),
      eq(orders.userId, userId)
    ))
    .limit(1)

  if (order.length === 0) {
    return { success: false, error: '订单不存在' }
  }

  return { success: true, data: order[0] }
}

export async function getUserOrders(userId: string, page = 1, limit = 10) {
  const offset = (page - 1) * limit

  const ordersList = await db.select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)

  const totalResult = await db.select()
    .from(orders)
    .where(eq(orders.userId, userId))

  return {
    success: true,
    data: {
      orders: ordersList,
      total: totalResult.length,
      page,
      limit,
    },
  }
}

export async function handlePaymentCallback(notification: any) {
  try {
    const payment = getPaymentInstance()

    const decrypted = payment.decipher_gcm(
      notification.resource.ciphertext,
      notification.resource.associated_data,
      notification.resource.nonce,
      process.env.WECHAT_API_V3_KEY
    )

    const data = JSON.parse(decrypted)

    if (data.trade_state !== 'SUCCESS') {
      return { code: 'SUCCESS', message: '非成功支付' }
    }

    const order = await db.select()
      .from(orders)
      .where(eq(orders.orderNo, data.out_trade_no))
      .limit(1)

    if (order.length === 0) {
      return { code: 'FAIL', message: '订单不存在' }
    }

    const orderData = order[0]

    if (orderData.status === 'paid') {
      return { code: 'SUCCESS', message: '已处理' }
    }

    await db.transaction(async (tx) => {
      await tx.update(orders)
        .set({
          status: 'paid',
          transactionId: data.transaction_id,
          paidAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderData.id))

      const user = await tx.select()
        .from(users)
        .where(eq(users.id, orderData.userId))
        .limit(1)

      if (user.length === 0) {
        throw new Error('用户不存在')
      }

      const balanceBefore = user[0].credits
      const balanceAfter = balanceBefore + orderData.credits

      await tx.update(users)
        .set({
          credits: balanceAfter,
          updatedAt: new Date(),
        })
        .where(eq(users.id, orderData.userId))

      await tx.insert(creditTransactions).values({
        id: `txn_${nanoid(16)}`,
        userId: orderData.userId,
        type: 'purchase',
        amount: orderData.credits,
        balanceBefore,
        balanceAfter,
        description: `充值${orderData.credits}积分`,
      })
    })

    return { code: 'SUCCESS', message: '成功' }
  } catch (error) {
    console.error('Handle payment callback error:', error)
    return { code: 'FAIL', message: '处理失败' }
  }
}

export async function seedRechargePackages() {
  for (const pkg of RECHARGE_PACKAGES) {
    const existing = await db.select()
      .from(rechargePackages)
      .where(eq(rechargePackages.id, pkg.id))
      .limit(1)

    if (existing.length === 0) {
      await db.insert(rechargePackages).values({
        ...pkg,
        isActive: 1,
      })
    }
  }

  return { success: true, message: '套餐数据初始化完成' }
}

export async function queryWechatPayStatus(orderId: string, userId: string) {
  const order = await db.select()
    .from(orders)
    .where(and(
      eq(orders.id, orderId),
      eq(orders.userId, userId)
    ))
    .limit(1)

  if (order.length === 0) {
    return { success: false, error: '订单不存在', code: 'ORDER_NOT_FOUND' }
  }

  const orderData = order[0]

  if (orderData.status === 'paid') {
    return {
      success: true,
      data: orderData,
      message: '订单已支付',
      code: 'ALREADY_PAID'
    }
  }

  if (orderData.status === 'cancelled' || orderData.status === 'refunded') {
    return {
      success: false,
      error: '订单已取消或已退款',
      data: orderData,
      code: 'ORDER_CANCELLED'
    }
  }

  const now = new Date()
  if (orderData.expireAt < now) {
    await db.update(orders)
      .set({ status: 'expired', updatedAt: now })
      .where(eq(orders.id, orderId))

    return {
      success: false,
      error: '订单已过期',
      data: { ...orderData, status: 'expired' },
      code: 'ORDER_EXPIRED'
    }
  }

  if (orderData.pollCount >= POLL_CONFIG.MAX_POLL_COUNT) {
    return {
      success: false,
      error: '查询次数已达上限',
      data: orderData,
      code: 'POLL_LIMIT_REACHED'
    }
  }

  if (orderData.lastPolledAt) {
    const timeSinceLastPoll = now.getTime() - new Date(orderData.lastPolledAt).getTime()
    if (timeSinceLastPoll < POLL_CONFIG.MIN_POLL_INTERVAL_MS) {
      const waitSeconds = Math.ceil((POLL_CONFIG.MIN_POLL_INTERVAL_MS - timeSinceLastPoll) / 1000)
      return {
        success: true,
        data: orderData,
        message: `请${waitSeconds}秒后再试`,
        code: 'POLL_TOO_FAST',
        waitSeconds
      }
    }
  }

  try {
    const payment = getPaymentInstance()
    const mchid = process.env.WECHAT_MCH_ID || ''

    const result = await payment.query({
      out_trade_no: orderData.orderNo,
      mchid,
    })

    console.log('[Payment] WeChat query result:', JSON.stringify(result, null, 2))

    const tradeState = result?.data?.trade_state
    const transactionId = result?.data?.transaction_id

    await db.update(orders)
      .set({
        pollCount: (orderData.pollCount || 0) + 1,
        lastPolledAt: now,
        updatedAt: now,
      })
      .where(eq(orders.id, orderId))

    if (tradeState === 'SUCCESS') {
      await db.transaction(async (tx) => {
        await tx.update(orders)
          .set({
            status: 'paid',
            transactionId: transactionId,
            paidAt: now,
            updatedAt: now,
          })
          .where(eq(orders.id, orderId))

        const user = await tx.select()
          .from(users)
          .where(eq(users.id, userId))
          .limit(1)

        if (user.length === 0) {
          throw new Error('用户不存在')
        }

        const balanceBefore = user[0].credits
        const balanceAfter = balanceBefore + orderData.credits

        await tx.update(users)
          .set({
            credits: balanceAfter,
            updatedAt: now,
          })
          .where(eq(users.id, userId))

        await tx.insert(creditTransactions).values({
          id: `txn_${nanoid(16)}`,
          userId: userId,
          type: 'purchase',
          amount: orderData.credits,
          balanceBefore,
          balanceAfter,
          description: `充值${orderData.credits}积分`,
        })
      })

      const updatedOrder = await db.select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1)

      return {
        success: true,
        data: updatedOrder[0],
        message: '支付成功',
        code: 'PAYMENT_SUCCESS'
      }
    }

    if (tradeState === 'CLOSED' || tradeState === 'PAYERROR') {
      await db.update(orders)
        .set({ status: 'cancelled', updatedAt: now })
        .where(eq(orders.id, orderId))

      return {
        success: false,
        error: '支付失败或已关闭',
        data: { ...orderData, status: 'cancelled' },
        code: 'PAYMENT_FAILED'
      }
    }

    const updatedOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    return {
      success: true,
      data: updatedOrder[0],
      message: '等待支付中',
      code: 'WAITING_PAYMENT'
    }

  } catch (error: any) {
    console.error('[Payment] Query WeChat pay status error:', error)

    const updatedOrder = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    return {
      success: true,
      data: updatedOrder[0],
      message: '查询失败，请稍后重试',
      code: 'QUERY_ERROR'
    }
  }
}
