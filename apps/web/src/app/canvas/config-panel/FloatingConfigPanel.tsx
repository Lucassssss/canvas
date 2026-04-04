'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useCanvasStore } from '../store'
import { ImageConfig } from '../shapes/types'
import { Button } from '@/components/ui/button'
import { ModelSelect } from './ModelSelect'
import { AspectRatioSelect } from './AspectRatioSelect'
import { ResolutionSelect, type Resolution } from './ResolutionSelect'
import { CountSelect, type Count } from './CountSelect'

export type ConfigField = 'model' | 'resolution' | 'aspectRatio' | 'count'
export type ShapeTypeFilter = 'image' | 'custom-combination' | 'all'

export interface ConfigPanelConfig {
  enabledFields?: ConfigField[]
  shapeTypeFilter?: ShapeTypeFilter
}

export interface ImageGenerationConfig {
  model: string
  resolution: Resolution
  aspectRatio: string
  count: Count
  prompt: string
}

const PANEL_WIDTH = 560
const PANEL_OFFSET_Y = 12

function getRotatedBoundingBox(
  x: number,
  y: number,
  width: number,
  height: number,
  rotation: number
): { minX: number; minY: number; maxX: number; maxY: number } {
  if (rotation === 0) {
    return { minX: x, minY: y, maxX: x + width, maxY: y + height }
  }

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

interface FloatingConfigPanelProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  config?: ConfigPanelConfig
}

const DEFAULT_ENABLED_FIELDS: ConfigField[] = ['model', 'resolution', 'aspectRatio', 'count']

export const FloatingConfigPanel: React.FC<FloatingConfigPanelProps> = ({ containerRef, config }) => {
  const { shapes, selectedIds, viewport, updateShape } = useCanvasStore()
  const panelRef = useRef<HTMLDivElement>(null)

  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)

  const shapeTypeFilter = config?.shapeTypeFilter || 'all'

  const selectedShape = shapes.find((s) => {
    if (!selectedIds.includes(s.id)) return false
    if (shapeTypeFilter === 'all') return s.type === 'image' || s.type === 'custom-combination'
    return s.type === shapeTypeFilter
  })

  const enabledFields = config?.enabledFields || DEFAULT_ENABLED_FIELDS

  const calculatePosition = useCallback(() => {
    if (!selectedShape || !containerRef.current) {
      setPosition(null)
      return
    }

    const containerRect = containerRef.current.getBoundingClientRect()
    const bounds = getRotatedBoundingBox(
      selectedShape.x,
      selectedShape.y,
      selectedShape.width,
      selectedShape.height,
      selectedShape.rotation
    )

    const screenX = bounds.minX * viewport.zoom + viewport.x
    const screenY = bounds.maxY * viewport.zoom + viewport.y

    let left = screenX + (bounds.maxX - bounds.minX) * viewport.zoom / 2 - PANEL_WIDTH / 2
    let top = screenY + PANEL_OFFSET_Y

    if (left + PANEL_WIDTH > containerRect.right - 16) {
      left = containerRect.right - PANEL_WIDTH - 16
    }
    if (left < containerRect.left + 16) {
      left = containerRect.left + 16
    }
    if (top + 120 > containerRect.bottom - 16) {
      top = screenY - 120 - PANEL_OFFSET_Y
    }
    if (top < containerRect.top + 16) {
      top = containerRect.top + 16
    }

    setPosition({ left, top })
  }, [selectedShape, viewport, containerRef])

  useEffect(() => {
    calculatePosition()
  }, [calculatePosition])

  useEffect(() => {
    const handleResize = () => calculatePosition()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculatePosition])

  const handlePanelMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  if (!selectedShape || !position) {
    return null
  }

  const imageConfig: ImageGenerationConfig = {
    model: selectedShape.imageConfig?.model || 'gemini-3-pro-image-preview',
    resolution: (selectedShape.imageConfig?.resolution as Resolution) || '2K',
    aspectRatio: selectedShape.imageConfig?.aspectRatio || '1:1',
    count: (selectedShape.imageConfig?.count as Count) || 1,
    prompt: selectedShape.imageConfig?.prompt || '',
  }

  const updateConfig = (updates: Partial<ImageGenerationConfig>) => {
    updateShape(selectedShape.id, {
      imageConfig: { ...imageConfig, ...updates },
    })
  }

  const handleGenerate = () => {
    console.log('=== 图片生成配置 ===')
    console.log('model:', imageConfig.model)
    console.log('resolution:', imageConfig.resolution)
    console.log('aspectRatio:', imageConfig.aspectRatio)
    console.log('count:', imageConfig.count)
    console.log('prompt:', imageConfig.prompt)
    console.log('=================')
  }

  return (
    <div
      ref={panelRef}
      className="fixed z-[999] rounded-lg border border-gray-200 bg-white shadow-lg"
      style={{
        left: position.left,
        top: position.top,
        width: PANEL_WIDTH,
      }}
      onMouseDown={handlePanelMouseDown}
    >
      <div className="flex flex-col">
        <textarea
          className="min-h-20 resize-none py-3 px-3.5 text-sm outline-none"
          placeholder="输入提示词..."
          value={imageConfig.prompt}
          onChange={(e) => updateConfig({ prompt: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
        />

        <div className="flex items-center gap-2 px-3 pb-3">
          {enabledFields.includes('model') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <ModelSelect
                value={imageConfig.model}
                onChange={(v) => updateConfig({ model: v })}
                className="h-8 text-sm"
              />
            </div>
          )}

          {enabledFields.includes('resolution') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <ResolutionSelect
                value={imageConfig.resolution}
                onChange={(v) => updateConfig({ resolution: v })}
                className="h-8 text-sm"
              />
            </div>
          )}

          {enabledFields.includes('aspectRatio') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <AspectRatioSelect
                value={imageConfig.aspectRatio}
                onChange={(v) => updateConfig({ aspectRatio: v })}
                className="h-8 text-sm"
              />
            </div>
          )}

          {enabledFields.includes('count') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <CountSelect
                value={imageConfig.count}
                onChange={(v) => updateConfig({ count: v })}
                className="h-8 text-sm"
              />
            </div>
          )}

          <div className="flex-1" />

          <Button size="sm" onClick={handleGenerate}>
            生成{imageConfig.count > 1 ? ` ${imageConfig.count} 张` : ''}
          </Button>
        </div>
      </div>
    </div>
  )
}
