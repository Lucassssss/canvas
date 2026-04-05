'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Folder, User, HelpCircle, Plus, Newspaper, Menu, X } from 'lucide-react'
import { useProjectStore } from '@/store/project-store'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"

export function LeftSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const createProject = useProjectStore((state) => state.createProject)

  const isActive = (path: string) => pathname === path

  const handleNewProject = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isCreating) return
    
    setIsCreating(true)
    try {
      const projectId = await createProject('新项目')
      console.log('[LeftSidebar] Project created:', projectId)
      setIsMobileMenuOpen(false)
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[LeftSidebar] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  const navItems = [
    { href: '/dashboard', icon: Home, label: '首页' },
    { href: '/projects', icon: Folder, label: '项目' },
    { href: '/profile', icon: User, label: '个人' },
    { href: '/news', icon: Newspaper, label: '新闻' },
    { href: '/help', icon: HelpCircle, label: '帮助' },
  ]

  return (
    <>
      {/* PC Sidebar - hidden on mobile/tablet, shown on lg+ */}
      <div className="hidden lg:flex sidebar-left">
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

        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`sidebar-left-btn ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-white border border-neutral-200 text-neutral-700 rounded-full flex items-center justify-center shadow-lg z-50 hover:bg-neutral-50 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-neutral-100">
            <img src="/joii_logo_fa.svg" alt="Joii" className="h-5" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
            <button
              onClick={handleNewProject}
              disabled={isCreating}
              className="flex items-center gap-3 px-3 py-2.5 bg-neutral-950 text-white text-sm font-medium rounded hover:bg-neutral-800 transition-colors disabled:opacity-50 w-full text-left"
            >
              <Plus size={18} className={isCreating ? 'animate-spin' : ''} />
              <span>{isCreating ? '创建中...' : '新建项目'}</span>
            </button>

            <div className="h-3" />

            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors
                    ${active 
                      ? 'bg-neutral-100 text-neutral-900 font-medium' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
