'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import { CreditsBadge } from '@/components/CreditsBadge'

export function NavbarCN() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
      <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center">
            <img src="/joii_logo_fa.svg" alt="Joii" className="h-6 w-6" width="24" height="24" />
            <span className="ml-2 font-bold">Joii</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-sans-zh text-sm text-neutral-500">
            <Link href="#features" className="hover:text-neutral-950 transition-colors">核心能力</Link>
            <Link href="/browser" className="hover:text-neutral-950 transition-colors">浆果浏览器</Link>
            <Link href="#showcase" className="hover:text-neutral-950 transition-colors">实战案例</Link>
            <Link href="/news" className="hover:text-neutral-950 transition-colors">最新资讯</Link>
            <Link href="/help" className="hover:text-neutral-950 transition-colors">帮助支持</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {mounted && isAuthenticated ? (
            <>
              <CreditsBadge />
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white font-sans-zh text-sm hover:bg-neutral-800 transition-colors"
              >
                <span>进入工作台</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-sans-zh text-sm text-neutral-500 hover:text-neutral-950 transition-colors hidden md:block"
              >
                登录 / 注册
              </Link>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white font-sans-zh text-sm hover:bg-neutral-800 transition-colors">
                <span>领 1000 积分</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
