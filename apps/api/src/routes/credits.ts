import { Router, Request, Response } from 'express'
import { consumeCredits, getPricingInfo, checkCredits } from '../services/credits/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/pricing', async (req: Request, res: Response) => {
  try {
    const models = await getPricingInfo()
    res.json({ models })
  } catch (error) {
    console.error('[Credits] Get pricing error:', error)
    res.status(500).json({ success: false, error: '获取价格信息失败' })
  }
})

router.get('/check', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '未授权' })
    }
    
    const { modelId } = req.query
    
    if (!modelId || typeof modelId !== 'string') {
      return res.status(400).json({ success: false, error: '模型ID不能为空' })
    }
    
    const result = await checkCredits(req.user.userId, modelId)
    res.json(result)
  } catch (error) {
    console.error('[Credits] Check credits error:', error)
    res.status(500).json({ success: false, error: '检查积分失败' })
  }
})

router.post('/consume', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: '未授权' })
    }
    
    const { modelId, action, description, details } = req.body
    
    if (!modelId || typeof modelId !== 'string') {
      return res.status(400).json({ success: false, error: '模型ID不能为空' })
    }
    
    if (!action) {
      return res.status(400).json({ success: false, error: '操作类型不能为空' })
    }
    
    const result = await consumeCredits(
      req.user.userId,
      modelId,
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
