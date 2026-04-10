'use client'

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useCanvasStore } from '../store'
import { ImageConfig } from '../shapes/types'
import { Button } from '@/components/ui/button'
import { ModelSelect } from './ModelSelect'
import { AspectRatioSelect } from './AspectRatioSelect'
import { ResolutionSelect, type Resolution } from './ResolutionSelect'
import { CountSelect, type Count } from './CountSelect'
import { useModels } from '../hooks/useModels'
import { imageGenerationService } from '../services/image-generation'

export type ConfigField = 'model' | 'resolution' | 'aspectRatio' | 'count'
export type ShapeTypeFilter = 'image' | 'custom-combination' | 'ai-combination' | 'detail-image' | 'all'

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
  const { defaultModel, getResolutionsForModel } = useModels()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)

  const shapeTypeFilter = config?.shapeTypeFilter || 'all'

  const selectedShape = shapes.find((s) => {
    if (!selectedIds.includes(s.id)) return false
    if (shapeTypeFilter === 'all') {
      return s.type === 'image' || s.type === 'custom-combination' || s.type === 'ai-combination' || s.type === 'detail-image'
    }
    return s.type === shapeTypeFilter
  })

  const enabledFields = config?.enabledFields || DEFAULT_ENABLED_FIELDS

  const currentModel = selectedShape?.imageConfig?.model || defaultModel
  const availableResolutions = useMemo(() => {
    return getResolutionsForModel(currentModel)
  }, [currentModel, getResolutionsForModel])

  const defaultResolution = availableResolutions[0] || '2K'

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
    model: currentModel,
    resolution: (selectedShape.imageConfig?.resolution as Resolution) || defaultResolution,
    aspectRatio: selectedShape.imageConfig?.aspectRatio || '1:1',
    count: (selectedShape.imageConfig?.count as Count) || 1,
    prompt: selectedShape.imageConfig?.prompt || '',
  }

  const updateConfig = (updates: Partial<ImageGenerationConfig>) => {
    updateShape(selectedShape.id, {
      imageConfig: { ...imageConfig, ...updates },
    })
  }

  const handleModelChange = (model: string) => {
    const newResolutions = getResolutionsForModel(model)
    const currentRes = imageConfig.resolution
    const newResolution = newResolutions.includes(currentRes) 
      ? currentRes 
      : newResolutions[0] || '2K'
    
    updateConfig({ model, resolution: newResolution })
  }

  const handleGenerate = async () => {
    if (!selectedShape || isGenerating) return

    setIsGenerating(true)
    setError(null)

    const isEditMode = !!selectedShape.imageUrl
    console.log(`[FloatingConfigPanel] ${isEditMode ? '编辑' : '新生成'}模式`)

    try {
      // 收集输入图片
      let images: string[] = []
      
      if (selectedShape.type === 'image' || selectedShape.type === 'detail-image') {
        // 单个图片组件：有图片则图生图，无图片则文生图
        if (selectedShape.imageUrl) {
          images = [selectedShape.imageUrl]
        }
      } else if (selectedShape.type === 'custom-combination') {
        // 自定义组合组件：收集 customInputSlots 中的图片
        const customInputSlots = selectedShape.customInputSlots || []
        images = customInputSlots
          .filter(s => s.imageUrl)
          .map(s => s.imageUrl as string)
      } else if (selectedShape.type === 'ai-combination') {
        // AI 组合组件：收集 slotContents 中的图片
        const slotContents = selectedShape.slotContents || {}
        images = Object.values(slotContents)
          .filter((s): s is { imageUrl: string } => !!s?.imageUrl)
          .map(s => s.imageUrl)
      }

      const result = await imageGenerationService.generate({
        combinationTypeId: selectedShape.type,
        images,
        prompt: imageConfig.prompt,
        settings: {
          model: imageConfig.model,
          resolution: imageConfig.resolution,
          aspectRatio: imageConfig.aspectRatio,
        },
      })

      if (result.success && result.images.length > 0) {
        // 根据组件类型更新不同的属性
        if (selectedShape.type === 'custom-combination') {
          // 自定义组合：更新 customOutputSlots
          const currentOutputSlots = selectedShape.customOutputSlots || []
          const updatedOutputSlots = currentOutputSlots.map((slot, index) => ({
            ...slot,
            imageUrl: result.images[index] || result.images[0],
          }))
          
          // 如果生成的图片多于输出槽位，添加新槽位
          if (result.images.length > currentOutputSlots.length) {
            for (let i = currentOutputSlots.length; i < result.images.length; i++) {
              updatedOutputSlots.push({
                id: `${selectedShape.id}-output-${Date.now()}-${i}`,
                label: `输出${i + 1}`,
                imageUrl: result.images[i],
              })
            }
          }
          
          updateShape(selectedShape.id, {
            customOutputSlots: updatedOutputSlots,
            customStatus: 'completed',
          })
        } else {
          // 其他组件：更新 imageUrl
          updateShape(selectedShape.id, {
            imageUrl: result.images[0],
          })
        }
        console.log('[FloatingConfigPanel] 生成成功:', result.images[0])
      } else {
        setError(result.error || '生成失败')
        console.error('[FloatingConfigPanel] 生成失败:', result.error)
      }
    } catch (err) {
      setError(String(err))
      console.error('[FloatingConfigPanel] 生成异常:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const isEditMode = !!selectedShape.imageUrl

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

        {error && (
          <div className="px-3 py-1 text-xs text-red-500 bg-red-50">
            {error}
          </div>
        )}

        <div className="flex items-center gap-2 px-3 pb-3">
          {enabledFields.includes('model') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <ModelSelect
                value={imageConfig.model}
                onChange={handleModelChange}
                className="h-8 text-sm"
              />
            </div>
          )}

          {enabledFields.includes('resolution') && (
            <div onMouseDown={(e) => e.stopPropagation()}>
              <ResolutionSelect
                value={imageConfig.resolution}
                onChange={(v) => updateConfig({ resolution: v })}
                resolutions={availableResolutions}
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

          <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                生成中...
              </>
            ) : (
              `${isEditMode ? '重新生成' : '生成'}${imageConfig.count > 1 ? ` ${imageConfig.count} 张` : ''}`
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
