'use client'

import React, { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { useCanvasStore } from './store'
import { Shape } from './shapes/Shape'
import { ToolType, ShapeProps, SHAPE_MIN_SIZE } from './shapes/types'
import { LogoEditorLayer } from './components/LogoEditorLayer'
import { LogoMaterialPanel } from './components/LogoMaterialPanel'
import { aiCombinationService } from '@/ai-combination/service'
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

const SelectionBoxLayer: React.FC<{
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: { x: number; y: number; zoom: number }
  onSingleResizeStart: (e: React.MouseEvent, handle: string, shapeId: string) => void
  onSingleRotateStart: (e: React.MouseEvent, corner: string, shapeId: string) => void
  onMultiResizeStart: (e: React.MouseEvent, handle: string) => void
  onMultiRotateStart: (e: React.MouseEvent) => void
}> = ({ shapes, selectedIds, viewport, onSingleResizeStart, onSingleRotateStart, onMultiResizeStart, onMultiRotateStart }) => {
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

  const allBounds = selectedShapes.map((s) => getRotatedBoundingBox(s.x, s.y, s.width, s.height, s.rotation))
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
          outline: '1px solid var(--primary)',
          background: 'rgba(37, 99, 235, 0.05)',
        }}
      />
      <div
        className="resize-handle pointer-events-auto absolute"
        style={{
          width: handleSize,
          height: handleSize,
          background: 'white',
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
          border: '1px solid var(--primary)',
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
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ shape, viewport, onResizeStart, onRotateStart }) => {
  const bounds = getRotatedBoundingBox(shape.x, shape.y, shape.width, shape.height, shape.rotation)
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
        style={{ outline: '1px solid var(--primary)' }}
      />

      {canResize && (
        <>
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--primary)',
              top: -handleSize / 2,
              left: -handleSize / 2,
              cursor: 'nw-resize',
            }}
            onMouseDown={(e) => onResizeStart(e, 'nw', shape.id)}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--primary)',
              top: -handleSize / 2,
              right: -handleSize / 2,
              cursor: 'ne-resize',
            }}
            onMouseDown={(e) => onResizeStart(e, 'ne', shape.id)}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--primary)',
              bottom: -handleSize / 2,
              left: -handleSize / 2,
              cursor: 'sw-resize',
            }}
            onMouseDown={(e) => onResizeStart(e, 'sw', shape.id)}
          />
          <div
            className="resize-handle pointer-events-auto absolute"
            style={{
              width: handleSize,
              height: handleSize,
              background: 'white',
              border: '1px solid var(--primary)',
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
            onMouseDown={(e) => onResizeStart(e, 'n', shape.id)}
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
            onMouseDown={(e) => onResizeStart(e, 's', shape.id)}
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
            onMouseDown={(e) => onResizeStart(e, 'w', shape.id)}
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
            onMouseDown={(e) => onResizeStart(e, 'e', shape.id)}
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
            onMouseDown={(e) => onRotateStart(e, 'nw', shape.id)}
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
            onMouseDown={(e) => onRotateStart(e, 'ne', shape.id)}
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
            onMouseDown={(e) => onRotateStart(e, 'sw', shape.id)}
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
            onMouseDown={(e) => onRotateStart(e, 'se', shape.id)}
          />
        </>
      )}
    </div>
  )
}

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [previousTool, setPreviousTool] = useState<ToolType>('select')
  const [isSpacePressed, setIsSpacePressed] = useState(false)
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null)

  const {
    shapes,
    selectedIds,
    viewport,
    activeTool,
    isDragging,
    setViewport,
    setSelectedIds,
    addToSelection,
    clearSelection,
    setIsDragging,
    setActiveTool,
    updateShape,
    saveHistory,
    screenToCanvas,
  } = useCanvasStore()

  const effectiveTool = isSpacePressed ? 'hand' : activeTool
  const showCrosshair = false

  const viewportDragStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null)
  const resizeStartRef = useRef<{ startMouseX: number; startMouseY: number; startWidth: number; startHeight: number; startPosX: number; startPosY: number; handle: string; shapeId: string } | null>(null)
  const rotateStartRef = useRef<{ x: number; y: number; startAngle: number; initialRotation: number; centerX: number; centerY: number; shapeId: string } | null>(null)
  const multiSelectDragStartRef = useRef<{ x: number; y: number; shapePositions: Map<string, { x: number; y: number }> } | null>(null)
  const multiSelectResizeStartRef = useRef<MultiSelectResizeStart | null>(null)
  const multiSelectRotateStartRef = useRef<MultiSelectRotateStart | null>(null)

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
      setIsDragging(true)
      return
    }

    if (effectiveTool === 'select') {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)

      if (isShapeElement) {
        const shapeId = isShapeElement.getAttribute('data-id')
        if (shapeId) {
          if (e.shiftKey) {
            if (selectedIds.includes(shapeId)) {
              setSelectedIds(selectedIds.filter((id) => id !== shapeId))
            } else {
              addToSelection(shapeId)
            }
          } else {
            if (!selectedIds.includes(shapeId)) {
              setSelectedIds([shapeId])
            }
            multiSelectDragStartRef.current = {
              x: e.clientX,
              y: e.clientY,
              shapePositions: new Map(
                (selectedIds.includes(shapeId) ? selectedIds : [shapeId]).map((id) => {
                  const shape = shapes.find((s) => s.id === id)
                  return [id, { x: shape?.x || 0, y: shape?.y || 0 }]
                })
              ),
            }
            setIsDragging(true)
          }
          return
        }
      }

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
  }, [effectiveTool, viewport, screenToCanvas, shapes, selectedIds, addToSelection, setSelectedIds, clearSelection, setIsDragging, setActiveTool])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return

    if (viewportDragStartRef.current) {
      const { x, y, viewportX, viewportY } = viewportDragStartRef.current
      const dx = e.clientX - x
      const dy = e.clientY - y
      setViewport({
        x: viewportX + dx,
        y: viewportY + dy,
      })
      return
    }

    if (selectionRect) {
      const canvasPoint = screenToCanvas(e.clientX, e.clientY)
      setSelectionRect((prev) => prev ? { ...prev, endX: canvasPoint.x, endY: canvasPoint.y } : null)
      return
    }

    if (multiSelectDragStartRef.current) {
      const { x: startX, y: startY, shapePositions } = multiSelectDragStartRef.current
      const dx = (e.clientX - startX) / viewport.zoom
      const dy = (e.clientY - startY) / viewport.zoom

      shapePositions.forEach((pos, id) => {
        updateShape(id, { x: pos.x + dx, y: pos.y + dy })
      })
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
        updateShape(id, {
          x: minX + offsetX + relX * scaleX,
          y: minY + offsetY + relY * scaleY,
          width: pos.width * scaleX,
          height: pos.height * scaleY,
        })
      })
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
        // Convert canvas coordinates to screen coordinates for rotation math
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

        // Convert back to canvas coordinates
        const newCanvasCenterX = (newScreenCenterX - viewport.x) / viewport.zoom
        const newCanvasCenterY = (newScreenCenterY - viewport.y) / viewport.zoom

        const shape = useCanvasStore.getState().shapes.find((s) => s.id === id)
        if (!shape) return

        const newRotation = (initialRotations.get(id) || 0) + (angleDelta * 180) / Math.PI

        updateShape(id, {
          rotation: newRotation,
          x: newCanvasCenterX - shape.width / 2,
          y: newCanvasCenterY - shape.height / 2,
        })
      })
      return
    }

    if (resizeStartRef.current) {
      const { startMouseX, startMouseY, startWidth, startHeight, startPosX, startPosY, handle, shapeId } = resizeStartRef.current

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

      updateShape(shapeId, { width: newWidth, height: newHeight, x: newX, y: newY })
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

      updateShape(shapeId, { rotation: newRotation })
    }
  }, [isDragging, viewport, setViewport, screenToCanvas, shapes, selectionRect, updateShape])

  const handleMouseUp = useCallback(() => {
    if (selectionRect) {
      const shapesInRect = getShapesInRect(selectionRect)
      if (shapesInRect.length > 0) {
        setSelectedIds(shapesInRect)
      }
      setSelectionRect(null)
    }

    if (multiSelectDragStartRef.current) {
      saveHistory()
      multiSelectDragStartRef.current = null
    }

    if (multiSelectResizeStartRef.current) {
      multiSelectResizeStartRef.current = null
      saveHistory()
    }

    if (multiSelectRotateStartRef.current) {
      multiSelectRotateStartRef.current = null
      saveHistory()
    }

    if (viewportDragStartRef.current) {
      viewportDragStartRef.current = null
    }
    if (resizeStartRef.current) {
      resizeStartRef.current = null
      saveHistory()
    }
    if (rotateStartRef.current) {
      rotateStartRef.current = null
      saveHistory()
    }
    setIsDragging(false)
  }, [selectionRect, setSelectedIds, saveHistory, setIsDragging])

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
      handle,
      shapeId,
    }
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

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault()

      if (e.metaKey || e.ctrlKey) {
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta))

        const rect = container.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const canvasX = (mouseX - viewport.x) / viewport.zoom
        const canvasY = (mouseY - viewport.y) / viewport.zoom

        setViewport({
          zoom: newZoom,
          x: mouseX - canvasX * newZoom,
          y: mouseY - canvasY * newZoom,
        })
      } else {
        setViewport({
          x: viewport.x - e.deltaX,
          y: viewport.y - e.deltaY,
        })
      }
    }

    container.addEventListener('wheel', wheelHandler, { passive: false })
    return () => container.removeEventListener('wheel', wheelHandler)
  }, [viewport, setViewport])

  useEffect(() => {
    const handleImagesUploaded = (e: CustomEvent<{
      images: Array<{ url: string; width: number; height: number }>
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        useCanvasStore.getState().deleteSelectedShapes()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault()
        useCanvasStore.getState().copySelectedShapes()
        return
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault()
        const newIds = useCanvasStore.getState().pasteShapes()
        if (newIds.length > 0) {
          setSelectedIds(newIds)
        }
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
          border: '1px dashed var(--primary)',
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

              const img = new Image()
              img.src = result.url
              await new Promise<void>((resolve) => {
                img.onload = () => {
                  width = img.naturalWidth
                  height = img.naturalHeight
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

      <SelectionBoxLayer
        shapes={shapes}
        selectedIds={selectedIds}
        viewport={viewport}
        onSingleResizeStart={handleSingleResizeStart}
        onSingleRotateStart={handleSingleRotateStart}
        onMultiResizeStart={handleMultiResizeStart}
        onMultiRotateStart={handleMultiRotateStart}
      />

      <LogoEditorLayer
        shapes={shapes}
        selectedIds={selectedIds}
        viewport={viewport}
      />

      <LogoMaterialPanel />

      {renderSelectionRect()}
    </div>
  )
}

export default Canvas
