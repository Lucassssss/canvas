'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Headset } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'

export function BrowserNavbar() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
      <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/joii_berry_logo_withtext.svg" alt="Joii Berry" className="h-6" height="24" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 font-sans-zh text-sm text-neutral-500">
            <Link href="#features" className="hover:text-neutral-950 transition-colors">核心优势</Link>
            <Link href="#contact" className="hover:text-neutral-950 transition-colors">专属方案</Link>
            <Link href="/news" className="hover:text-neutral-950 transition-colors">最新资讯</Link>
            <Link href="/help" className="hover:text-neutral-950 transition-colors">帮助支持</Link>
          </nav>
        </div>
        
        {/* 右侧：CTA 行动呼唤 */}
        <div className="flex items-center gap-4">
          <a href="#contact" className="font-sans-zh text-sm text-neutral-500 hover:text-neutral-950 transition-colors hidden md:flex items-center gap-1.5">
            <Headset className="w-4 h-4" />
            联系顾问
          </a>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2B7FFF] text-white font-sans-zh text-sm font-medium hover:bg-[#2266cc] transition-colors shadow-md">
            免费下载客户端
          </button>
        </div>

      </div>
    </header>
  )
}
