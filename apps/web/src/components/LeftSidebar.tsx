'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Folder, User, HelpCircle, Plus } from 'lucide-react'

export function LeftSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="sidebar-left shadow-md">
      <Link
        href="/canvas"
        className="sidebar-left-btn"
        title="新建"
      >
        <Plus size={20} />
      </Link>
      <Link
        href="/"
        className={`sidebar-left-btn ${isActive('/') ? 'active' : ''}`}
        title="首页"
      >
        <Home size={20} />
      </Link>
      <Link
        href="/projects"
        className={`sidebar-left-btn ${isActive('/projects') ? 'active' : ''}`}
        title="项目"
      >
        <Folder size={20} />
      </Link>
      <Link
        href="/profile"
        className={`sidebar-left-btn ${isActive('/profile') ? 'active' : ''}`}
        title="个人"
      >
        <User size={20} />
      </Link>
      <Link
        href="/help"
        className="sidebar-left-btn"
        title="帮助"
      >
        <HelpCircle size={20} />
      </Link>
    </div>
  )
}
