import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { db, tokenBlacklist } from '../db/index.js'
import { eq } from 'drizzle-orm'
import type { JWTPayload } from '../types/auth.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'
const TOKEN_COOKIE_NAME = 'auth_token'
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token'

export function generateToken(userId: string, phone: string): { token: string; refreshToken: string; jti: string } {
  const jti = `jti_${Date.now()}_${Math.random().toString(36).substring(2)}`
  
  const token = jwt.sign(
    { userId, phone, jti },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
  
  const refreshToken = jwt.sign(
    { userId, phone, jti, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
  
  return { token, refreshToken, jti }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  const [result] = await db.select().from(tokenBlacklist).where(eq(tokenBlacklist.tokenJti, jti))
  return !!result
}

export async function blacklistToken(jti: string, expiresAt: Date): Promise<void> {
  const id = `bl_${Date.now()}_${Math.random().toString(36).substring(2)}`
  await db.insert(tokenBlacklist).values({
    id,
    tokenJti: jti,
    expiresAt,
  })
}

export function setAuthCookies(res: Response, token: string, refreshToken: string): void {
  const isProd = process.env.NODE_ENV === 'production'
  
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  })
  
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export function clearAuthCookies(res: Response): void {
  res.cookie(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
}

export function getTokenFromRequest(req: Request): string | null {
  const cookieToken = req.cookies?.[TOKEN_COOKIE_NAME]
  if (cookieToken) return cookieToken
  
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return null
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = getTokenFromRequest(req)
  
  if (!token) {
    res.status(401).json({ error: '未授权访问' })
    return
  }
  
  const decoded = verifyToken(token)
  
  if (!decoded) {
    res.status(401).json({ error: 'Token 无效或已过期' })
    return
  }
  
  if (await isTokenBlacklisted(decoded.jti)) {
    res.status(401).json({ error: 'Token 已失效' })
    return
  }
  
  req.user = decoded
  next()
}

export async function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = getTokenFromRequest(req)
  
  if (token) {
    const decoded = verifyToken(token)
    
    if (decoded && !(await isTokenBlacklisted(decoded.jti))) {
      req.user = decoded
    }
  }
  
  next()
}
