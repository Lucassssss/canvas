'use client'

import React from 'react'
import { Zap } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import { cn } from '@/lib/utils'

interface CreditsBadgeProps {
  className?: string
}

export function CreditsBadge({ className }: CreditsBadgeProps) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) return null

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-full cursor-pointer text-sm font-medium text-neutral-800",
        className
      )}
      title="当前积分"
    >
      <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
      <span>{user.credits}</span>
    </div>
  )
}
