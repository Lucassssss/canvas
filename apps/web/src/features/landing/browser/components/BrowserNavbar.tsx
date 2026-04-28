'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Headset } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'

export function BrowserNavbar() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 md:h-20 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center text-neutral-500 hover:text-neutral-950 transition-colors group font-sans-zh text-sm">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            返回 Joii 首页
          </Link>
          <div className="h-4 w-px bg-neutral-200 hidden md:block"></div>
          <Link href="/browser" className="flex items-center gap-2">
            <img src="/joii_berry_logo_withtext.svg" alt="Joii Berry" className="h-6" height="24" />
          </Link>
        </div>
        
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
