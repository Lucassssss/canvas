'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

interface AuthGuardProps {
  children: React.ReactNode
  /** 重定向目标，默认 /login */
  redirectTo?: string
}

/**
 * 纯客户端路由守卫
 * 不依赖 Next.js 服务端能力，可静态导出使用
 * - isLoading 期间显示全屏 loading（避免内容闪现）
 * - 确认未登录后跳转 redirectTo
 */
export function AuthGuard({ children, redirectTo = '/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  // 加载中：显示占位，防止内容提前渲染
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f4f5]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-950 rounded-full animate-spin" />
          <p className="font-sans-zh text-sm text-neutral-400">加载中…</p>
        </div>
      </div>
    )
  }

  // 未认证：什么都不渲染（跳转中）
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
