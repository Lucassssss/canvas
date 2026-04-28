/**
 * 认证 API 路由 (需要认证的端点)
 * 
 * 公开端点 (/api/auth/send-code, /api/auth/verify-code) 
 * 已移至 routes/index.ts 中直接处理
 */
import { Router, Request, Response } from 'express'
import { logout, getUserById, loginWithSSO } from '../services/auth/index.js'
import { authMiddleware, setAuthCookies, clearAuthCookies } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'

const router = Router()

/**
 * POST /api/auth/sso-login
 * 通过 SSO Token 登录
 */
router.post('/sso-login', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: "SSO Token required" });

    const ssoSecret = process.env.SSO_SECRET;
    if (!ssoSecret) return res.status(500).json({ success: false, error: "服务器未配置 SSO_SECRET" });

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, ssoSecret);
    } catch (err) {
      return res.status(401).json({ success: false, error: "无效的或已过期的 SSO Token" });
    }

    if (!decoded.phone) {
      return res.status(400).json({ success: false, error: "SSO Token 中缺少 phone 字段" });
    }

    const result = await loginWithSSO(decoded.phone);
    if (result.success) {
      setAuthCookies(res, result.token!, result.refreshToken!);
      res.json({ success: true, user: result.user });
    } else {
      res.status(500).json({ success: false, error: "自动登录失败" });
    }
  } catch (error) {
    console.error('[Auth] SSO login error:', error);
    res.status(500).json({ success: false, error: 'SSO 登录失败' });
  }
})

/**
 * POST /api/auth/logout
 * 退出登录 (需要认证)
 */
router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  try {
    if (req.user) {
      logout(req.user.jti, req.user.exp)
    }
    clearAuthCookies(res)
    res.json({ success: true })
  } catch (error) {
    console.error('[Auth] Logout error:', error)
    res.status(500).json({ success: false, error: '登出失败' })
  }
})

/**
 * GET /api/auth/me
 * 获取当前用户信息 (需要认证)
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: '未授权' })
    }
    
    const user = await getUserById(req.user.userId)
    
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
