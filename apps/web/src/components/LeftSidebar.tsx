'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Folder, User, HelpCircle, Plus, Newspaper, Menu } from 'lucide-react'
import { useProjectStore } from '@/store/project-store'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function LeftSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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
    <>
      <div className="sidebar-left shadow-md max-md:hidden">
        <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleNewProject}
            disabled={isCreating}
            className="sidebar-left-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} className={isCreating ? 'animate-spin' : ''} />
          </button>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>{isCreating ? '创建中...' : '新建'}</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/dashboard"
            className={`sidebar-left-btn ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>首页</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/projects"
            className={`sidebar-left-btn ${isActive('/projects') ? 'active' : ''}`}
          >
            <Folder size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>项目</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/profile"
            className={`sidebar-left-btn ${isActive('/profile') ? 'active' : ''}`}
          >
            <User size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>个人</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/news"
            className={`sidebar-left-btn ${isActive('/news') ? 'active' : ''}`}
          >
            <Newspaper size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>新闻</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/help"
            className={`sidebar-left-btn ${isActive('/help') ? 'active' : ''}`}
          >
            <HelpCircle size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p>帮助</p>
        </TooltipContent>
      </Tooltip>
    </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <button
            className="md:hidden fixed bottom-6 right-6 w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-xl z-50 hover:scale-105 transition-transform"
          >
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col p-0">
          <SheetHeader className="p-6 border-b border-neutral-100 text-left">
            <SheetTitle>
              <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            <button
              onClick={(e) => {
                handleNewProject(e)
                setIsMobileMenuOpen(false)
              }}
              disabled={isCreating}
              className="flex items-center gap-4 p-4 bg-neutral-900 text-white rounded-2xl font-medium w-full disabled:opacity-50"
            >
              <Plus size={24} className={isCreating ? 'animate-spin' : ''} />
              {isCreating ? '创建中...' : '新建项目'}
            </button>

            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-colors ${isActive('/') ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Home size={24} />
              首页
            </Link>

            <Link
              href="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-colors ${isActive('/projects') ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Folder size={24} />
              项目
            </Link>

            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-colors ${isActive('/profile') ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <User size={24} />
              个人
            </Link>

            <Link
              href="/news"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-colors ${isActive('/news') ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <Newspaper size={24} />
              新闻
            </Link>

            <Link
              href="/help"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-4 p-4 rounded-2xl font-medium transition-colors ${isActive('/help') ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-600 hover:bg-neutral-50'}`}
            >
              <HelpCircle size={24} />
              帮助
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
