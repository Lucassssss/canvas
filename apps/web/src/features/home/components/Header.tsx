'use client'

import React, { useState } from 'react'
import { ChevronDown, Globe, User as UserIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/useAuth'
import { CreditsBadge } from '@/components/CreditsBadge'
import { UserMenu } from '@/components/UserMenu'

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

export function Header() {
  const [currentLang, setCurrentLang] = useState(languages[0])
  const { isAuthenticated, openLoginModal } = useAuth()

  return (
    <header className="w-full h-16 md:h-20 sticky top-0 z-50 bg-neutral-100 border-b border-neutral-200">
      <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/joii_logo_fa.svg" alt="joii" className="h-6" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-neutral-50 transition-colors text-neutral-600 rounded-lg">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-sans-zh">{currentLang.name}</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-neutral-200">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setCurrentLang(lang)}
                  className="hover:bg-neutral-50 cursor-pointer text-neutral-700 text-sm font-sans-zh"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <>
              <CreditsBadge />
              <UserMenu />
            </>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-950 rounded-lg hover:bg-neutral-800 transition-all text-sm font-medium text-white"
            >
              <UserIcon className="w-4 h-4" />
              <span className="font-sans-zh">登录</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
