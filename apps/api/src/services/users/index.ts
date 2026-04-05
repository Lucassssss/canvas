import db from '../database.js'
import { getUserById } from '../auth/index.js'
import type { UserProfile } from '../../types/auth.js'

export function getUserProfile(userId: string): UserProfile | null {
  const user = getUserById(userId)
  if (!user) return null
  
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
  }
}

export function updateUserProfile(
  userId: string,
  data: { nickname?: string; avatarUrl?: string }
): UserProfile | null {
  const user = getUserById(userId)
  if (!user) return null
  
  const now = Date.now()
  
  if (data.nickname !== undefined) {
    db.prepare('UPDATE users SET nickname = ?, updated_at = ? WHERE id = ?')
      .run(data.nickname, now, userId)
  }
  
  if (data.avatarUrl !== undefined) {
    db.prepare('UPDATE users SET avatar_url = ?, updated_at = ? WHERE id = ?')
      .run(data.avatarUrl, now, userId)
  }
  
  return getUserProfile(userId)
}
