import { db, users } from '../../db/index.js'
import { eq } from 'drizzle-orm'
import { getUserById } from '../auth/index.js'
import type { UserProfile } from '../../types/auth.js'

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await getUserById(userId)
  if (!user) return null
  
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
  }
}

export async function updateUserProfile(
  userId: string,
  data: { nickname?: string; avatarUrl?: string }
): Promise<UserProfile | null> {
  const user = await getUserById(userId)
  if (!user) return null
  
  if (data.nickname !== undefined) {
    await db.update(users)
      .set({ nickname: data.nickname })
      .where(eq(users.id, userId))
  }
  
  if (data.avatarUrl !== undefined) {
    await db.update(users)
      .set({ avatarUrl: data.avatarUrl })
      .where(eq(users.id, userId))
  }
  
  return await getUserProfile(userId)
}
