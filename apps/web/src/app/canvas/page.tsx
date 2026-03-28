'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, Home, Folder, User, HelpCircle } from 'lucide-react'

function LeftSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="sidebar-left shadow-md">
      <Link href="/canvas" className={`sidebar-left-btn ${isActive('/canvas') ? 'active' : ''}`} title="新建">
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

export default function CanvasPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="w-full h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900">Canvas 页面</h1>
          <p className="text-neutral-500">画布编辑器开发中...</p>
        </div>
      </main>
    </div>
  )
}
