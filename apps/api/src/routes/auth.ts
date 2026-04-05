import { Router, Request, Response } from 'express'
import { sendVerificationCode } from '../services/sms/index.js'
import { loginWithCode, logout, getUserById } from '../services/auth/index.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/send-code', async (req: Request, res: Response) => {
  try {
    const { phone } = req.body
    
    if (!phone) {
      return res.status(400).json({ success: false, message: '手机号不能为空' })
    }
    
    const result = await sendVerificationCode(phone)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('[Auth] Send code error:', error)
    res.status(500).json({ success: false, message: '发送验证码失败' })
  }
})

router.post('/verify-code', (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body
    
    if (!phone || !code) {
      return res.status(400).json({ success: false, error: '手机号和验证码不能为空' })
    }
    
    const result = loginWithCode(phone, code)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(401).json(result)
    }
  } catch (error) {
    console.error('[Auth] Verify code error:', error)
    res.status(500).json({ success: false, error: '登录失败' })
  }
})

router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  try {
    if (req.user) {
      logout(req.user.jti, req.user.exp)
    }
    res.json({ success: true })
  } catch (error) {
    console.error('[Auth] Logout error:', error)
    res.status(500).json({ success: false, error: '登出失败' })
  }
})

router.get('/me', authMiddleware, (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const user = getUserById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({ error: '用户不存在' })
    }
    
    res.json({ user })
  } catch (error) {
    console.error('[Auth] Get me error:', error)
    res.status(500).json({ error: '获取用户信息失败' })
  }
})

export default router
