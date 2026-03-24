import React, { useRef, useCallback, useState } from 'react'
import { useCanvasStore } from '../store'
import { ShapeProps } from './types'

interface ShapeComponentProps {
  shape: ShapeProps
  isSelected: boolean
}

export const Shape: React.FC<ShapeComponentProps> = ({ shape }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  const {
    updateShape,
    setSelectedIds,
    selectedIds,
    addToSelection,
    saveHistory,
    activeTool,
    setIsDragging,
    viewport,
  } = useCanvasStore()

  const dragStartRef = useRef<{ x: number; y: number; shapePositions: Map<string, { x: number; y: number }> } | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()

    if (activeTool !== 'select') return

    const isAlreadySelected = selectedIds.includes(shape.id)

    if (e.shiftKey) {
      if (isAlreadySelected) {
        setSelectedIds(selectedIds.filter((id) => id !== shape.id))
      } else {
        addToSelection(shape.id)
      }
    } else {
      if (!isAlreadySelected) {
        setSelectedIds([shape.id])
      }

      const idsToDrag = isAlreadySelected ? selectedIds : [shape.id]
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        shapePositions: new Map(
          idsToDrag.map((id) => {
            const s = useCanvasStore.getState().shapes.find((sh) => sh.id === id)
            return [id, { x: s?.x || 0, y: s?.y || 0 }]
          })
        ),
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragStartRef.current) return

        const dx = (moveEvent.clientX - dragStartRef.current.x) / viewport.zoom
        const dy = (moveEvent.clientY - dragStartRef.current.y) / viewport.zoom

        dragStartRef.current.shapePositions.forEach((pos, id) => {
          updateShape(id, { x: pos.x + dx, y: pos.y + dy })
        })
        setIsDragging(true)
      }

      const handleMouseUp = () => {
        dragStartRef.current = null
        setIsDragging(false)
        saveHistory()
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
  }, [shape, activeTool, viewport, selectedIds, updateShape, setSelectedIds, addToSelection, saveHistory, setIsDragging])

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (shape.type === 'text' || shape.type === 'note') {
      setIsEditing(true)
    }
  }, [shape.type])

  const renderContent = () => {
    switch (shape.type) {
      case 'text':
        return isEditing ? (
          <textarea
            autoFocus
            className="w-full h-full bg-transparent border-none outline-none resize-none"
            value={shape.text || ''}
            onChange={(e) => updateShape(shape.id, { text: e.target.value })}
            onBlur={() => {
              setIsEditing(false)
              saveHistory()
            }}
          />
        ) : (
          <span className="whitespace-pre-wrap">{shape.text}</span>
        )

      case 'note':
        return isEditing ? (
          <textarea
            autoFocus
            className="w-full h-full bg-transparent border-none outline-none resize-none text-sm"
            value={shape.text || ''}
            onChange={(e) => updateShape(shape.id, { text: e.target.value })}
            onBlur={() => {
              setIsEditing(false)
              saveHistory()
            }}
          />
        ) : (
          <span className="text-sm whitespace-pre-wrap">{shape.text || '双击编辑'}</span>
        )

      case 'image':
        return shape.imageUrl ? (
          <img src={shape.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">点击上传图片</span>
        )

      case 'draw':
        if (!shape.points || shape.points.length < 2) return null
        const pathData = shape.points
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
          .join(' ')
        return (
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <path
              d={pathData}
              fill="none"
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )

      case 'arrow':
        return (
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line
              x1="0"
              y1={shape.height / 2}
              x2={shape.width}
              y2={shape.height / 2}
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
        )

      default:
        return null
    }
  }

  const style: React.CSSProperties = {
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    transform: `rotate(${shape.rotation}deg)`,
    opacity: shape.opacity,
    backgroundColor: shape.type !== 'draw' && shape.type !== 'arrow' ? shape.fill : undefined,
    border: shape.type !== 'draw' && shape.type !== 'arrow' ? `${shape.strokeWidth}px solid ${shape.stroke}` : undefined,
    borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'note' ? '4px' : undefined,
  }

  return (
    <div
      ref={elementRef}
      className="canvas-shape"
      data-type={shape.type}
      data-shape-id={shape.id}
      style={style}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {renderContent()}
    </div>
  )
}
