'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Globe, Sparkles, Plus, Home, Folder, User, HelpCircle } from 'lucide-react'

const languages = [
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
]

function Header() {
  const [currentLang, setCurrentLang] = useState(languages[0])

  return (
    <header className="w-full sticky top-0 z-40 bg-gray-50">
      <div className="w-full px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/joii_logo_fa.svg" alt="joii" className="h-8" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            模板中心
          </button>
          <button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
            定价
          </button>
          
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-700">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{currentLang.name}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <button className="px-4 py-1.5 rounded-lg bg-black text-white text-sm hover:bg-neutral-800 transition-colors">
            登录
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <span className="text-sm text-amber-600 font-medium">AI 驱动的创意平台</span>
      </div>
      <h1 className="text-5xl font-bold text-neutral-900 leading-tight">
        释放创意<br />
        <span className="text-neutral-400">让 AI 为你绘画</span>
      </h1>
      <p className="text-lg text-neutral-500 max-w-lg leading-relaxed">
        无论是产品展示、品牌形象还是创意表达，只需简单描述，AI 即可为你生成令人惊叹的视觉作品
      </p>
    </div>
  )
}

function SearchSection() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="relative">
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="描述你想要创建的图片，或选择下方快捷功能开始..."
        rows={4}
        className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-5 py-3.5 pr-28 shadow-sm text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-neutral-300 focus:ring-2 focus:ring-black/5 focus:outline-none"
      />
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
        <button
          className={`p-2 rounded-lg transition-all ${inputValue.trim() ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
          disabled={!inputValue.trim()}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function QuickTags() {
  const quickTags = [
    { label: '服装模特', icon: '👗' },
    { label: '产品展示', icon: '📦' },
    { label: '场景合成', icon: '🎬' },
    { label: '风格迁移', icon: '🎨' },
    { label: '人像精修', icon: '✨' },
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      {quickTags.map((tag, index) => (
        <button
          key={index}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all"
        >
          <span className="text-sm">{tag.icon}</span>
          <span className="text-xs font-medium text-neutral-600">{tag.label}</span>
        </button>
      ))}
    </div>
  )
}

function LeftSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="sidebar-left shadow-md">
      <Link href="/canvas" className="sidebar-left-btn" title="新建">
        <Plus size={20} />
      </Link>
      <Link href="/" className={`sidebar-left-btn ${isActive('/') ? 'active' : ''}`} title="首页">
        <Home size={20} />
      </Link>
      <Link href="/projects" className={`sidebar-left-btn ${isActive('/projects') ? 'active' : ''}`} title="项目">
        <Folder size={20} />
      </Link>
      <Link href="/profile" className={`sidebar-left-btn ${isActive('/profile') ? 'active' : ''}`} title="个人">
        <User size={20} />
      </Link>
      <Link href="/help" className="sidebar-left-btn" title="帮助">
        <HelpCircle size={20} />
      </Link>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-neutral-900">
      <LeftSidebar />
      <Header />
      
      <main className="w-full">
        <div className="w-full px-8">
          <div className="max-w-4xl mx-auto min-h-[200px] pt-[150px] flex flex-col justify-center">
            <Hero />
            
            <div className="mt-8 space-y-4">
              <SearchSection />
              <QuickTags />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
