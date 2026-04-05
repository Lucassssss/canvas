'use client'

import React, { useEffect, useState } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import { CreditsBadge } from '@/components/CreditsBadge'
import { UserMenu } from '@/components/UserMenu'
import Link from 'next/link'

export const Header: React.FC = () => {
  const { isAuthenticated, openLoginModal, token } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-lg transition-all text-sm font-medium text-white opacity-50">
            <User className="w-4 h-4" />
            <span>加载中...</span>
          </button>
        </div>
      </header>
    )
  }

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <CreditsBadge className="bg-neutral-100/50" />
            <UserMenu />
          </>
        ) : (
          <button
            onClick={openLoginModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all text-sm font-medium text-white"
          >
            <User className="w-4 h-4" />
            <span>登录 / 注册</span>
          </button>
        )}
      </div>
    </header>
  )
}
