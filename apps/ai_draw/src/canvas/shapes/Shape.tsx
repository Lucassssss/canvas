import React, { useRef, useCallback, useState } from 'react'
import { useCanvasStore } from '../store'
import { ShapeProps } from './types'
import { ClothingComponent } from './ClothingComponent'
import { AICombinationComponent } from './AICombinationComponent'
import { aiCombinationService } from '@/ai-combination/service'
import { Loader2 } from 'lucide-react'

interface ShapeComponentProps {
  shape: ShapeProps
  isSelected: boolean
}

export const Shape: React.FC<ShapeComponentProps> = ({ shape }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isMouseDragging, setIsMouseDragging] = useState(false)

  const {
    updateShape,
    setSelectedIds,
    selectedIds,
    addToSelection,
    saveHistory,
    activeTool,
    setIsDragging,
    viewport,
    setDragData,
  } = useCanvasStore()

  const dragStartRef = useRef<{ x: number; y: number; shapePositions: Map<string, { x: number; y: number }> } | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()

    if (activeTool !== 'select') return

    if (shape.type === 'image') {
      e.preventDefault()
    }

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
        setIsMouseDragging(false)
        saveHistory()
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      setIsMouseDragging(true)
    }
  }, [shape, activeTool, viewport, selectedIds, updateShape, setSelectedIds, addToSelection, saveHistory, setIsDragging, setIsMouseDragging])

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
          <div
            className="relative w-full h-full"
            draggable={!isMouseDragging}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'copy'
              e.dataTransfer.setData('text/plain', shape.id)
              if (shape.imageUrl) {
                setDragData({ shapeId: shape.id, imageUrl: shape.imageUrl })
              }
            }}
            onDragEnd={() => {
              setDragData(null)
            }}
          >
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-1">
                <span className="text-xs">加载失败</span>
              </div>
            )}
            <img
              src={shape.imageUrl}
              alt=""
              draggable={false}
              className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <label className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
              点击上传图片
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = e.target.files
                  if (!files || files.length === 0) return

                  const images: Array<{ url: string; width: number; height: number }> = []
                  let uploadedCount = 0

                  for (const file of Array.from(files)) {
                    const result = await aiCombinationService.uploadImage(file, 'canvas-uploads')
                    if (result.success && result.url) {
                      const img = new Image()
                      img.src = result.url
                      await new Promise<void>((resolve) => {
                        img.onload = () => {
                          images.push({
                            url: result.url!,
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                          })
                          resolve()
                        }
                        img.onerror = () => resolve()
                      })
                    }
                    uploadedCount++

                    if (uploadedCount === files.length) {
                      window.dispatchEvent(
                        new CustomEvent('images-uploaded', {
                          detail: {
                            images: images.filter((i) => i.width > 0),
                            startX: shape.x,
                            startY: shape.y,
                            placeholderId: shape.id,
                          },
                        })
                      )
                    }
                  }
                }}
              />
            </label>
          </div>
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

      case 'clothing':
        return <ClothingComponent shape={shape} />

      case 'ai-combination':
        return <AICombinationComponent shape={shape as ShapeProps & { type: 'ai-combination' }} />

      default:
        return null
    }
  }

  const isCustomComponent = shape.type === 'draw' || shape.type === 'arrow' || shape.type === 'clothing' || shape.type === 'ai-combination'
  
  const style: React.CSSProperties = {
    left: shape.x,
    top: shape.y,
    width: shape.width,
    height: shape.height,
    transform: `rotate(${shape.rotation}deg)`,
    opacity: shape.opacity,
    backgroundColor: !isCustomComponent ? shape.fill : undefined,
    border: !isCustomComponent ? `${shape.strokeWidth}px solid ${shape.stroke}` : undefined,
    borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'note' ? '4px' : undefined,
    overflow: shape.type === 'ai-combination' ? 'visible' : undefined,
  }

  return (
    <div
      ref={elementRef}
      className={`canvas-shape ${shape.type === 'ai-combination' ? 'pointer-events-auto' : ''}`}
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
