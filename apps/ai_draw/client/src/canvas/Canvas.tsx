import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useCanvasStore } from './store'
import { Shape } from './shapes/Shape'
import { ToolType, ShapeProps, SHAPE_MIN_SIZE } from './shapes/types'

const placementTools: ToolType[] = ['text', 'note', 'image', 'shape', 'arrow', 'pen']

interface SelectionBoxProps {
  shape: ShapeProps
  viewport: { x: number; y: number; zoom: number }
  onResizeStart: (e: React.MouseEvent, handle: string, shapeId: string) => void
  onRotateStart: (e: React.MouseEvent, corner: string, shapeId: string) => void
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
  onResizeStart: (e: React.MouseEvent, handle: string, shapeId: string) => void
  onRotateStart: (e: React.MouseEvent, corner: string, shapeId: string) => void
}> = ({ shapes, selectedIds, viewport, onResizeStart, onRotateStart }) => {
  const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))

  if (selectedShapes.length === 0) return null

  if (selectedShapes.length === 1) {
    const shape = selectedShapes[0]
    return (
      <SelectionBox
        key={shape.id}
        shape={shape}
        viewport={viewport}
        onResizeStart={onResizeStart}
        onRotateStart={onRotateStart}
      />
    )
  }

  const minX = Math.min(...selectedShapes.map((s) => s.x))
  const minY = Math.min(...selectedShapes.map((s) => s.y))
  const maxX = Math.max(...selectedShapes.map((s) => s.x + s.width))
  const maxY = Math.max(...selectedShapes.map((s) => s.y + s.height))

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
        outline: '1px solid var(--primary)',
        background: 'rgba(37, 99, 235, 0.05)',
      }}
    />
  )
}

const SelectionBox: React.FC<SelectionBoxProps> = ({ shape, viewport, onResizeStart, onRotateStart }) => {
  const screenX = shape.x * viewport.zoom + viewport.x
  const screenY = shape.y * viewport.zoom + viewport.y
  const screenWidth = shape.width * viewport.zoom
  const screenHeight = shape.height * viewport.zoom

  const handleSize = 8
  const rotateHandleSize = 24
  const rotateHandleOffset = 32

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: screenX,
        top: screenY,
        width: screenWidth,
        height: screenHeight,
        transform: `rotate(${shape.rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ outline: '1px solid var(--primary)' }}
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
  const showCrosshair = placementTools.includes(activeTool)

  const viewportDragStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null)
  const resizeStartRef = useRef<{ startMouseX: number; startMouseY: number; startWidth: number; startHeight: number; startPosX: number; startPosY: number; handle: string; shapeId: string } | null>(null)
  const rotateStartRef = useRef<{ x: number; y: number; startAngle: number; initialRotation: number; centerX: number; centerY: number; shapeId: string } | null>(null)
  const multiSelectDragStartRef = useRef<{ x: number; y: number; shapePositions: Map<string, { x: number; y: number }> } | null>(null)

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
  }, [effectiveTool, viewport, screenToCanvas, shapes, selectedIds, addToSelection, setSelectedIds, clearSelection, setIsDragging])

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

    if (resizeStartRef.current) {
      const { startMouseX, startMouseY, startWidth, startHeight, startPosX, startPosY, handle, shapeId } = resizeStartRef.current

      const shape = shapes.find((s) => s.id === shapeId)
      if (!shape) return

      const minSize = SHAPE_MIN_SIZE[shape.type]
      const minWidth = minSize.minWidth
      const minHeight = minSize.minHeight

      let dx = e.clientX - startMouseX
      let dy = e.clientY - startMouseY

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

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string, shapeId: string) => {
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

  const handleRotateStart = useCallback((e: React.MouseEvent, _corner: string, shapeId: string) => {
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const wheelHandler = (e: WheelEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault()
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
        onResizeStart={handleResizeStart}
        onRotateStart={handleRotateStart}
      />

      {renderSelectionRect()}
    </div>
  )
}
