import { Router, Request, Response } from 'express'
import { consumeCredits } from '../services/credits/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/consume', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '未授权' })
    }
    
    const { amount, action, description, details } = req.body
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ success: false, error: '无效的积分数量' })
    }
    
    if (!action) {
      return res.status(400).json({ success: false, error: '操作类型不能为空' })
    }
    
    const result = await consumeCredits(
      req.user.userId,
      amount,
      action,
      description || '',
      details
    )
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('[Credits] Consume error:', error)
    res.status(500).json({ success: false, error: '积分消费失败' })
  }
})

export default router
