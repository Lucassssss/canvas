'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Folder, User, HelpCircle, Plus } from 'lucide-react'
import { useProjectStore } from '@/store/project-store'

export function LeftSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  
  const createProject = useProjectStore((state) => state.createProject)

  const isActive = (path: string) => pathname === path

  // 创建新项目
  const handleNewProject = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (isCreating) return
    
    setIsCreating(true)
    try {
      const projectId = await createProject('新项目')
      console.log('[LeftSidebar] Project created:', projectId)
      
      // 跳转到画布
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[LeftSidebar] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="sidebar-left shadow-md">
      <button
        onClick={handleNewProject}
        disabled={isCreating}
        className="sidebar-left-btn disabled:opacity-50 disabled:cursor-not-allowed"
        title={isCreating ? '创建中...' : '新建'}
      >
        <Plus size={20} className={isCreating ? 'animate-spin' : ''} />
      </button>
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
