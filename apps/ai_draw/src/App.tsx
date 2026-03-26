import React, { useEffect, useCallback, useRef, useState } from 'react'
import {
  createEditor,
  EditorProvider,
  useEditor,
  useShapes,
  useSelection,
  useViewport,
  ShapeProps,
} from '@gke/canvas-sdk'
import {
  ToolType,
  ClothingShapeUtil,
  ClothingShapeProps,
  DEFAULT_CLOTHING_COLORS,
} from './shapes/ClothingShape'
import { Header } from './canvas/components/Header'
import { Toolbar } from './canvas/components/Toolbar'
import { LeftSidebar } from './canvas/components/LeftSidebar'
import { RightSidebar } from './canvas/components/RightSidebar'
import { ZoomControls } from './canvas/components/ZoomControls'
import { ClothingSidebar } from './canvas/components/ClothingSidebar'
import { LogoMaterialPanel } from './canvas/components/LogoMaterialPanel'
import { useCanvasStore } from './canvas/store'

const editor = createEditor()
editor.registerShape(new ClothingShapeUtil())

const MIN_ZOOM = 0.1
const MAX_ZOOM = 10

function getRotatedBoundingBox(
  x: number, y: number, width: number, height: number, rotation: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  const cx = x + width / 2
  const cy = y + height / 2
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const corners = [
    { x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }
  ]

  const rotatedCorners = corners.map((corner) => ({
    x: cx + (corner.x - cx) * cos - (corner.y - cy) * sin,
    y: cy + (corner.x - cx) * sin + (corner.y - cy) * cos,
  }))

  const xs = rotatedCorners.map(c => c.x)
  const ys = rotatedCorners.map(c => c.y)

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  }
}

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('select')
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  const { setViewport, setSelectedIds } = useCanvasStore()

  useEffect(() => {
    const unsubViewport = editor.on('viewport:change', ({ viewport }) => {
      setViewport(viewport)
    })
    const unsubSelection = editor.on('selection:change', ({ selectedIds }) => {
      setSelectedIds(selectedIds)
    })

    setViewport(editor.getViewport())
    setSelectedIds(editor.getSelectedIds())

    return () => {
      unsubViewport()
      unsubSelection()
    }
  }, [setViewport, setSelectedIds])

  const effectiveTool = isSpacePressed ? 'hand' : activeTool

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === ' ') {
        e.preventDefault()
        setIsSpacePressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <EditorProvider editor={editor}>
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', position: 'relative', paddingTop: 56 }}>
          <LeftSidebar />
          <div style={{ flex: 1, position: 'relative' }}>
            <CanvasWithTools effectiveTool={effectiveTool} onToolChange={setActiveTool} />
            <ZoomControls />
            <LogoMaterialPanel />
          </div>
          <ClothingSidebar />
          <RightSidebar isOpen={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)} />
        </div>
        <Toolbar />
      </div>
    </EditorProvider>
  )
}

interface CanvasWithToolsProps {
  effectiveTool: ToolType
  onToolChange: (tool: ToolType) => void
}

function CanvasWithTools({ effectiveTool, onToolChange }: CanvasWithToolsProps) {
  const editor = useEditor()
  const shapes = useShapes(editor)
  const { selectedIds } = useSelection(editor)
  const viewport = useViewport(editor)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [selectionRect, setSelectionRect] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const dragStartRef = useRef<{
    x: number; y: number;
    viewportX: number; viewportY: number;
  } | null>(null)

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return editor.screenToCanvas(screenX, screenY)
  }, [editor])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    
    if (e.metaKey || e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const currentViewport = editor.getViewport()
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentViewport.zoom * delta))
      
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const canvasPoint = editor.screenToCanvas(mouseX, mouseY)
      
      editor.setViewport({
        zoom: newZoom,
        x: mouseX - canvasPoint.x * newZoom,
        y: mouseY - canvasPoint.y * newZoom,
      })
    } else {
      const currentViewport = editor.getViewport()
      editor.setViewport({
        x: currentViewport.x - e.deltaX,
        y: currentViewport.y - e.deltaY,
      })
    }
  }, [editor])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return

    const target = e.target as HTMLElement
    const shapeElement = target.closest('[data-shape-id]')
    const isCanvasBackground = target.closest('.canvas-container') && !shapeElement

    if (effectiveTool === 'hand') {
      const currentViewport = editor.getViewport()
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        viewportX: currentViewport.x,
        viewportY: currentViewport.y,
      }
      setIsDragging(true)
      return
    }

    if (effectiveTool === 'select') {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)

      if (shapeElement) {
        const shapeId = shapeElement.getAttribute('data-shape-id')
        if (shapeId) {
          if (e.shiftKey) {
            const current = editor.getSelectedIds()
            if (current.includes(shapeId)) {
              editor.deselect(shapeId)
            } else {
              editor.select([...current, shapeId])
            }
          } else {
            editor.select(shapeId)
          }
        }
        return
      }

      if (isCanvasBackground) {
        if (!e.shiftKey) {
          editor.deselect()
        }
        setSelectionRect({
          startX: canvasPoint.x,
          startY: canvasPoint.y,
          endX: canvasPoint.x,
          endY: canvasPoint.y,
        })
        setIsDragging(true)
        return
      }
    }

    if (effectiveTool === 'clothing' && isCanvasBackground) {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)
      const newShape = editor.createShape<ClothingShapeProps>('clothing', {
        x: canvasPoint.x - 400,
        y: canvasPoint.y - 400,
        width: 800,
        height: 800,
        rotation: 0,
        opacity: 1,
        clothingView: 'front',
        clothingColors: DEFAULT_CLOTHING_COLORS,
        logoAreas: [],
      })
      editor.select(newShape.id)
      onToolChange('select')
      return
    }
  }, [editor, effectiveTool, screenToCanvas, onToolChange])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return

    if (dragStartRef.current) {
      const { x, y, viewportX, viewportY } = dragStartRef.current
      const dx = e.clientX - x
      const dy = e.clientY - y
      editor.setViewport({ x: viewportX + dx, y: viewportY + dy })
      return
    }

    if (selectionRect) {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)
      setSelectionRect(prev => prev ? { ...prev, endX: canvasPoint.x, endY: canvasPoint.y } : null)
    }
  }, [isDragging, editor, screenToCanvas, selectionRect])

  const handlePointerUp = useCallback(() => {
    if (selectionRect) {
      const minX = Math.min(selectionRect.startX, selectionRect.endX)
      const maxX = Math.max(selectionRect.startX, selectionRect.endX)
      const minY = Math.min(selectionRect.startY, selectionRect.endY)
      const maxY = Math.max(selectionRect.startY, selectionRect.endY)

      const shapesInRect = shapes.filter(shape => {
        return shape.x < maxX && shape.x + shape.width > minX &&
               shape.y < maxY && shape.y + shape.height > minY
      }).map(s => s.id)

      if (shapesInRect.length > 0) {
        editor.select(shapesInRect)
      }
      setSelectionRect(null)
    }

    dragStartRef.current = null
    setIsDragging(false)
  }, [selectionRect, shapes, editor])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selected = editor.getSelectedIds()
      selected.forEach(id => editor.deleteShape(id))
      return
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()
      const allIds = shapes.map(s => s.id)
      editor.select(allIds)
      return
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        editor.redo()
      } else {
        editor.undo()
      }
      return
    }
  }, [editor, shapes])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const getCursor = () => {
    if (effectiveTool === 'hand') return 'grab'
    if (effectiveTool === 'select') return 'default'
    return 'crosshair'
  }

  const renderSelectionRect = () => {
    if (!selectionRect) return null

    const minX = Math.min(selectionRect.startX, selectionRect.endX)
    const maxX = Math.max(selectionRect.startX, selectionRect.endX)
    const minY = Math.min(selectionRect.startY, selectionRect.endY)
    const maxY = Math.max(selectionRect.startY, selectionRect.endY)

    const screenX = minX * viewport.zoom + viewport.x
    const screenY = minY * viewport.zoom + viewport.y
    const screenWidth = (maxX - minX) * viewport.zoom
    const screenHeight = (maxY - minY) * viewport.zoom

    return (
      <div
        style={{
          position: 'absolute',
          left: screenX,
          top: screenY,
          width: screenWidth,
          height: screenHeight,
          border: '1px dashed #2563eb',
          background: 'rgba(37, 99, 235, 0.1)',
          pointerEvents: 'none',
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{
        position: 'absolute',
        inset: 0,
        cursor: getCursor(),
        backgroundColor: '#f5f5f5',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={viewportRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          transform: `matrix(${viewport.zoom}, 0, 0, ${viewport.zoom}, ${viewport.x}, ${viewport.y})`,
          transformOrigin: '0 0',
        }}
      >
        {shapes.map(shape => {
          const shapeUtil = editor.getShapeUtil(shape.type)
          if (!shapeUtil) return null

          const isSelected = selectedIds.includes(shape.id)
          const context = { isSelected, isEditing: false, zoom: viewport.zoom, editor }

          return (
            <div
              key={shape.id}
              data-shape-id={shape.id}
              style={{
                position: 'absolute',
                left: shape.x,
                top: shape.y,
                width: shape.width,
                height: shape.height,
                transform: `rotate(${shape.rotation}deg)`,
                opacity: shape.opacity,
                cursor: isSelected ? 'move' : 'pointer',
              }}
            >
              {shapeUtil.render(shape, context)}
              {isSelected && <SelectionBox shape={shape} viewport={viewport} editor={editor} />}
            </div>
          )
        })}
      </div>
      {renderSelectionRect()}
    </div>
  )
}

interface SelectionBoxProps {
  shape: ShapeProps
  viewport: { x: number; y: number; zoom: number }
  editor: ReturnType<typeof createEditor>
}

function SelectionBox({ shape, viewport }: SelectionBoxProps) {
  const bounds = getRotatedBoundingBox(shape.x, shape.y, shape.width, shape.height, shape.rotation)
  const screenX = bounds.minX * viewport.zoom + viewport.x
  const screenY = bounds.minY * viewport.zoom + viewport.y
  const screenWidth = (bounds.maxX - bounds.minX) * viewport.zoom
  const screenHeight = (bounds.maxY - bounds.minY) * viewport.zoom

  const handleSize = 8

  return (
    <div
      style={{
        position: 'absolute',
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          outline: '2px solid #2563eb',
          boxSizing: 'border-box',
        }}
      />
      {['nw', 'ne', 'sw', 'se'].map(handle => (
        <div
          key={handle}
          style={{
            position: 'absolute',
            width: handleSize,
            height: handleSize,
            background: 'white',
            border: '1px solid #2563eb',
            ...getHandlePosition(handle, handleSize),
            cursor: getCursorForHandle(handle),
          }}
        />
      ))}
    </div>
  )
}

function getHandlePosition(handle: string, size: number) {
  const positions: Record<string, React.CSSProperties> = {
    nw: { top: -size / 2, left: -size / 2 },
    ne: { top: -size / 2, right: -size / 2 },
    sw: { bottom: -size / 2, left: -size / 2 },
    se: { bottom: -size / 2, right: -size / 2 },
  }
  return positions[handle]
}

function getCursorForHandle(handle: string) {
  const cursors: Record<string, string> = {
    nw: 'nw-resize',
    ne: 'ne-resize',
    sw: 'sw-resize',
    se: 'se-resize',
  }
  return cursors[handle]
}
