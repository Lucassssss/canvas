import React from 'react'
import { Header } from './canvas/components/Header'
import { LeftSidebar } from './canvas/components/LeftSidebar'
import { RightSidebar } from './canvas/components/RightSidebar'
import { Toolbar } from './canvas/components/Toolbar'
import { Canvas } from './canvas/Canvas'
import { useCanvasStore } from './canvas/store'

const App: React.FC = () => {
  const { addShape, activeTool, viewport, setActiveTool, setSelectedIds } = useCanvasStore()

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
      <Header />
      <div className="flex" style={{ height: 'calc(100% - 56px)' }}>
        <LeftSidebar />
        <div
          className="flex-1 relative"
          onClick={handleCanvasClick}
        >
          <Canvas />
          <Toolbar />
        </div>
        <RightSidebar />
      </div>
    </div>
  )
}

export default App
