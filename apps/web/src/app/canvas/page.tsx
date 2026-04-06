'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MessageSquare } from 'lucide-react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { ClothingSidebar } from './components/ClothingSidebar'
import { ZoomControls } from './components/ZoomControls'
import { SaveIndicator } from './components/SaveIndicator'
import { useCanvasStore } from './store'
import './style.css'

const RightSidebar = dynamic(() => import('./components/RightSidebar').then(mod => ({ default: mod.RightSidebar })), { ssr: false })
const Toolbar = dynamic(() => import('./components/Toolbar').then(mod => ({ default: mod.Toolbar })), { ssr: false })
const Canvas = dynamic(() => import('./Canvas').then(mod => ({ default: mod.Canvas })), { ssr: false })

const CHAT_OPEN_STORAGE_KEY = 'right-sidebar-open'

const CanvasPageFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4"></div>
      <p className="text-neutral-600 text-sm">加载中...</p>
    </div>
  </div>
)

const CanvasPageContent: React.FC = () => {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  const { 
    shapes, 
    selectedIds, 
    projectId,
    isDirty,
    loadProject, 
    saveToServer,
    cancelAutoSave 
  } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  /**
   * 客户端挂载后读取缓存状态
   */
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(CHAT_OPEN_STORAGE_KEY)
    if (stored !== null) {
      setIsChatOpen(stored === 'true')
    }
  }, [])

  /**
   * 缓存右侧对话栏的打开/关闭状态
   */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CHAT_OPEN_STORAGE_KEY, String(isChatOpen))
    }
  }, [isChatOpen, mounted])

  /**
   * 从 URL 参数加载项目
   */
  useEffect(() => {
    const projectIdFromUrl = searchParams.get('projectId')
    
    if (projectIdFromUrl && projectIdFromUrl !== projectId) {
      console.log('[Canvas Page] Loading project from URL:', projectIdFromUrl)
      setIsLoading(true)
      setLoadError(null)
      
      loadProject(projectIdFromUrl)
        .then(() => {
          console.log('[Canvas Page] Project loaded successfully')
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('[Canvas Page] Failed to load project:', error)
          setLoadError('加载项目失败，请重试')
          setIsLoading(false)
        })
    }
  }, [searchParams, projectId, loadProject])

  /**
   * Ctrl+S 手动保存快捷键
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框中
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // 检测 Ctrl+S (Windows/Linux) 或 Cmd+S (Mac)
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      if (cmdKey && e.key === 's') {
        e.preventDefault() // 阻止浏览器默认保存行为
        
        if (projectId) {
          console.log('[Canvas Page] Manual save triggered (Ctrl+S)')
          
          // 取消自动保存定时器
          cancelAutoSave()
          
          // 立即保存
          saveToServer()
            .then(() => {
              console.log('[Canvas Page] Manual save completed')
            })
            .catch((error) => {
              console.error('[Canvas Page] Manual save failed:', error)
            })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [projectId, saveToServer, cancelAutoSave])

  /**
   * 页面卸载时保存
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 如果有未保存的更改，提示用户
      if (isDirty && projectId) {
        e.preventDefault()
        e.returnValue = '你有未保存的更改，确定要离开吗？'
        
        // 尝试同步保存（可能不会成功）
        saveToServer()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // 组件卸载时取消定时器
      cancelAutoSave()
    }
  }, [isDirty, projectId, saveToServer, cancelAutoSave])

  // 加载中状态
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mb-4"></div>
          <p className="text-neutral-600 text-sm">加载项目中...</p>
        </div>
      </div>
    )
  }

  // 加载错误状态
  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <a className="logo block w-8 flex items-center justify-center" href="https://joii.cc" target="_blank">
        <img src="/joii_logo_fa.svg" alt="Joii.cc" />
      </a>

      <button
        className={`chat-toggle ${isChatOpen ? 'active' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ display: isChatOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={20} />
      </button>

      {/* 保存状态指示器 */}
      <SaveIndicator />

      <div className="flex w-full h-full">
        <LeftSidebar />
        <div className="flex-1 relative">
          <Canvas />
          <Toolbar />
          <ZoomControls />
        </div>
        {selectedClothing && <ClothingSidebar />}
        <RightSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  )
}

const CanvasPage: React.FC = () => {
  return (
    <Suspense fallback={<CanvasPageFallback />}>
      <CanvasPageContent />
    </Suspense>
  )
}

export default CanvasPage
