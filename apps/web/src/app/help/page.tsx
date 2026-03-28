'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Home, Folder, User, HelpCircle } from 'lucide-react'

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
      <Link href="/help" className={`sidebar-left-btn ${isActive('/help') ? 'active' : ''}`} title="帮助">
        <HelpCircle size={20} />
      </Link>
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <LeftSidebar />
      <main className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-neutral-900">帮助中心</h1>
          <p className="text-neutral-500 mt-2">帮助页面开发中...</p>
        </div>
      </main>
    </div>
  )
}
