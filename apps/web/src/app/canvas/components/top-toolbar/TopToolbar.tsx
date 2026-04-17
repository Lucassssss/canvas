'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useCanvasStore } from '../../store'
import { ShapeProps } from '../../shapes/types'
import { getShapesBoundingBox } from '@/lib/canvas/geometry'
import { RectBar } from './RectBar'
import { ImageBar } from './ImageBar'
import { TextBar } from './TextBar'
import { MultiActionBar } from './MultiActionBar'
import { ArrowBar } from './ArrowBar'
import { GroupBar } from './GroupBar'

export const TopToolbar: React.FC = () => {
  const { shapes, selectedIds, viewport, isDragging, isResizing, isRotating } = useCanvasStore()
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)

  const selectedShapes = useMemo(() => {
    return selectedIds.length > 0 
      ? shapes.filter(s => selectedIds.includes(s.id))
      : []
  }, [shapes, selectedIds])

  const calculatePosition = useCallback(() => {
    if (selectedShapes.length === 0) {
      setPosition(null)
      return
    }

    const bounds = getShapesBoundingBox(selectedShapes)
    
    // Screen coordinates
    const centerCanvasX = (bounds.minX + bounds.maxX) / 2
    const screenCenterX = centerCanvasX * viewport.zoom + viewport.x
    const screenTopY = bounds.minY * viewport.zoom + viewport.y - 24 // 24px padding above

    setPosition({ left: screenCenterX, top: screenTopY })
  }, [selectedShapes, viewport])

  useEffect(() => {
    calculatePosition()
  }, [calculatePosition])

  useEffect(() => {
    const handleResize = () => calculatePosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculatePosition])

  const [isKeyboardMoving, setIsKeyboardMoving] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const target = e.target as HTMLElement
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable) return
        setIsKeyboardMoving(true)
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => setIsKeyboardMoving(false), 300)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeoutId)
    }
  }, [])

  if (selectedShapes.length === 0 || !position || isRotating || isDragging || isResizing || isKeyboardMoving) {
    return null
  }

  const containerClasses = "fixed z-50 flex items-center bg-white/100 rounded-lg shadow-sm border border-gray-200/60 px-2.5 py-1.5 scale-90 origin-bottom"

  // 多选模式
  if (selectedShapes.length > 1) {
    return (
      <div 
        className={containerClasses}
        style={{ left: position.left, top: position.top, transform: 'translate(-50%, -100%)' }}
        onMouseDown={e => e.stopPropagation()}
      >
        <MultiActionBar selectedShapes={selectedShapes} />
      </div>
    )
  }

  // 单选模式
  const shape = selectedShapes[0]

  let BarComponent = null
  if (shape.type === 'rect' || shape.type === 'circle') {
    BarComponent = <RectBar shape={shape} />
  } else if (shape.type === 'text' || shape.type === 'note') {
    BarComponent = <TextBar shape={shape} />
  } else if (shape.type === 'image' || shape.type === 'detail-image') {
    BarComponent = <ImageBar shape={shape} />
  } else if (shape.type === 'arrow') {
    BarComponent = <ArrowBar shape={shape} />
  } else if (shape.type === 'group') {
    BarComponent = <GroupBar shape={shape} />
  }

  if (!BarComponent) {
    return null
  }

  return (
    <div 
        className={containerClasses}
        style={{ left: position.left, top: position.top, transform: 'translate(-50%, -100%)' }}
        onMouseDown={e => e.stopPropagation()}
    >
      {BarComponent}
    </div>
  )
}

