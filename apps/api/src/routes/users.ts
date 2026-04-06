import { Router, Request, Response } from 'express'
import { getUserProfile, updateUserProfile } from '../services/users/index.js'
import { getCreditsInfo, getTransactions, getUsageLogs } from '../services/credits/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const profile = await getUserProfile(req.user.userId)
    
    if (!profile) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json({ profile })
  } catch (error) {
    console.error('[Users] Get profile error:', error)
    res.status(500).json({ error: '获取用户资料失败' })
  }
})

router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const { nickname, avatarUrl } = req.body
    
    const profile = await updateUserProfile(req.user.userId, { nickname, avatarUrl })
    
    if (!profile) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json({ profile })
  } catch (error) {
    console.error('[Users] Update profile error:', error)
    res.status(500).json({ error: '更新用户资料失败' })
  }
})

router.get('/credits', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const credits = await getCreditsInfo(req.user.userId)
    
    if (!credits) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json(credits)
  } catch (error) {
    console.error('[Users] Get credits error:', error)
    res.status(500).json({ error: '获取积分信息失败' })
  }
})

router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0
    
    const transactions = await getTransactions(req.user.userId, limit, offset)
    
    res.json({ transactions })
  } catch (error) {
    console.error('[Users] Get transactions error:', error)
    res.status(500).json({ error: '获取积分记录失败' })
  }
})

router.get('/usage-logs', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0
    
    const logs = await getUsageLogs(req.user.userId, limit, offset)
    
    res.json({ logs })
  } catch (error) {
    console.error('[Users] Get usage logs error:', error)
    res.status(500).json({ error: '获取消费记录失败' })
  }
})

export default router
