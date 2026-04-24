'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
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
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.46 7.64c.2 0 .4.04.59.1.58.21.96.79.93 1.4-.04.6-.46 1.12-1.04 1.28-.15.04-.3.06-.46.06h-.14c-.65 0-1.25-.43-1.46-1.05-.12-.34-.1-.73.06-1.05.15-.31.42-.56.74-.68.17-.06.35-.08.53-.08a1.64 1.64 0 0 1 .25.02zM12 2C6.48 2 2 6.03 2 11s4.48 9 10 9c1.05 0 2.06-.15 3-.42l3.41 1.7c.39.2.86.13 1.18-.18.31-.3.4-.77.22-1.16l-1.12-2.34C20.67 15.68 22 13.43 22 11c0-4.97-4.48-9-10-9zm5 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
            </svg>
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
