import React, { useRef, useEffect, useCallback, useState } from 'react'
import type { Editor } from '../core/Editor'
import type { ShapeProps } from '../shapes/types'
import type { ViewportState } from '../core/types'

export interface CanvasProps {
  editor: Editor
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onPointerDown?: (event: React.PointerEvent) => void
  onPointerMove?: (event: React.PointerEvent) => void
  onPointerUp?: (event: React.PointerEvent) => void
}

export function Canvas({
  editor,
  className,
  style,
  children,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: CanvasProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState<ViewportState>(() => editor.getViewport())
  const [shapes, setShapes] = useState<ShapeProps[]>(() => editor.getShapes())
  const [selectedIds, setSelectedIds] = useState<string[]>(() => editor.getSelectedIds())
  
  useEffect(() => {
    editor.mount(containerRef.current!)
    
    const unsubViewport = editor.on('viewport:change', (payload) => setViewport(payload.viewport))
    const unsubShapeCreate = editor.on('shape:create', () => setShapes(editor.getShapes()))
    const unsubShapeUpdate = editor.on('shape:update', () => setShapes(editor.getShapes()))
    const unsubShapeDelete = editor.on('shape:delete', () => setShapes(editor.getShapes()))
    const unsubSelection = editor.on('selection:change', (payload) => setSelectedIds(payload.selectedIds))
    
    return () => {
      editor.unmount()
      unsubViewport()
      unsubShapeCreate()
      unsubShapeUpdate()
      unsubShapeDelete()
      unsubSelection()
    }
  }, [editor])
  
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    
    if (e.metaKey || e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const currentViewport = editor.getViewport()
      const newZoom = Math.max(0.1, Math.min(10, currentViewport.zoom * delta))
      
      const rect = containerRef.current!.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      const canvasX = (mouseX - currentViewport.x) / currentViewport.zoom
      const canvasY = (mouseY - currentViewport.y) / currentViewport.zoom
      
      editor.setViewport({
        zoom: newZoom,
        x: mouseX - canvasX * newZoom,
        y: mouseY - canvasY * newZoom,
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
    } else {
      editor.deselect()
    }
    
    onPointerDown?.(e)
  }, [editor, onPointerDown])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const selected = editor.getSelectedIds()
      selected.forEach((id: string) => editor.deleteShape(id))
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()
      const allIds = editor.getShapes().map((s: ShapeProps) => s.id)
      editor.select(allIds)
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault()
      if (e.shiftKey) {
        editor.redo()
      } else {
        editor.undo()
      }
    }
  }, [editor])
  
  return React.createElement('div', {
    ref: containerRef,
    className,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      cursor: 'default',
      ...style,
    },
    onWheel: handleWheel,
    onPointerDown: handlePointerDown,
    onPointerMove: onPointerMove,
    onPointerUp: onPointerUp,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
  }, [
    React.createElement('div', {
      key: 'viewport',
      ref: viewportRef,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        transform: `matrix(${viewport.zoom}, 0, 0, ${viewport.zoom}, ${viewport.x}, ${viewport.y})`,
        transformOrigin: '0 0',
      },
    }, shapes.map((shape: ShapeProps) => 
      React.createElement(ShapeRenderer, {
        key: shape.id,
        shape,
        isSelected: selectedIds.includes(shape.id),
        editor,
      })
    )),
    children,
  ])
}

interface ShapeRendererProps {
  shape: ShapeProps
  isSelected: boolean
  editor: Editor
}

function ShapeRenderer({ shape, isSelected, editor }: ShapeRendererProps): React.ReactElement | null {
  const shapeUtil = editor.getShapeUtil(shape.type)
  if (!shapeUtil) return null
  
  const context = {
    isSelected,
    isEditing: false,
    zoom: editor.getViewport().zoom,
    editor,
  }
  
  return React.createElement('div', {
    'data-shape-id': shape.id,
    style: {
      position: 'absolute',
      left: shape.x,
      top: shape.y,
      width: shape.width,
      height: shape.height,
      transform: `rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
      pointerEvents: shape.locked ? 'none' : 'auto',
      cursor: isSelected ? 'move' : 'pointer',
    },
  }, [
    shapeUtil.render(shape, context),
    isSelected && React.createElement(SelectionBox, {
      key: 'selection',
      shape,
    }),
  ])
}

interface SelectionBoxProps {
  shape: ShapeProps
}

function SelectionBox(_props: SelectionBoxProps): React.ReactElement {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      inset: -2,
      border: '2px solid #2563eb',
      pointerEvents: 'none',
      boxSizing: 'border-box',
    },
  })
}
