import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import db from '../services/database.js'
import type { JWTPayload } from '../types/auth.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production'

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

export function isTokenBlacklisted(jti: string): boolean {
  const result = db.prepare('SELECT 1 FROM token_blacklist WHERE token_jti = ?').get(jti)
  return !!result
}

export function blacklistToken(jti: string, expiresAt: number): void {
  const id = `bl_${Date.now()}_${Math.random().toString(36).substring(2)}`
  db.prepare(
    'INSERT OR IGNORE INTO token_blacklist (id, token_jti, expires_at) VALUES (?, ?, ?)'
  ).run(id, jti, expiresAt)
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: '未授权访问' })
    return
  }
  
  const token = authHeader.substring(7)
  const decoded = verifyToken(token)
  
  if (!decoded) {
    res.status(401).json({ error: 'Token 无效或已过期' })
    return
  }
  
  if (isTokenBlacklisted(decoded.jti)) {
    res.status(401).json({ error: 'Token 已失效' })
    return
  }
  
  req.user = decoded
  next()
}

export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    
    if (decoded && !isTokenBlacklisted(decoded.jti)) {
      req.user = decoded
    }
  }
  
  next()
}
