import React, { useState, useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { LeftSidebar } from './canvas/components/LeftSidebar'
import { RightSidebar } from './canvas/components/RightSidebar'
import { ClothingSidebar } from './canvas/components/ClothingSidebar'
import { Toolbar } from './canvas/components/Toolbar'
import { Canvas } from './canvas/Canvas'
import { ZoomControls } from './canvas/components/ZoomControls'
import { useCanvasStore } from './canvas/store'
import { registerBuiltInTypes } from './ai-combination/built-in-types'

const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { addShape, activeTool, viewport, setActiveTool, setSelectedIds, shapes, selectedIds } = useCanvasStore()

  useEffect(() => {
    registerBuiltInTypes()
  }, [])

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'hand') return

    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const x = (e.clientX - rect.left - viewport.x) / viewport.zoom
    const y = (e.clientY - rect.top - viewport.y) / viewport.zoom

    const defaultProps = {
      x,
      y,
      width: 150,
      height: 100,
      rotation: 0,
      fill: '#ffffff',
      stroke: '#e4e4e7',
      strokeWidth: 1,
      opacity: 1,
    }

    let newShapeId: string | undefined

    switch (activeTool) {
      case 'text':
        newShapeId = addShape({ ...defaultProps, type: 'text', text: '双击编辑' }).id
        break
      case 'note':
        newShapeId = addShape({ ...defaultProps, type: 'note', fill: '#fef08a', text: '便签' }).id
        break
      case 'shape':
        newShapeId = addShape({ ...defaultProps, type: 'rect' }).id
        break
      case 'arrow':
        newShapeId = addShape({ ...defaultProps, type: 'arrow', width: 200, height: 2 }).id
        break
      case 'image':
        newShapeId = addShape({ ...defaultProps, type: 'image', fill: '#f4f4f5' }).id
        break
    }

    if (newShapeId) {
      setSelectedIds([newShapeId])
      setActiveTool('select')
    }
  }

  return (
    <div className="w-full h-full">
      <div className="logo">GKE 极客</div>

      <button
        className={`chat-toggle ${isChatOpen ? 'active' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{ display: isChatOpen ? 'none' : 'flex' }}
      >
        <MessageSquare size={20} />
      </button>

      <div className="flex w-full h-full">
        <LeftSidebar />
        <div
          className="flex-1 relative"
          onClick={handleCanvasClick}
        >
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

export default App