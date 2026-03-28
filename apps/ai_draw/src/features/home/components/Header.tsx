import React, { useState } from 'react'
import { ChevronDown, Globe, Sparkles } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

interface HeaderProps {
  onEnterCanvas?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onEnterCanvas }) => {
  const [currentLang, setCurrentLang] = useState(languages[0])

  return (
    <header className="w-full sticky top-0 z-50 bg-gray-50">
      <div className="w-full px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* <img src="/joii_logo.svg" alt="joii" className="h-10" /> */}
            <img src="/joii_logo_fa.svg" alt="joii" className="h-8" />
          </a>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{currentLang.name}</span>
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-neutral-200">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setCurrentLang(lang)}
                  className="hover:bg-neutral-100 cursor-pointer text-neutral-700"
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-all text-sm font-medium text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>升级</span>
          </button>
        </div>
      </div>
    </header>
  )
}
