'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { MessageSquare } from 'lucide-react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { ClothingSidebar } from './components/ClothingSidebar'
import { ZoomControls } from './components/ZoomControls'
import { useCanvasStore } from './store'
import './style.css'

const RightSidebar = dynamic(() => import('./components/RightSidebar').then(mod => ({ default: mod.RightSidebar })), { ssr: false })
const Toolbar = dynamic(() => import('./components/Toolbar').then(mod => ({ default: mod.Toolbar })), { ssr: false })
const Canvas = dynamic(() => import('./Canvas').then(mod => ({ default: mod.Canvas })), { ssr: false })

export const CanvasPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const { shapes, selectedIds } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

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

export default CanvasPage
