'use client'

import React, { useRef, useCallback, useState, useMemo, memo } from 'react'
import { useCanvasStore } from '../store'
import { ShapeProps } from './types'
import { ClothingComponent } from './ClothingComponent'
import { AICombinationComponent } from './AICombinationComponent'
import { CustomCombination } from './CustomCombination'
import { DetailImageShape } from '../detail-image/DetailImageShape'
import { aiCombinationService } from '@/ai-combination/service'
import { Loader2, Copy, Clipboard, Trash2, BringToFront, SendToBack, CopyPlus, Download } from 'lucide-react'
import { TransformMatrix } from '@/lib/canvas/transform'
import { calculateAlignmentGuides, snapToAlignment } from '../utils/alignmentGuides'
import { detectDropTarget } from '../utils/dropZone'
import { updateDropTarget, clearDropTarget, getDropTarget } from '../utils/dropTargetManager'
import { updateGuidesData } from '../components/AlignmentGuides'
import type { AlignmentGuide } from '../shapes/types'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface ShapeComponentProps {
  shape: ShapeProps
  isSelected: boolean
}

const ShapeComponent: React.FC<ShapeComponentProps> = ({ shape }) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const isMouseDraggingRef = useRef(false)

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
    deleteShape,
    copySelectedShapes,
    pasteShapes,
    duplicateSelectedShapes,
    bringToFront,
    sendToBack,
    scheduleAutoSave,
    batchUpdateShapes,
  } = useCanvasStore()

  const dragStartRef = useRef<{ x: number; y: number; shapePositions: Map<string, { x: number; y: number }> } | null>(null)
  const dragElementsRef = useRef<Map<string, HTMLElement>>(new Map())
  const lastDragEventRef = useRef<{ clientX: number; clientY: number } | null>(null)
  const shapeDataRef = useRef<Map<string, { width: number; height: number; rotation: number; scaleX: number; scaleY: number }>>(new Map())
  const isDraggingStartedRef = useRef(false)
  const alignmentRafRef = useRef<number | null>(null)
  const pendingAlignmentRef = useRef<{ dx: number; dy: number; clientX: number; clientY: number } | null>(null)
  const snapOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const currentGuidesRef = useRef<AlignmentGuide[]>([])
  const isImageDragRef = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()

    if (activeTool !== 'select') return

    if (shape.type === 'image') {
      e.preventDefault()
    }

    const isAlreadySelected = selectedIds.includes(shape.id)
    const state = useCanvasStore.getState()

    if (e.shiftKey) {
      if (isAlreadySelected) {
        state.setSelectedIds(selectedIds.filter((id) => id !== shape.id))
      } else {
        state.addToSelection(shape.id)
      }
    } else {
      if (!isAlreadySelected) {
        state.setSelectedIds([shape.id])
      }

      const idsToDrag = isAlreadySelected ? selectedIds : [shape.id]
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        shapePositions: new Map(
          idsToDrag.map((id) => {
            const s = state.shapes.find((sh) => sh.id === id)
            return [id, { x: s?.x || 0, y: s?.y || 0 }]
          })
        ),
      }

      dragElementsRef.current.clear()
      shapeDataRef.current.clear()
      isDraggingStartedRef.current = false
      isImageDragRef.current = false
      idsToDrag.forEach((id) => {
        const el = document.querySelector(`[data-shape-id="${id}"]`) as HTMLElement
        if (el) {
          dragElementsRef.current.set(id, el)
        }
        const s = state.shapes.find((sh) => sh.id === id)
        if (s) {
          shapeDataRef.current.set(id, {
            width: s.width,
            height: s.height,
            rotation: s.rotation,
            scaleX: s.scaleX ?? 1,
            scaleY: s.scaleY ?? 1
          })
          if (s.type === 'image' && s.imageUrl && idsToDrag.length === 1) {
            isImageDragRef.current = true
          }
        }
      })

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragStartRef.current) return

        lastDragEventRef.current = { clientX: moveEvent.clientX, clientY: moveEvent.clientY }
        const dx = (moveEvent.clientX - dragStartRef.current.x) / state.viewport.zoom
        const dy = (moveEvent.clientY - dragStartRef.current.y) / state.viewport.zoom

        if (!isDraggingStartedRef.current) {
          isDraggingStartedRef.current = true
          state.setIsDragging(true)
          isMouseDraggingRef.current = true
          elementRef.current?.classList.add('dragging')
        }

        const { x: snapX, y: snapY } = snapOffsetRef.current
        dragElementsRef.current.forEach((el, id) => {
          const pos = dragStartRef.current?.shapePositions.get(id)
          const shapeData = shapeDataRef.current.get(id)
          if (!pos || !shapeData) return

          const newX = pos.x + dx + snapX
          const newY = pos.y + dy + snapY
          const cx = newX + shapeData.width / 2
          const cy = newY + shapeData.height / 2
          const matrix = TransformMatrix.compose(
            cx,
            cy,
            shapeData.width,
            shapeData.height,
            shapeData.rotation,
            shapeData.scaleX,
            shapeData.scaleY
          )
          el.style.transform = TransformMatrix.toCssString(matrix)
        })

        pendingAlignmentRef.current = { dx, dy, clientX: moveEvent.clientX, clientY: moveEvent.clientY }
        if (alignmentRafRef.current === null) {
          alignmentRafRef.current = requestAnimationFrame(() => {
            alignmentRafRef.current = null
            if (!pendingAlignmentRef.current || !dragStartRef.current) return

            const { dx: pdx, dy: pdy, clientX, clientY } = pendingAlignmentRef.current
            const draggedShapeIds = Array.from(dragElementsRef.current.keys())

            if (isImageDragRef.current) {
              const dropTarget = detectDropTarget(
                clientX,
                clientY,
                state.shapes,
                draggedShapeIds
              )
              updateDropTarget(dropTarget)
            }

            const draggedShapes: ShapeProps[] = []

            dragStartRef.current.shapePositions.forEach((pos, id) => {
              const shapeData = shapeDataRef.current.get(id)
              if (!shapeData) return
              draggedShapes.push({
                id,
                type: shape.type,
                x: pos.x + pdx,
                y: pos.y + pdy,
                width: shapeData.width,
                height: shapeData.height,
                rotation: shapeData.rotation,
                scaleX: shapeData.scaleX,
                scaleY: shapeData.scaleY,
                fill: '',
                stroke: '',
                strokeWidth: 0,
                opacity: 1,
              })
            })

            if (draggedShapes.length > 0) {
              const guides = calculateAlignmentGuides(
                draggedShapes,
                state.shapes,
                draggedShapeIds
              )
              currentGuidesRef.current = guides
              updateGuidesData(guides, state.viewport)

              if (draggedShapes.length === 1) {
                const snapped = snapToAlignment(draggedShapes[0], guides)
                if (snapped) {
                  const originalX = dragStartRef.current.shapePositions.get(draggedShapes[0].id)?.x ?? 0
                  const originalY = dragStartRef.current.shapePositions.get(draggedShapes[0].id)?.y ?? 0
                  snapOffsetRef.current = {
                    x: snapped.x - originalX - pdx,
                    y: snapped.y - originalY - pdy,
                  }

                  const el = dragElementsRef.current.get(draggedShapes[0].id)
                  if (el) {
                    const shapeData = shapeDataRef.current.get(draggedShapes[0].id)
                    if (shapeData) {
                      const cx = snapped.x + shapeData.width / 2
                      const cy = snapped.y + shapeData.height / 2
                      const matrix = TransformMatrix.compose(
                        cx,
                        cy,
                        shapeData.width,
                        shapeData.height,
                        shapeData.rotation,
                        shapeData.scaleX,
                        shapeData.scaleY
                      )
                      el.style.transform = TransformMatrix.toCssString(matrix)
                    }
                  }
                } else {
                  snapOffsetRef.current = { x: 0, y: 0 }
                }
              }
            }
          })
        }
      }

      const handleMouseUp = () => {
        if (alignmentRafRef.current !== null) {
          cancelAnimationFrame(alignmentRafRef.current)
          alignmentRafRef.current = null
        }
        pendingAlignmentRef.current = null

        const latestState = useCanvasStore.getState()
        const currentDropTarget = getDropTarget()
        clearDropTarget()

        if (currentDropTarget && dragStartRef.current) {
          const draggedShapeIds = Array.from(dragElementsRef.current.keys())
          if (draggedShapeIds.length === 1) {
            const draggedShape = latestState.shapes.find(s => s.id === draggedShapeIds[0])
            if (draggedShape?.type === 'image' && draggedShape.imageUrl) {
              const combinationShape = latestState.shapes.find(s => s.id === currentDropTarget.combinationShapeId)
              if (combinationShape?.type === 'custom-combination' && combinationShape.customInputSlots) {
                const newSlots = combinationShape.customInputSlots.map(slot =>
                  slot.id === currentDropTarget.slotId
                    ? { ...slot, imageUrl: draggedShape.imageUrl }
                    : slot
                )
                latestState.updateShape(currentDropTarget.combinationShapeId, { customInputSlots: newSlots })
                latestState.saveHistory()
                latestState.scheduleAutoSave()
              }
            }
          }

          dragStartRef.current.shapePositions.forEach((pos, id) => {
            const el = dragElementsRef.current.get(id)
            if (!el) return
            const shapeData = shapeDataRef.current.get(id)
            if (!shapeData) return
            const cx = pos.x + shapeData.width / 2
            const cy = pos.y + shapeData.height / 2
            const matrix = TransformMatrix.compose(
              cx,
              cy,
              shapeData.width,
              shapeData.height,
              shapeData.rotation,
              shapeData.scaleX,
              shapeData.scaleY
            )
            el.style.transform = TransformMatrix.toCssString(matrix)
          })
        } else if (dragStartRef.current && lastDragEventRef.current) {
          const updates: Array<{ id: string; props: Partial<ShapeProps> }> = []
          const dx = (lastDragEventRef.current.clientX - dragStartRef.current.x) / latestState.viewport.zoom
          const dy = (lastDragEventRef.current.clientY - dragStartRef.current.y) / latestState.viewport.zoom
          const { x: snapX, y: snapY } = snapOffsetRef.current
          
          dragStartRef.current.shapePositions.forEach((pos, id) => {
            updates.push({
              id,
              props: {
                x: pos.x + dx + snapX,
                y: pos.y + dy + snapY
              }
            })
          })

          if (updates.length > 0) {
            latestState.batchUpdateShapes(updates)
          }
          latestState.saveHistory()
          latestState.scheduleAutoSave()
        }

        snapOffsetRef.current = { x: 0, y: 0 }
        currentGuidesRef.current = []
        updateGuidesData([], latestState.viewport)
        dragStartRef.current = null
        dragElementsRef.current.clear()
        shapeDataRef.current.clear()
        lastDragEventRef.current = null
        isDraggingStartedRef.current = false
        isImageDragRef.current = false
        isMouseDraggingRef.current = false
        elementRef.current?.classList.remove('dragging')
        latestState.setIsDragging(false)
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }

      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
  }, [shape.id, shape.type, activeTool, selectedIds])

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
          <div className="relative w-full h-full">
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
              上传图片
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = e.target.files
                  if (!files || files.length === 0) return

                  const images: Array<{ url: string; width: number; height: number; name: string }> = []
                  let uploadedCount = 0

                  for (const file of Array.from(files)) {
                    const result = await aiCombinationService.uploadImage(file, 'canvas-uploads')
                    if (result.success && result.url) {
                      const img = new Image()
                      img.src = result.url
                      const fileName = file.name.replace(/\.[^/.]+$/, '')
                      await new Promise<void>((resolve) => {
                        img.onload = () => {
                          images.push({
                            url: result.url!,
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                            name: fileName,
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

      case 'custom-combination':
        return <CustomCombination shape={shape} />

      case 'detail-image':
        return <DetailImageShape shape={shape as ShapeProps & { type: 'detail-image' }} />

      default:
        return null
    }
  }

  const isCustomComponent = shape.type === 'draw' || shape.type === 'arrow' || shape.type === 'clothing' || shape.type === 'ai-combination' || shape.type === 'custom-combination' || shape.type === 'detail-image'
  const isAutoSizeComponent = shape.type === 'custom-combination' || shape.type === 'detail-image'

  const transformStyle = useMemo(() => {
    const cx = shape.x + shape.width / 2
    const cy = shape.y + shape.height / 2
    const matrix = TransformMatrix.compose(
      cx,
      cy,
      shape.width,
      shape.height,
      shape.rotation,
      shape.scaleX ?? 1,
      shape.scaleY ?? 1
    )
    return {
      transform: TransformMatrix.toCssString(matrix),
    }
  }, [shape.x, shape.y, shape.width, shape.height, shape.rotation, shape.scaleX, shape.scaleY])

  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: isAutoSizeComponent ? undefined : shape.width,
    height: isAutoSizeComponent ? undefined : shape.height,
    ...transformStyle,
    opacity: shape.opacity,
    backgroundColor: !isCustomComponent && shape.type !== 'image' ? shape.fill : undefined,
    border: !isCustomComponent && shape.type !== 'image' ? `${shape.strokeWidth}px solid ${shape.stroke}` : undefined,
    borderRadius: shape.type === 'circle' ? '50%' : shape.type === 'note' ? '4px' : undefined,
    overflow: shape.type === 'ai-combination' || shape.type === 'detail-image' || shape.type === 'custom-combination' ? 'visible' : undefined,
  }

  const canExport = shape.type === 'image' && shape.imageUrl

  const handleExportImage = useCallback(async () => {
    if (shape.type === 'image' && shape.imageUrl) {
      try {
        const response = await fetch(shape.imageUrl)
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `image-${shape.id.slice(0, 8)}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Failed to export image:', error)
      }
    }
  }, [shape])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={elementRef}
          className={`canvas-shape ${shape.type === 'ai-combination' || shape.type === 'detail-image' ? 'pointer-events-auto' : ''} ${shape.type === 'image' && shape.imageUrl ? 'has-image' : ''}`}
          data-type={shape.type}
          data-shape-id={shape.id}
          style={style}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {renderContent()}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => copySelectedShapes()}>
          <Copy size={14} className="mr-2" />
          复制
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => pasteShapes()}>
          <Clipboard size={14} className="mr-2" />
          粘贴
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={() => duplicateSelectedShapes()}>
          <CopyPlus size={14} className="mr-2" />
          复制一份
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => bringToFront()}>
          <BringToFront size={14} className="mr-2" />
          置顶
        </ContextMenuItem>
        <ContextMenuItem onClick={() => sendToBack()}>
          <SendToBack size={14} className="mr-2" />
          置底
        </ContextMenuItem>
        {canExport && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleExportImage}>
              <Download size={14} className="mr-2" />
              导出图片
            </ContextMenuItem>
          </>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={() => deleteShape(shape.id)}>
          <Trash2 size={14} className="mr-2" />
          删除
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

const arePropsEqual = (prevProps: ShapeComponentProps, nextProps: ShapeComponentProps) => {
  const prevShape = prevProps.shape
  const nextShape = nextProps.shape

  const baseEqual = (
    prevShape.id === nextShape.id &&
    prevShape.x === nextShape.x &&
    prevShape.y === nextShape.y &&
    prevShape.width === nextShape.width &&
    prevShape.height === nextShape.height &&
    prevShape.rotation === nextShape.rotation &&
    prevShape.opacity === nextShape.opacity &&
    prevShape.fill === nextShape.fill &&
    prevShape.stroke === nextShape.stroke &&
    prevShape.text === nextShape.text &&
    prevShape.imageUrl === nextShape.imageUrl &&
    prevShape.imageName === nextShape.imageName &&
    prevShape.imageWidth === nextShape.imageWidth &&
    prevShape.imageHeight === nextShape.imageHeight &&
    prevProps.isSelected === nextProps.isSelected
  )

  if (!baseEqual) return false

  const customSlotsEqual = (
    JSON.stringify(prevShape.customInputSlots) === JSON.stringify(nextShape.customInputSlots) &&
    JSON.stringify(prevShape.customOutputSlots) === JSON.stringify(nextShape.customOutputSlots) &&
    prevShape.customStatus === nextShape.customStatus &&
    prevShape.customError === nextShape.customError
  )

  const combinationEqual = (
    prevShape.combinationStatus === nextShape.combinationStatus &&
    prevShape.combinationError === nextShape.combinationError &&
    JSON.stringify(prevShape.combinationResults) === JSON.stringify(nextShape.combinationResults) &&
    JSON.stringify(prevShape.slotContents) === JSON.stringify(nextShape.slotContents)
  )

  return customSlotsEqual && combinationEqual
}

export const Shape = memo(ShapeComponent, arePropsEqual)
