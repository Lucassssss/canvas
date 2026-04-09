import { Router, Request, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/auth'
import {
  getRechargePackages,
  createPaymentOrder,
  getOrderStatus,
  getUserOrders,
  handlePaymentCallback,
  seedRechargePackages,
  queryWechatPayStatus,
} from '../services/payment'

const router = Router()

router.get('/packages', async (req: Request, res: Response) => {
  try {
    const packages = await getRechargePackages()
    res.json({ success: true, data: packages })
  } catch (error) {
    console.error('Get packages error:', error)
    res.status(500).json({ success: false, error: '获取套餐失败' })
  }
})

router.post('/create', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { credits } = req.body
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({ success: false, error: '未登录' })
    }
    
    if (!credits || typeof credits !== 'number') {
      return res.status(400).json({ success: false, error: '请选择充值套餐' })
    }
    
    const result = await createPaymentOrder(userId, credits)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ success: false, error: '创建订单失败' })
  }
})

router.get('/order/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({ success: false, error: '未登录' })
    }
    
    const result = await getOrderStatus(id, userId)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ success: false, error: '查询订单失败' })
  }
})

router.post('/query/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId
    
    if (!userId) {
      return res.status(401).json({ success: false, error: '未登录' })
    }
    
    const result = await queryWechatPayStatus(id, userId)
    
    if (result.code === 'ORDER_NOT_FOUND') {
      return res.status(404).json(result)
    }
    
    if (result.code === 'ORDER_EXPIRED' || result.code === 'ORDER_CANCELLED') {
      return res.status(400).json(result)
    }
    
    res.json(result)
  } catch (error) {
    console.error('Query payment status error:', error)
    res.status(500).json({ success: false, error: '查询支付状态失败' })
  }
})

router.get('/orders', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    
    if (!userId) {
      return res.status(401).json({ success: false, error: '未登录' })
    }
    
    const result = await getUserOrders(userId, page, limit)
    res.json(result)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ success: false, error: '获取订单列表失败' })
  }
})

router.post('/callback', async (req: Request, res: Response) => {
  try {
    const result = await handlePaymentCallback(req.body)
    res.json(result)
  } catch (error) {
    console.error('Payment callback error:', error)
    res.json({ code: 'FAIL', message: '处理失败' })
  }
})

router.post('/seed', async (req: Request, res: Response) => {
  try {
    const result = await seedRechargePackages()
    res.json(result)
  } catch (error) {
    console.error('Seed packages error:', error)
    res.status(500).json({ success: false, error: '初始化失败' })
  }
})

export default router
