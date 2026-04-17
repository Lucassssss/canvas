'use client'

import React, { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useCanvasStore } from './store'
import { Shape } from './shapes/Shape'
import { ToolType, ShapeProps, SHAPE_MIN_SIZE, ShapeType } from './shapes/types'
import { LogoEditorLayer } from './components/LogoEditorLayer'
import { LogoMaterialPanel } from './components/LogoMaterialPanel'
import { FloatingConfigPanel } from './config-panel/FloatingConfigPanel'
import { ImagePreviewModal } from './components/ImagePreviewModal'
import { AlignmentGuides } from './components/AlignmentGuides'
import { aiCombinationService } from '@/ai-combination/service'
import { combinationRegistry } from '@/ai-combination/registry'
import { TransformMatrix } from '@/lib/canvas/transform'

function getRotatedBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  const cx = x + width / 2
  const cy = y + height / 2
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const corners = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x + width, y: y + height },
    { x: x, y: y + height },
  ]

  const rotatedCorners = corners.map((corner) => {
    const dx = corner.x - cx
    const dy = corner.y - cy
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    }
  })

  const xs = rotatedCorners.map((c) => c.x)
  const ys = rotatedCorners.map((c) => c.y)

  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
  }
}

function getVisualBounds(shape: ShapeProps) {
  const scaleX = shape.scaleX ?? 1
  const scaleY = shape.scaleY ?? 1
  const width = shape.width * scaleX
  const height = shape.height * scaleY
  const x = shape.x + shape.width / 2 * (1 - scaleX)
  const y = shape.y + shape.height / 2 * (1 - scaleY)
  return { x, y, width, height, rotation: shape.rotation }
}

interface SelectionBoxProps {
  shape: ShapeProps
  viewport: { x: number; y: number; zoom: number }
  onResizeStart: (e: React.MouseEvent, handle: string, shapeId: string) => void
  onRotateStart: (e: React.MouseEvent, corner: string, shapeId: string) => void
}

interface MultiSelectResizeStart {
  startMouseX: number
  startMouseY: number
  startBounds: { minX: number; minY: number; maxX: number; maxY: number }
  shapePositions: Map<string, { x: number; y: number; width: number; height: number; rotation: number }>
  handle: string
}

interface MultiSelectRotateStart {
  startAngle: number
  centerX: number
  centerY: number
  initialRotations: Map<string, number>
  initialPositions: Map<string, { x: number; y: number; centerX: number; centerY: number }>
}

interface SelectionRect {
  startX: number
  startY: number
  endX: number
  endY: number
}

const SelectionBoxLayer = memo<{
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: { x: number; y: number; zoom: number }
  onSingleResizeStart: (e: React.MouseEvent, handle: string, shapeId: string) => void
  onSingleRotateStart: (e: React.MouseEvent, corner: string, shapeId: string) => void
  onMultiResizeStart: (e: React.MouseEvent, handle: string) => void
  onMultiRotateStart: (e: React.MouseEvent) => void
}>(({ shapes, selectedIds, viewport, onSingleResizeStart, onSingleRotateStart, onMultiResizeStart, onMultiRotateStart }) => {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))

  if (selectedShapes.length === 0) return null

  if (selectedShapes.length === 1) {
    const shape = selectedShapes[0]
    return (
      <SelectionBox
        key={shape.id}
        shape={shape}
        viewport={viewport}
        onResizeStart={(e, handle) => onSingleResizeStart(e, handle, shape.id)}
        onRotateStart={(e, corner) => onSingleRotateStart(e, corner, shape.id)}
      />
    )
  }

  const allBounds = selectedShapes.map((s) => {
    const vb = getVisualBounds(s)
    return getRotatedBoundingBox(vb.x, vb.y, vb.width, vb.height, vb.rotation)
  })
  const minX = Math.min(...allBounds.map((b) => b.minX))
  const minY = Math.min(...allBounds.map((b) => b.minY))
  const maxX = Math.max(...allBounds.map((b) => b.maxX))
  const maxY = Math.max(...allBounds.map((b) => b.maxY))

  const screenX = minX * viewport.zoom + viewport.x
  const screenY = minY * viewport.zoom + viewport.y
  const screenWidth = (maxX - minX) * viewport.zoom
  const screenHeight = (maxY - minY) * viewport.zoom
  const centerX = screenX + screenWidth / 2
  const centerY = screenY + screenHeight / 2

  const handleSize = 8
  const rotateHandleSize = 24
  const rotateHandleOffset = 32

  const containerTransform = useMemo(() => {
    const matrix = TransformMatrix.compose(
      centerX,
      centerY,
      screenWidth,
      screenHeight,
      0,
      1,
      1
    )
    return TransformMatrix.toCssString(matrix)
  }, [centerX, centerY, screenWidth, screenHeight])

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: screenWidth,
        height: screenHeight,
        transform: containerTransform,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          outline: '1px solid var(--canvas-primary)',
          background: 'rgba(37, 99, 235, 0.05)',
        }}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          top: -handleSize / 2,
          left: -handleSize / 2,
          cursor: 'nw-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'nw')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          top: -handleSize / 2,
          right: -handleSize / 2,
          cursor: 'ne-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'ne')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          bottom: -handleSize / 2,
          left: -handleSize / 2,
          cursor: 'sw-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'sw')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          bottom: -handleSize / 2,
          right: -handleSize / 2,
          cursor: 'se-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'se')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          top: -handleSize / 2,
          left: screenWidth / 2 - handleSize / 2,
          cursor: 'n-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'n')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          bottom: -handleSize / 2,
          left: screenWidth / 2 - handleSize / 2,
          cursor: 's-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 's')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          left: -handleSize / 2,
          top: screenHeight / 2 - handleSize / 2,
          cursor: 'w-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'w')}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--canvas-primary)',
          right: -handleSize / 2,
          top: screenHeight / 2 - handleSize / 2,
          cursor: 'e-resize',
        }}
        onMouseDown={(e) => onMultiResizeStart(e, 'e')}
      />
      <div
        className="pointer-events-auto absolute"
        style={{
          width: rotateHandleSize,
          height: rotateHandleSize,
          background: 'transparent',
          border: 'none',
          top: -rotateHandleOffset,
          left: -rotateHandleOffset,
          cursor: `url('/rotate_1.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
        }}
        onMouseDown={onMultiRotateStart}
      />
      <div
        className="pointer-events-auto absolute"
        style={{
          width: rotateHandleSize,
          height: rotateHandleSize,
          background: 'transparent',
          border: 'none',
          top: -rotateHandleOffset,
          right: -rotateHandleOffset,
          cursor: `url('/rotate_2.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
        }}
        onMouseDown={onMultiRotateStart}
      />
      <div
        className="pointer-events-auto absolute"
        style={{
          width: rotateHandleSize,
          height: rotateHandleSize,
          background: 'transparent',
          border: 'none',
          bottom: -rotateHandleOffset,
          left: -rotateHandleOffset,
          cursor: `url('/rotate_4.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
        }}
        onMouseDown={onMultiRotateStart}
      />
      <div
        className="pointer-events-auto absolute"
        style={{
          width: rotateHandleSize,
          height: rotateHandleSize,
          background: 'transparent',
          border: 'none',
          bottom: -rotateHandleOffset,
          right: -rotateHandleOffset,
          cursor: `url('/rotate_3.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
        }}
        onMouseDown={onMultiRotateStart}
      />
    </div>
  )
})

const SHAPE_TYPE_NAMES: Record<ShapeType, string> = {
  rect: '矩形',
  circle: '圆形',
  text: '文本',
  note: '便签',
  image: '图片',
  arrow: '箭头',
  draw: '画笔',
  clothing: '服装',
  'ai-combination': 'AI组合',
  'image-slot': '图片槽',
  'custom-combination': '自定义组合',
  'detail-image': '详情图片',
  group: '编组',
}

const ShapeInfoLayer = memo<{
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: { x: number; y: number; zoom: number }
}>(({ shapes, selectedIds, viewport }) => {
  const selectedShape = shapes.find((s) => selectedIds.includes(s.id))
  
  if (!selectedShape || selectedIds.length !== 1) return null

  const vb = getVisualBounds(selectedShape)
  const bounds = getRotatedBoundingBox(
    vb.x, 
    vb.y, 
    vb.width, 
    vb.height, 
    vb.rotation
  )
  const screenX = bounds.minX * viewport.zoom + viewport.x
  const screenY = bounds.minY * viewport.zoom + viewport.y
  const screenWidth = (bounds.maxX - bounds.minX) * viewport.zoom

  const isImage = selectedShape.type === 'image'
  const isAICombination = selectedShape.type === 'ai-combination'
  const hasImage = !!selectedShape.imageUrl
  
  const shapeName = useMemo(() => {
    if (isImage) {
      return selectedShape.imageName || '图片'
    }
    if (isAICombination && selectedShape.combinationTypeId) {
      const combinationType = combinationRegistry.get(selectedShape.combinationTypeId)
      return combinationType?.name || 'AI组合'
    }
    return SHAPE_TYPE_NAMES[selectedShape.type]
  }, [isImage, isAICombination, selectedShape.imageName, selectedShape.combinationTypeId, selectedShape.type])

  const shapeInfo = isImage && hasImage && selectedShape.imageWidth && selectedShape.imageHeight 
    ? `${selectedShape.imageWidth} × ${selectedShape.imageHeight}` 
    : null

  return (
    <div
      className="fixed flex items-center justify-between text-[10px] z-50"
      style={{
        left: screenX,
        top: screenY - 16,
        width: screenWidth,
        color: 'var(--canvas-primary)',
      }}
    >
      <span className="truncate">{shapeName}</span>
      {shapeInfo && (
        <span>{shapeInfo}</span>
      )}
    </div>
  )
})

const SelectionBox = memo<SelectionBoxProps>(({ shape, viewport, onResizeStart, onRotateStart }) => {
  const vb = getVisualBounds(shape)
  const bounds = getRotatedBoundingBox(vb.x, vb.y, vb.width, vb.height, vb.rotation)
  const screenX = bounds.minX * viewport.zoom + viewport.x
  const screenY = bounds.minY * viewport.zoom + viewport.y
  const screenWidth = (bounds.maxX - bounds.minX) * viewport.zoom
  const screenHeight = (bounds.maxY - bounds.minY) * viewport.zoom
  const centerX = screenX + screenWidth / 2
  const centerY = screenY + screenHeight / 2

  const handleSize = 8
  const rotateHandleSize = 24
  const rotateHandleOffset = 32

  const canResize = shape.resizable !== false
  const canRotate = shape.rotatable !== false

  const containerTransform = useMemo(() => {
    const matrix = TransformMatrix.compose(
      centerX,
      centerY,
      screenWidth,
      screenHeight,
      0,
      1,
      1
    )
    return TransformMatrix.toCssString(matrix)
  }, [centerX, centerY, screenWidth, screenHeight])

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: screenWidth,
        height: screenHeight,
        transform: containerTransform,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ outline: '1px solid var(--canvas-primary)' }}
      />

      {canResize && (
        <>
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--canvas-primary)',
              top: -handleSize / 2,
              left: -handleSize / 2,
              cursor: 'nw-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'nw', shape.id); }}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--canvas-primary)',
              top: -handleSize / 2,
              right: -handleSize / 2,
              cursor: 'ne-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'ne', shape.id); }}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--canvas-primary)',
              bottom: -handleSize / 2,
              left: -handleSize / 2,
              cursor: 'sw-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'sw', shape.id); }}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--canvas-primary)',
              bottom: -handleSize / 2,
              right: -handleSize / 2,
              cursor: 'se-resize',
            }}
            onMouseDown={(e) => onResizeStart(e, 'se', shape.id)}
          />

          <div
            className="edge-hitarea pointer-events-auto absolute"
            style={{
              top: -handleSize / 2,
              left: handleSize,
              right: handleSize,
              height: handleSize,
              cursor: 'n-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'n', shape.id); }}
          />
          <div
            className="edge-hitarea pointer-events-auto absolute"
            style={{
              bottom: -handleSize / 2,
              left: handleSize,
              right: handleSize,
              height: handleSize,
              cursor: 's-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 's', shape.id); }}
          />
          <div
            className="edge-hitarea pointer-events-auto absolute"
            style={{
              left: -handleSize / 2,
              top: handleSize,
              bottom: handleSize,
              width: handleSize,
              cursor: 'w-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'w', shape.id); }}
          />
          <div
            className="edge-hitarea pointer-events-auto absolute"
            style={{
              right: -handleSize / 2,
              top: handleSize,
              bottom: handleSize,
              width: handleSize,
              cursor: 'e-resize',
            }}
            onMouseDown={(e) => { e.preventDefault(); onResizeStart(e, 'e', shape.id); }}
          />
        </>
      )}

      {canRotate && (
        <>
          <div
            className="pointer-events-auto absolute"
            style={{
              width: rotateHandleSize,
              height: rotateHandleSize,
              background: 'transparent',
              border: 'none',
              top: -rotateHandleOffset,
              left: -rotateHandleOffset,
              cursor: `url('/rotate_1.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
            }}
            onMouseDown={(e) => { e.preventDefault(); onRotateStart(e, 'nw', shape.id); }}
          />
          <div
            className="pointer-events-auto absolute"
            style={{
              width: rotateHandleSize,
              height: rotateHandleSize,
              background: 'transparent',
              border: 'none',
              top: -rotateHandleOffset,
              right: -rotateHandleOffset,
              cursor: `url('/rotate_2.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
            }}
            onMouseDown={(e) => { e.preventDefault(); onRotateStart(e, 'ne', shape.id); }}
          />
          <div
            className="pointer-events-auto absolute"
            style={{
              width: rotateHandleSize,
              height: rotateHandleSize,
              background: 'transparent',
              border: 'none',
              bottom: -rotateHandleOffset,
              left: -rotateHandleOffset,
              cursor: `url('/rotate_4.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
            }}
            onMouseDown={(e) => { e.preventDefault(); onRotateStart(e, 'sw', shape.id); }}
          />
          <div
            className="pointer-events-auto absolute"
            style={{
              width: rotateHandleSize,
              height: rotateHandleSize,
              background: 'transparent',
              border: 'none',
              bottom: -rotateHandleOffset,
              right: -rotateHandleOffset,
              cursor: `url('/rotate_3.svg') ${rotateHandleSize / 2} ${rotateHandleSize / 2}, crosshair`,
            }}
            onMouseDown={(e) => { e.preventDefault(); onRotateStart(e, 'se', shape.id); }}
          />
        </>
      )}
    </div>
  )
})

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [previousTool, setPreviousTool] = useState<ToolType>('select')
  const [isSpaceDragging, setIsSpaceDragging] = useState(false)
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)
  const isTextResizingRef = useRef(false)

  const {
    shapes,
    selectedIds,
    viewport,
    activeTool,
    isDragging,
    isSpacePressed,
    isPanning,
    isZooming,
    setViewport,
    setSelectedIds,
    addToSelection,
    clearSelection,
    setIsDragging,
    setIsSpacePressed,
    setIsPanning,
    setIsZooming,
    setActiveTool,
    updateShape,
    saveHistory,
    screenToCanvas,
    scheduleAutoSave,
    batchUpdateShapes,
  } = useCanvasStore(useShallow((state) => ({
    shapes: state.shapes,
    selectedIds: state.selectedIds,
    viewport: state.viewport,
    activeTool: state.activeTool,
    isDragging: state.isDragging,
    isSpacePressed: state.isSpacePressed,
    isPanning: state.isPanning,
    isZooming: state.isZooming,
    setViewport: state.setViewport,
    setSelectedIds: state.setSelectedIds,
    addToSelection: state.addToSelection,
    clearSelection: state.clearSelection,
    setIsDragging: state.setIsDragging,
    setIsSpacePressed: state.setIsSpacePressed,
    setIsPanning: state.setIsPanning,
    setIsZooming: state.setIsZooming,
    setActiveTool: state.setActiveTool,
    updateShape: state.updateShape,
    saveHistory: state.saveHistory,
    screenToCanvas: state.screenToCanvas,
    scheduleAutoSave: state.scheduleAutoSave,
    batchUpdateShapes: state.batchUpdateShapes,
  })))

  const effectiveTool = isSpacePressed ? 'hand' : activeTool
  const showCrosshair = false

  const viewportDragStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null)
  const viewportRafRef = useRef<number | null>(null)
  const pendingViewportRef = useRef<{ x: number; y: number; zoom: number } | null>(null)
  const wheelRafRef = useRef<number | null>(null)
  const pendingWheelRef = useRef<{ zoom: number; x: number; y: number } | null>(null)
  const resizeStartRef = useRef<{ startMouseX: number; startMouseY: number; startWidth: number; startHeight: number; startPosX: number; startPosY: number; handle: string; shapeId: string; shapeType: ShapeType } | null>(null)
  const rotateStartRef = useRef<{ x: number; y: number; startAngle: number; initialRotation: number; centerX: number; centerY: number; shapeId: string } | null>(null)
  const multiSelectResizeStartRef = useRef<MultiSelectResizeStart | null>(null)
  const multiSelectRotateStartRef = useRef<MultiSelectRotateStart | null>(null)

  const rafIdRef = useRef<number | null>(null)
  const pendingShapeUpdatesRef = useRef<Map<string, Partial<ShapeProps>>>(new Map())
  const latestMouseEventRef = useRef<{
    clientX: number
    clientY: number
    viewportDrag: boolean
    selectionRect: boolean
    multiSelectDrag: boolean
    multiSelectResize: boolean
    multiSelectRotate: boolean
    resize: boolean
    rotate: boolean
  } | null>(null)

  const getShapesInRect = (rect: SelectionRect): string[] => {
    const minX = Math.min(rect.startX, rect.endX)
    const maxX = Math.max(rect.startX, rect.endX)
    const minY = Math.min(rect.startY, rect.endY)
    const maxY = Math.max(rect.startY, rect.endY)

    return shapes
      .filter((shape) => {
        const shapeRight = shape.x + shape.width
        const shapeBottom = shape.y + shape.height
        return (
          shape.x < maxX &&
          shapeRight > minX &&
          shape.y < maxY &&
          shapeBottom > minY
        )
      })
      .map((s) => s.id)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return

    const target = e.target as HTMLElement
    const isShapeElement = target.closest('.canvas-shape')
    const isCanvasBackground = target.closest('.canvas-container') && !isShapeElement

    if (effectiveTool === 'hand' || (e.shiftKey && effectiveTool === 'select')) {
      viewportDragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        viewportX: viewport.x,
        viewportY: viewport.y,
      }
      setIsSpaceDragging(true)
      setIsPanning(true)
      return
    }

    if (effectiveTool === 'select') {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)

      if (isCanvasBackground) {
        if (e.shiftKey) {
          setSelectionRect({
            startX: canvasPoint.x,
            startY: canvasPoint.y,
            endX: canvasPoint.x,
            endY: canvasPoint.y,
          })
          setIsDragging(true)
        } else {
          clearSelection()
          setSelectionRect({
            startX: canvasPoint.x,
            startY: canvasPoint.y,
            endX: canvasPoint.x,
            endY: canvasPoint.y,
          })
          setIsDragging(true)
        }
        return
      }
    }
  }, [effectiveTool, viewport, screenToCanvas, clearSelection, setIsDragging, setIsPanning])

  const processShapeUpdates = useCallback(() => {
    rafIdRef.current = null
    const updates = pendingShapeUpdatesRef.current
    if (updates.size === 0) return

    const updatesArray = Array.from(updates.entries()).map(([id, props]) => ({ id, props }))
    batchUpdateShapes(updatesArray)
    updates.clear()
  }, [batchUpdateShapes])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging && !isSpaceDragging) return

    if (viewportDragStartRef.current) {
      const { x, y, viewportX, viewportY } = viewportDragStartRef.current
      const dx = e.clientX - x
      const dy = e.clientY - y
      const newX = viewportX + dx
      const newY = viewportY + dy

      pendingViewportRef.current = { x: newX, y: newY, zoom: viewport.zoom }
      if (viewportRafRef.current === null) {
        viewportRafRef.current = requestAnimationFrame(() => {
          viewportRafRef.current = null
          if (pendingViewportRef.current && viewportRef.current) {
            const { x: px, y: py, zoom: pz } = pendingViewportRef.current
            viewportRef.current.style.transform = `matrix(${pz}, 0, 0, ${pz}, ${px}, ${py})`
          }
        })
      }
      return
    }

    if (selectionRect) {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)
      setSelectionRect((prev) => prev ? { ...prev, endX: canvasPoint.x, endY: canvasPoint.y } : null)
      return
    }

    if (multiSelectResizeStartRef.current) {
      const { startMouseX, startMouseY, startBounds, shapePositions, handle } = multiSelectResizeStartRef.current

      const dx = (e.clientX - startMouseX) / viewport.zoom
      const dy = (e.clientY - startMouseY) / viewport.zoom

      const { minX, minY, maxX, maxY } = startBounds
      const startWidth = maxX - minX
      const startHeight = maxY - minY

      let scaleX = 1
      let scaleY = 1
      let offsetX = 0
      let offsetY = 0

      if (handle === 'se') {
        scaleX = (startWidth + dx) / startWidth
        scaleY = (startHeight + dy) / startHeight
      } else if (handle === 'nw') {
        scaleX = (startWidth - dx) / startWidth
        scaleY = (startHeight - dy) / startHeight
        offsetX = dx
        offsetY = dy
      } else if (handle === 'ne') {
        scaleX = (startWidth + dx) / startWidth
        scaleY = (startHeight - dy) / startHeight
        offsetY = dy
      } else if (handle === 'sw') {
        scaleX = (startWidth - dx) / startWidth
        scaleY = (startHeight + dy) / startHeight
        offsetX = dx
      } else if (handle === 'n') {
        scaleY = (startHeight - dy) / startHeight
        offsetY = dy
      } else if (handle === 's') {
        scaleY = (startHeight + dy) / startHeight
      } else if (handle === 'w') {
        scaleX = (startWidth - dx) / startWidth
        offsetX = dx
      } else if (handle === 'e') {
        scaleX = (startWidth + dx) / startWidth
      }

      shapePositions.forEach((pos, id) => {
        const relX = pos.x - minX
        const relY = pos.y - minY
        pendingShapeUpdatesRef.current.set(id, {
          x: minX + offsetX + relX * scaleX,
          y: minY + offsetY + relY * scaleY,
          width: pos.width * scaleX,
          height: pos.height * scaleY,
        })
      })

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(processShapeUpdates)
      }
      return
    }

    if (multiSelectRotateStartRef.current) {
      const { startAngle, centerX, centerY, initialRotations, initialPositions } = multiSelectRotateStartRef.current

      const currentAngle = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
      )

      const angleDelta = currentAngle - startAngle

      initialPositions.forEach((initialPos, id) => {
        const screenInitialCenterX = initialPos.centerX * viewport.zoom + viewport.x
        const screenInitialCenterY = initialPos.centerY * viewport.zoom + viewport.y

        const offsetX = screenInitialCenterX - centerX
        const offsetY = screenInitialCenterY - centerY

        const cos = Math.cos(angleDelta)
        const sin = Math.sin(angleDelta)

        const newOffsetX = offsetX * cos - offsetY * sin
        const newOffsetY = offsetX * sin + offsetY * cos

        const newScreenCenterX = centerX + newOffsetX
        const newScreenCenterY = centerY + newOffsetY

        const newCanvasCenterX = (newScreenCenterX - viewport.x) / viewport.zoom
        const newCanvasCenterY = (newScreenCenterY - viewport.y) / viewport.zoom

        const shape = useCanvasStore.getState().shapes.find((s) => s.id === id)
        if (!shape) return

        const newRotation = (initialRotations.get(id) || 0) + (angleDelta * 180) / Math.PI

        pendingShapeUpdatesRef.current.set(id, {
          rotation: newRotation,
          x: newCanvasCenterX - shape.width / 2,
          y: newCanvasCenterY - shape.height / 2,
        })
      })

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(processShapeUpdates)
      }
      return
    }

    if (resizeStartRef.current) {
      const { startMouseX, startMouseY, startWidth, startHeight, startPosX, startPosY, handle, shapeId, shapeType } = resizeStartRef.current

      const shape = shapes.find((s) => s.id === shapeId)
      if (!shape) return

      const minSize = SHAPE_MIN_SIZE[shape.type]
      const minWidth = minSize.minWidth
      const minHeight = minSize.minHeight

      let dx = (e.clientX - startMouseX) / viewport.zoom
      let dy = (e.clientY - startMouseY) / viewport.zoom

      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      const isImage = shapeType === 'image'
      const isTextNode = shapeType === 'text' || shapeType === 'note'
      const startScaleX = (resizeStartRef.current as any).startScaleX ?? 1
      const aspectRatio = startWidth / startHeight

      if (isImage) {
        let scale = 1
        if (handle === 'se') {
          const scaleX = (startWidth + dx) / startWidth
          const scaleY = (startHeight + dy) / startHeight
          scale = Math.max(scaleX, scaleY)
        } else if (handle === 'nw') {
          const scaleX = (startWidth - dx) / startWidth
          const scaleY = (startHeight - dy) / startHeight
          scale = Math.max(scaleX, scaleY)
          newX = startPosX + startWidth - startWidth * scale
          newY = startPosY + startHeight - startHeight * scale
        } else if (handle === 'ne') {
          const scaleX = (startWidth + dx) / startWidth
          const scaleY = (startHeight - dy) / startHeight
          scale = Math.max(scaleX, scaleY)
          newY = startPosY + startHeight - startHeight * scale
        } else if (handle === 'sw') {
          const scaleX = (startWidth - dx) / startWidth
          const scaleY = (startHeight + dy) / startHeight
          scale = Math.max(scaleX, scaleY)
          newX = startPosX + startWidth - startWidth * scale
        } else if (handle === 'n' || handle === 's') {
          const scaleY = handle === 'n' 
            ? (startHeight - dy) / startHeight 
            : (startHeight + dy) / startHeight
          scale = scaleY
          if (handle === 'n') {
            newY = startPosY + startHeight - startHeight * scale
          }
        } else if (handle === 'w' || handle === 'e') {
          const scaleX = handle === 'w' 
            ? (startWidth - dx) / startWidth 
            : (startWidth + dx) / startWidth
          scale = scaleX
          if (handle === 'w') {
            newX = startPosX + startWidth - startWidth * scale
          }
        }
        
        newWidth = Math.max(minWidth, startWidth * scale)
        newHeight = Math.max(minHeight, startHeight * scale)
      } else if (isTextNode) {
        let scaleFactor = 1
        const visualStartWidth = startWidth * startScaleX
        const visualStartHeight = startHeight * startScaleX

        if (handle === 'se') {
          const sX = (visualStartWidth + dx) / visualStartWidth
          const sY = (visualStartHeight + dy) / visualStartHeight
          scaleFactor = Math.max(sX, sY)
        } else if (handle === 'nw') {
          const sX = (visualStartWidth - dx) / visualStartWidth
          const sY = (visualStartHeight - dy) / visualStartHeight
          scaleFactor = Math.max(sX, sY)
        } else if (handle === 'ne') {
          const sX = (visualStartWidth + dx) / visualStartWidth
          const sY = (visualStartHeight - dy) / visualStartHeight
          scaleFactor = Math.max(sX, sY)
        } else if (handle === 'sw') {
          const sX = (visualStartWidth - dx) / visualStartWidth
          const sY = (visualStartHeight + dy) / visualStartHeight
          scaleFactor = Math.max(sX, sY)
        } else if (handle === 'n' || handle === 's') {
          const sY = handle === 'n' 
            ? (visualStartHeight - dy) / visualStartHeight 
            : (visualStartHeight + dy) / visualStartHeight
          scaleFactor = sY
        } else if (handle === 'w' || handle === 'e') {
          const sX = handle === 'w' 
            ? (visualStartWidth - dx) / visualStartWidth 
            : (visualStartWidth + dx) / visualStartWidth
          scaleFactor = sX
        }

        const finalScale = Math.max(0.1, startScaleX * scaleFactor)
        
        if (handle === 'se') {
          newX = startPosX + (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY + (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 'nw') {
          newX = startPosX - (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY - (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 'ne') {
          newX = startPosX + (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY - (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 'sw') {
          newX = startPosX - (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY + (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 'n') {
          newX = startPosX 
          newY = startPosY - (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 's') {
          newX = startPosX 
          newY = startPosY + (startHeight / 2) * (finalScale - startScaleX)
        } else if (handle === 'w') {
          newX = startPosX - (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY 
        } else if (handle === 'e') {
          newX = startPosX + (startWidth / 2) * (finalScale - startScaleX)
          newY = startPosY 
        }
        
        pendingShapeUpdatesRef.current.set(shapeId, { scaleX: finalScale, scaleY: finalScale, x: newX, y: newY })

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(processShapeUpdates)
        }
        return
      } else {
        if (handle === 'se') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newWidth = startWidth + dx
          newHeight = startHeight + dy
        } else if (handle === 'nw') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newWidth = startWidth - dx
          newHeight = startHeight - dy
          newX = startPosX + dx
          newY = startPosY + dy
        } else if (handle === 'ne') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newWidth = startWidth + dx
          newHeight = startHeight - dy
          newY = startPosY + dy
        } else if (handle === 'sw') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newWidth = startWidth - dx
          newHeight = startHeight + dy
          newX = startPosX + dx
        } else if (handle === 'n') {
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newHeight = startHeight - dy
          newY = startPosY + dy
        } else if (handle === 's') {
          dy = Math.min(Math.max(-startHeight + minHeight, dy), 1000)
          newHeight = startHeight + dy
        } else if (handle === 'w') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          newWidth = startWidth - dx
          newX = startPosX + dx
        } else if (handle === 'e') {
          dx = Math.min(Math.max(-startWidth + minWidth, dx), 1000)
          newWidth = startWidth + dx
        }
      }

      pendingShapeUpdatesRef.current.set(shapeId, { width: newWidth, height: newHeight, x: newX, y: newY })

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(processShapeUpdates)
      }
      return
    }

    if (rotateStartRef.current) {
      const { startAngle, initialRotation, centerX, centerY, shapeId } = rotateStartRef.current

      const currentAngle = Math.atan2(
        e.clientY - centerY,
        e.clientX - centerX
      )

      const angleDelta = currentAngle - startAngle
      const newRotation = initialRotation + (angleDelta * 180) / Math.PI

      pendingShapeUpdatesRef.current.set(shapeId, { rotation: newRotation })

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(processShapeUpdates)
      }
    }
  }, [isDragging, isSpaceDragging, viewport.zoom, screenToCanvas, shapes, selectionRect, processShapeUpdates])

  const handleMouseUp = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    if (pendingShapeUpdatesRef.current.size > 0) {
      processShapeUpdates()
    }

    if (selectionRect) {
      const shapesInRect = getShapesInRect(selectionRect)
      if (shapesInRect.length > 0) {
        setSelectedIds(shapesInRect)
      }
      setSelectionRect(null)
    }

    if (multiSelectResizeStartRef.current) {
      multiSelectResizeStartRef.current = null
      saveHistory()
      scheduleAutoSave()
    }

    if (multiSelectRotateStartRef.current) {
      multiSelectRotateStartRef.current = null
      saveHistory()
      scheduleAutoSave()
    }

    if (viewportDragStartRef.current) {
      if (viewportRafRef.current !== null) {
        cancelAnimationFrame(viewportRafRef.current)
        viewportRafRef.current = null
      }
    }

    if (isSpaceDragging) {
      if (pendingViewportRef.current) {
        setViewport({
          x: pendingViewportRef.current.x,
          y: pendingViewportRef.current.y,
          zoom: pendingViewportRef.current.zoom,
        })
        pendingViewportRef.current = null
      }
      setIsSpaceDragging(false)
      setIsPanning(false)
      viewportDragStartRef.current = null
      return
    }

    if (resizeStartRef.current) {
      resizeStartRef.current = null
      isTextResizingRef.current = false
      saveHistory()
      scheduleAutoSave()
    }
    if (rotateStartRef.current) {
      rotateStartRef.current = null
      saveHistory()
      scheduleAutoSave()
    }
    setIsDragging(false)
  }, [selectionRect, setSelectedIds, saveHistory, setIsDragging, scheduleAutoSave, processShapeUpdates, isSpaceDragging, setViewport, setIsPanning])

  const handleSingleResizeStart = useCallback((e: React.MouseEvent, handle: string, shapeId: string) => {
    e.stopPropagation()
    e.preventDefault()

    const shape = shapes.find((s) => s.id === shapeId)
    if (!shape) return

    resizeStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWidth: shape.width,
      startHeight: shape.height,
      startPosX: shape.x,
      startPosY: shape.y,
      startScaleX: shape.scaleX ?? 1,
      handle,
      shapeId,
      shapeType: shape.type,
    } as any
    // text/note resize keeps selection box visible
    isTextResizingRef.current = shape.type === 'text' || shape.type === 'note'
    setIsDragging(true)
  }, [shapes, setIsDragging])

  const handleSingleRotateStart = useCallback((e: React.MouseEvent, _corner: string, shapeId: string) => {
    e.stopPropagation()
    e.preventDefault()

    const shape = shapes.find((s) => s.id === shapeId)
    if (!shape) return

    const centerX = (shape.x + shape.width / 2) * viewport.zoom + viewport.x
    const centerY = (shape.y + shape.height / 2) * viewport.zoom + viewport.y

    const currentAngle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    )

    rotateStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startAngle: currentAngle,
      initialRotation: shape.rotation,
      centerX,
      centerY,
      shapeId,
    }
    setIsDragging(true)
  }, [shapes, viewport, setIsDragging])

  const handleMultiResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation()
    e.preventDefault()

    if (selectedIds.length < 2) return

    const selectedShapesList = shapes.filter((s) => selectedIds.includes(s.id))
    const minX = Math.min(...selectedShapesList.map((s) => s.x))
    const minY = Math.min(...selectedShapesList.map((s) => s.y))
    const maxX = Math.max(...selectedShapesList.map((s) => s.x + s.width))
    const maxY = Math.max(...selectedShapesList.map((s) => s.y + s.height))

    multiSelectResizeStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startBounds: { minX, minY, maxX, maxY },
      shapePositions: new Map(
        selectedShapesList.map((s) => [s.id, { x: s.x, y: s.y, width: s.width, height: s.height, rotation: s.rotation }])
      ),
      handle,
    }
    setIsDragging(true)
  }, [shapes, selectedIds, setIsDragging])

  const handleMultiRotateStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (selectedIds.length < 2) return

    const selectedShapesList = shapes.filter((s) => selectedIds.includes(s.id))
    const minX = Math.min(...selectedShapesList.map((s) => s.x))
    const minY = Math.min(...selectedShapesList.map((s) => s.y))
    const maxX = Math.max(...selectedShapesList.map((s) => s.x + s.width))
    const maxY = Math.max(...selectedShapesList.map((s) => s.y + s.height))

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const screenCenterX = centerX * viewport.zoom + viewport.x
    const screenCenterY = centerY * viewport.zoom + viewport.y

    const currentAngle = Math.atan2(
      e.clientY - screenCenterY,
      e.clientX - screenCenterX
    )

    multiSelectRotateStartRef.current = {
      startAngle: currentAngle,
      centerX: screenCenterX,
      centerY: screenCenterY,
      initialRotations: new Map(selectedShapesList.map((s) => [s.id, s.rotation])),
      initialPositions: new Map(
        selectedShapesList.map((s) => [
          s.id,
          {
            x: s.x,
            y: s.y,
            centerX: s.x + s.width / 2,
            centerY: s.y + s.height / 2,
          },
        ])
      ),
    }
    setIsDragging(true)
  }, [shapes, selectedIds, viewport, setIsDragging])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let wheelTimeoutId: NodeJS.Timeout | null = null

    const flushWheelState = () => {
      if (pendingWheelRef.current) {
        setViewport(pendingWheelRef.current)
        pendingWheelRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.classList.remove('is-zooming')
      }
      if (viewportRef.current) {
        const store = useCanvasStore.getState()
        if (!store.isPanning && !isSpaceDragging) {
          viewportRef.current.style.pointerEvents = 'auto'
          viewportRef.current.style.willChange = 'auto'
        }
      }
    }

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault()
      
      if (containerRef.current) {
        containerRef.current.classList.add('is-zooming')
      }
      if (viewportRef.current) {
        viewportRef.current.style.pointerEvents = 'none'
        viewportRef.current.style.willChange = 'transform'
      }

      if (e.metaKey || e.ctrlKey) {
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const currentZoom = pendingWheelRef.current?.zoom ?? viewport.zoom
        const currentX = pendingWheelRef.current?.x ?? viewport.x
        const currentY = pendingWheelRef.current?.y ?? viewport.y
        const newZoom = Math.max(0.1, Math.min(10, currentZoom * delta))

        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const canvasX = (mouseX - currentX) / currentZoom
        const canvasY = (mouseY - currentY) / currentZoom

        const newX = mouseX - canvasX * newZoom
        const newY = mouseY - canvasY * newZoom

        pendingWheelRef.current = { zoom: newZoom, x: newX, y: newY }

        if (wheelRafRef.current === null) {
          wheelRafRef.current = requestAnimationFrame(() => {
            wheelRafRef.current = null
            if (pendingWheelRef.current && viewportRef.current) {
              const { zoom, x, y } = pendingWheelRef.current
              viewportRef.current.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${x}, ${y})`
            }
          })
        }
      } else {
        const currentX = pendingWheelRef.current?.x ?? viewport.x
        const currentY = pendingWheelRef.current?.y ?? viewport.y
        const currentZoom = pendingWheelRef.current?.zoom ?? viewport.zoom

        const newX = currentX - e.deltaX
        const newY = currentY - e.deltaY

        pendingWheelRef.current = { zoom: currentZoom, x: newX, y: newY }

        if (wheelRafRef.current === null) {
          wheelRafRef.current = requestAnimationFrame(() => {
            wheelRafRef.current = null
            if (pendingWheelRef.current && viewportRef.current) {
              const { zoom, x, y } = pendingWheelRef.current
              viewportRef.current.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${x}, ${y})`
            }
          })
        }
      }

      if (wheelTimeoutId !== null) {
        clearTimeout(wheelTimeoutId)
      }
      wheelTimeoutId = setTimeout(flushWheelState, 150)
    }

    container.addEventListener('wheel', wheelHandler, { passive: false })
    return () => {
      container.removeEventListener('wheel', wheelHandler)
      if (wheelTimeoutId !== null) {
        clearTimeout(wheelTimeoutId)
      }
      if (wheelRafRef.current !== null) {
        cancelAnimationFrame(wheelRafRef.current)
      }
    }
  }, [viewport, setViewport])

  useEffect(() => {
    const handleImagesUploaded = (e: CustomEvent<{
      images: Array<{ url: string; width: number; height: number; name: string }>
      startX: number
      startY: number
      placeholderId?: string
    }>) => {
      const { images, startX, startY, placeholderId } = e.detail
      if (images.length === 0) return

      const GAP = 20
      const MAX_WIDTH = 400

      let currentX = startX
      let currentY = startY
      const newIds: string[] = []

      images.forEach((img) => {
        let width = img.width
        let height = img.height

        if (width > MAX_WIDTH) {
          const scale = MAX_WIDTH / width
          width = MAX_WIDTH
          height = height * scale
        }

        const newId = useCanvasStore.getState().addShape({
          type: 'image',
          x: currentX,
          y: currentY,
          width,
          height,
          rotation: 0,
          fill: 'transparent',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1,
          imageUrl: img.url,
          imageName: img.name,
          imageWidth: img.width,
          imageHeight: img.height,
        })
        newIds.push(newId.id)

        currentX += width + GAP
      })

      if (placeholderId) {
        useCanvasStore.getState().deleteShape(placeholderId)
      }

      if (newIds.length > 0) {
        setSelectedIds(newIds)
      }
    }

    window.addEventListener('images-uploaded', handleImagesUploaded as EventListener)
    return () => window.removeEventListener('images-uploaded', handleImagesUploaded as EventListener)
  }, [setSelectedIds])

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (
        target instanceof HTMLInputElement || 
        target instanceof HTMLTextAreaElement || 
        target.isContentEditable
      ) {
        return
      }

      // 如果有文本被选中在页面上（例如侧边栏的聊天气泡中的文本），允许浏览器原生的复制行为
      const hasTextSelection = window.getSelection()?.toString().length ? true : false

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (hasTextSelection) return
        useCanvasStore.getState().deleteSelectedShapes()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        if (hasTextSelection) return
        e.preventDefault()
        useCanvasStore.getState().copySelectedShapes()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault()

        // 优先尝试从系统剪贴板读取图片
        if (navigator.clipboard && navigator.clipboard.read) {
          try {
            const clipboardItems = await navigator.clipboard.read()
            let imageBlob: Blob | null = null

            for (const item of clipboardItems) {
              const imageType = item.types.find((t) => t.startsWith('image/'))
              if (imageType) {
                imageBlob = await item.getType(imageType)
                break
              }
            }

            if (imageBlob) {
              // 有剪贴板图片，上传并插入画布
              const file = new File([imageBlob], `paste-${Date.now()}.png`, { type: imageBlob.type })
              const result = await aiCombinationService.uploadImage(file, 'canvas-uploads')
              if (result.success && result.url) {
                const store = useCanvasStore.getState()
                const vp = store.viewport
                const centerX = -vp.x / vp.zoom + window.innerWidth / 2 / vp.zoom
                const centerY = -vp.y / vp.zoom + window.innerHeight / 2 / vp.zoom

                const img = new Image()
                img.src = result.url
                await new Promise<void>((resolve) => {
                  img.onload = () => resolve()
                  img.onerror = () => resolve()
                })

                const MAX_WIDTH = 512
                let w = img.naturalWidth || MAX_WIDTH
                let h = img.naturalHeight || MAX_WIDTH
                if (w > MAX_WIDTH) {
                  const scale = MAX_WIDTH / w
                  w = MAX_WIDTH
                  h = h * scale
                }

                const newShape = store.addShape({
                  type: 'image',
                  x: centerX - w / 2,
                  y: centerY - h / 2,
                  width: w,
                  height: h,
                  rotation: 0,
                  fill: 'transparent',
                  stroke: 'transparent',
                  strokeWidth: 0,
                  opacity: 1,
                  imageUrl: result.url,
                  imageName: '粘贴的图片',
                  imageWidth: img.naturalWidth,
                  imageHeight: img.naturalHeight,
                })
                setSelectedIds([newShape.id])
              }
              return
            }
          } catch {
            // 剪贴板权限被拒绝或不支持，降级到内部粘贴
          }
        }

        // 降级：粘贴画布内部复制的 Shape
        const newIds = useCanvasStore.getState().pasteShapes()
        if (newIds.length > 0) {
          setSelectedIds(newIds)
        }
        return
      }

      // Ctrl+S 保存 - 在 page.tsx 中处理，这里跳过
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        // 不处理，让 page.tsx 处理
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault()
        useCanvasStore.getState().duplicateSelectedShapes()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          useCanvasStore.getState().redo()
        } else {
          useCanvasStore.getState().undo()
        }
        e.preventDefault()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        const allIds = shapes.map((s) => s.id)
        setSelectedIds(allIds)
        return
      }

      if (e.key === ' ' && !isSpacePressed) {
        e.preventDefault()
        setIsSpacePressed(true)
        setPreviousTool(activeTool)
        return
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        setIsSpacePressed(false)
        setIsSpaceDragging(false)
        viewportDragStartRef.current = null
        if (activeTool === 'hand') {
          setActiveTool(previousTool)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [shapes, setSelectedIds, activeTool, previousTool, isSpacePressed, setActiveTool])

  const getCursor = () => {
    if (effectiveTool === 'hand') return 'grab'
    if (showCrosshair) return 'crosshair'
    if (effectiveTool === 'select') return 'default'
    return 'default'
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
        className="absolute pointer-events-none"
        style={{
          left: screenX,
          top: screenY,
          width: screenWidth,
          height: screenHeight,
          border: '1px dashed var(--canvas-primary)',
          background: 'rgba(37, 99, 235, 0.1)',
        }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{ cursor: getCursor() }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files).filter((f) =>
          f.type.startsWith('image/')
        )
        if (files.length === 0) return

        const canvasPoint = screenToCanvas(e.clientX, e.clientY)
        const GAP = 20
        const MAX_WIDTH = 400

        let currentX = canvasPoint.x
        let currentY = canvasPoint.y
        const newIds: string[] = []

        const uploadAndCreateImages = async () => {
          for (const file of files) {
            const result = await aiCombinationService.uploadImage(file, 'canvas-uploads')
            if (result.success && result.url) {
              let width = 0
              let height = 0
              let naturalWidth = 0
              let naturalHeight = 0

              const img = new Image()
              img.src = result.url
              const fileName = file.name.replace(/\.[^/.]+$/, '')
              await new Promise<void>((resolve) => {
                img.onload = () => {
                  width = img.naturalWidth
                  height = img.naturalHeight
                  naturalWidth = img.naturalWidth
                  naturalHeight = img.naturalHeight
                  resolve()
                }
                img.onerror = () => resolve()
              })

              if (width > MAX_WIDTH) {
                const scale = MAX_WIDTH / width
                width = MAX_WIDTH
                height = height * scale
              }

              if (width > 0 && height > 0) {
                const newId = useCanvasStore.getState().addShape({
                  type: 'image',
                  x: currentX,
                  y: currentY,
                  width,
                  height,
                  rotation: 0,
                  fill: 'transparent',
                  stroke: 'transparent',
                  strokeWidth: 0,
                  opacity: 1,
                  imageUrl: result.url,
                  imageName: fileName,
                  imageWidth: naturalWidth,
                  imageHeight: naturalHeight,
                })
                newIds.push(newId.id)
                currentX += width + GAP
              }
            }
          }

          if (newIds.length > 0) {
            setSelectedIds(newIds)
          }
        }

        uploadAndCreateImages()
      }}
    >
      <div
        ref={viewportRef}
        className="canvas-viewport"
        style={{
          transform: `matrix(${viewport.zoom}, 0, 0, ${viewport.zoom}, ${viewport.x}, ${viewport.y})`,
          pointerEvents: isPanning || isZooming ? 'none' : 'auto',
          willChange: isPanning || isZooming ? 'transform' : 'auto',
        }}
      >
        {shapes.map((shape) => (
          <Shape
            key={shape.id}
            shape={shape}
            isSelected={selectedIds.includes(shape.id)}
          />
        ))}
      </div>

      <div className="canvas-hide-on-zoom">
        {(!isDragging || isTextResizingRef.current) && !isPanning && (
          <SelectionBoxLayer
            shapes={shapes}
            selectedIds={selectedIds}
            viewport={viewport}
            onSingleResizeStart={handleSingleResizeStart}
            onSingleRotateStart={handleSingleRotateStart}
            onMultiResizeStart={handleMultiResizeStart}
            onMultiRotateStart={handleMultiRotateStart}
          />
        )}

        {(!isDragging && !isPanning) && (
          <ShapeInfoLayer
            shapes={shapes}
            selectedIds={selectedIds}
            viewport={viewport}
          />
        )}

        <LogoEditorLayer
          shapes={shapes}
          selectedIds={selectedIds}
          viewport={viewport}
        />

        {(!isDragging && !isPanning) && <FloatingConfigPanel containerRef={containerRef} />}
      </div>

      <LogoMaterialPanel />

      <AlignmentGuides />

      <ImagePreviewModal />

      {renderSelectionRect()}

      {isSpacePressed && (
        <div
          className="absolute inset-0 z-[9999]"
          style={{ cursor: isSpaceDragging ? 'grabbing' : 'grab' }}
          onMouseDown={(e) => {
            if (e.button !== 0) return
            viewportDragStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              viewportX: viewport.x,
              viewportY: viewport.y,
            }
            setIsSpaceDragging(true)
            setIsPanning(true)
          }}
          onMouseMove={(e) => {
            if (!isSpaceDragging || !viewportDragStartRef.current) return
            const { x, y, viewportX, viewportY } = viewportDragStartRef.current
            const dx = e.clientX - x
            const dy = e.clientY - y
            const newX = viewportX + dx
            const newY = viewportY + dy

            pendingViewportRef.current = { x: newX, y: newY, zoom: viewport.zoom }
            if (viewportRafRef.current === null) {
              viewportRafRef.current = requestAnimationFrame(() => {
                viewportRafRef.current = null
                if (pendingViewportRef.current && viewportRef.current) {
                  const { x: px, y: py, zoom: pz } = pendingViewportRef.current
                  viewportRef.current.style.transform = `matrix(${pz}, 0, 0, ${pz}, ${px}, ${py})`
                }
              })
            }
          }}
          onMouseUp={() => {
            if (pendingViewportRef.current) {
              setViewport(pendingViewportRef.current)
            }
            viewportDragStartRef.current = null
            setIsSpaceDragging(false)
            setIsPanning(false)
          }}
          onMouseLeave={() => {
            if (isSpaceDragging) {
              if (pendingViewportRef.current) {
                setViewport(pendingViewportRef.current)
              }
              viewportDragStartRef.current = null
              setIsSpaceDragging(false)
              setIsPanning(false)
            }
          }}
        />
      )}
    </div>
  )
}
