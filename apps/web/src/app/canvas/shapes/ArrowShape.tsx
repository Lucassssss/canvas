'use client'

import React, { useRef, useState, useCallback } from 'react'
import { ShapeProps } from './types'
import { useCanvasStore } from '../store'

interface ArrowShapeProps {
  shape: ShapeProps
  isSelected: boolean
}

type PointType = 'start' | 'control' | 'end'

export const ArrowShape: React.FC<ArrowShapeProps> = ({ shape, isSelected }) => {
  const { updateShape } = useCanvasStore()
  const pathRef = useRef<SVGPathElement>(null)
  const isDraggingRef = useRef(false)
  
  const initialStart = shape.points && shape.points.length > 0
    ? shape.points[0]
    : { x: 0, y: shape.height / 2 }

  const initialEnd = shape.points && shape.points.length >= 2
    ? shape.points[shape.points.length - 1]
    : { x: shape.width, y: shape.height / 2 }

  const initialControl = shape.points && shape.points.length === 3
    ? shape.points[1]
    : { x: (initialStart.x + initialEnd.x) / 2, y: (initialStart.y + initialEnd.y) / 2 }

  const [localPoints, setLocalPoints] = useState<{ start: {x:number,y:number}, control: {x:number,y:number}, end: {x:number,y:number} } | null>(null)

  const activeStart = localPoints ? localPoints.start : initialStart
  const activeControl = localPoints ? localPoints.control : initialControl
  const activeEnd = localPoints ? localPoints.end : initialEnd

  const handlePointerDown = useCallback((e: React.PointerEvent, type: PointType) => {
    e.stopPropagation()
    e.preventDefault()
    
    // In case there is an ongoing drag natively, try to capture pointer
    if (e.target instanceof Element) {
      e.target.setPointerCapture(e.pointerId)
    }
    
    isDraggingRef.current = true
    
    const startClientX = e.clientX
    const startClientY = e.clientY
    
    // Initialize local points if not overriding
    const currentPoints = localPoints || { start: initialStart, control: initialControl, end: initialEnd }
    setLocalPoints(currentPoints)

    let currentDragPoints = { ...currentPoints }
    const initialDragPoint = { ...currentPoints[type] }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return
      const viewport = useCanvasStore.getState().viewport
      
      const dx = (moveEvent.clientX - startClientX) / viewport.zoom
      const dy = (moveEvent.clientY - startClientY) / viewport.zoom

      currentDragPoints = { ...currentDragPoints }
      currentDragPoints[type] = { x: initialDragPoint.x + dx, y: initialDragPoint.y + dy }
      
      setLocalPoints(currentDragPoints)
      
      const actualPathControlX = 2 * currentDragPoints.control.x - 0.5 * currentDragPoints.start.x - 0.5 * currentDragPoints.end.x
      const actualPathControlY = 2 * currentDragPoints.control.y - 0.5 * currentDragPoints.start.y - 0.5 * currentDragPoints.end.y

      if (pathRef.current) {
        pathRef.current.setAttribute('d', `M ${currentDragPoints.start.x} ${currentDragPoints.start.y} Q ${actualPathControlX} ${actualPathControlY} ${currentDragPoints.end.x} ${currentDragPoints.end.y}`)
      }
    }

    const handlePointerUp = () => {
      isDraggingRef.current = false
      setLocalPoints(null)

      // Normalize bounding box
      const pts = [currentDragPoints.start, currentDragPoints.control, currentDragPoints.end]
      const minX = Math.min(...pts.map(p => p.x))
      const minY = Math.min(...pts.map(p => p.y))
      const maxX = Math.max(...pts.map(p => p.x))
      const maxY = Math.max(...pts.map(p => p.y))

      const newWidth = Math.max(maxX - minX, 10)
      const newHeight = Math.max(maxY - minY, 10)
      const newX = shape.x + minX
      const newY = shape.y + minY

      updateShape(shape.id, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
        points: pts.map(p => ({ x: p.x - minX, y: p.y - minY }))
      })

      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }, [localPoints, initialStart, initialControl, initialEnd, shape.id, shape.x, shape.y, updateShape])

  const actualPathControlX = 2 * activeControl.x - 0.5 * activeStart.x - 0.5 * activeEnd.x
  const actualPathControlY = 2 * activeControl.y - 0.5 * activeStart.y - 0.5 * activeEnd.y

  const pathData = `M ${activeStart.x} ${activeStart.y} Q ${actualPathControlX} ${actualPathControlY} ${activeEnd.x} ${activeEnd.y}`

  return (
    <>
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <path
          className="pointer-events-auto cursor-move"
          ref={pathRef}
          d={pathData}
          fill="none"
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={shape.stroke} />
          </marker>
        </defs>
      </svg>
      {isSelected && (
        <div className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
          <div
            className="absolute pointer-events-auto w-3 h-3 bg-white border-2 border-red-500 rounded-full shadow cursor-move -translate-x-1.5 -translate-y-1.5 hover:scale-125 transition-transform"
            style={{ left: activeStart.x, top: activeStart.y }}
            onPointerDown={(e) => handlePointerDown(e, 'start')}
          />
          <div
            className="absolute pointer-events-auto w-3 h-3 bg-white border-2 border-blue-500 rounded-full shadow cursor-move -translate-x-1.5 -translate-y-1.5 hover:scale-125 transition-transform"
            style={{ left: activeControl.x, top: activeControl.y }}
            onPointerDown={(e) => handlePointerDown(e, 'control')}
          />
          <div
            className="absolute pointer-events-auto w-3 h-3 bg-white border-2 border-green-500 rounded-full shadow cursor-move -translate-x-1.5 -translate-y-1.5 hover:scale-125 transition-transform"
            style={{ left: activeEnd.x, top: activeEnd.y }}
            onPointerDown={(e) => handlePointerDown(e, 'end')}
          />
        </div>
      )}
    </>
  )
}
