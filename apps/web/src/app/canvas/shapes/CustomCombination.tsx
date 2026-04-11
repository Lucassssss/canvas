'use client'

import React, { useCallback, useState, useRef, useEffect, memo } from 'react'
import { useCanvasStore } from '../store'
import { aiCombinationService } from '@/ai-combination/service'
import { imageGenerationService } from '../services/image-generation'
import { Plus, Loader2, Play, Equal, Image as ImageIcon } from 'lucide-react'
import { OptimizedImage } from './OptimizedImage'
import { startMatrixDrag } from '../utils/dragOut'
import { DIMENSIONS } from '../constants/dimensions'
import type { ShapeProps, CustomCombinationSlot } from './types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface CustomCombinationProps {
  shape: ShapeProps
}

const SLOT_WIDTH = DIMENSIONS.SLOT.width
const SLOT_HEIGHT = DIMENSIONS.SLOT.height
const SLOT_GAP = DIMENSIONS.COMBINATION.GAP
const PADDING = DIMENSIONS.COMBINATION.PADDING
const BUTTON_WIDTH = 48
const EQUAL_WIDTH = 20
const PLUS_WIDTH = 16
const LABEL_HEIGHT = 20

interface InputSlotRendererProps {
  slot: CustomCombinationSlot
  combinationShapeId: string
  onFileSelect: (slotId: string, file: File | string) => void
  onClear: (slotId: string) => void
  onDelete: (slotId: string) => void
  onLabelChange: (slotId: string, label: string) => void
  canDelete: boolean
}

const InputSlotRenderer = memo<InputSlotRendererProps>(({
  slot,
  combinationShapeId,
  onFileSelect,
  onClear,
  onDelete,
  onLabelChange,
  canDelete,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState(slot.label)

  useEffect(() => {
    if (slot.imageUrl) {
      setImageLoaded(false)
      setImageError(false)
    }
  }, [slot.imageUrl])

  const handleLabelSubmit = useCallback(() => {
    setIsEditingLabel(false)
    if (editedLabel !== slot.label) {
      onLabelChange(slot.id, editedLabel)
    }
  }, [editedLabel, slot.id, slot.label, onLabelChange])

  const handleClick = useCallback(() => {
    if (!slot.imageUrl) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) onFileSelect(slot.id, file)
      }
      input.click()
    }
  }, [slot.imageUrl, slot.id, onFileSelect])

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(slot.id)
  }, [slot.id, onDelete])

  const handleClearClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImageLoaded(false)
    setImageError(false)
    onClear(slot.id)
  }, [slot.id, onClear])

  const handleDoubleClick = useCallback(() => {
    setIsEditingLabel(true)
    setEditedLabel(slot.label)
  }, [slot.label])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLabelSubmit()
    if (e.key === 'Escape') {
      setEditedLabel(slot.label)
      setIsEditingLabel(false)
    }
  }, [handleLabelSubmit, slot.label])

  return (
    <div className="flex flex-col items-center" style={{ gap: 4 }}>
      <div className="flex items-center text-xs text-gray-500" style={{ gap: 4 }}>
        <ImageIcon size={14} />
        {isEditingLabel ? (
          <input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={handleKeyDown}
            className="w-20 bg-transparent border-b border-gray-300 outline-none text-xs"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:text-gray-700"
            onDoubleClick={handleDoubleClick}
          >
            {slot.label}
          </span>
        )}
      </div>
      <div
        data-slot-id={slot.id}
        data-combination-shape-id={combinationShapeId}
        className="group relative bg-gray-200 border-3 border-white overflow-hidden shadow-md transition-all duration-150 cursor-pointer drop-slot"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
        onClick={handleClick}
      >
        {canDelete && (
          <button
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow z-20 opacity-0 group-hover:opacity-100"
            onClick={handleDelete}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {slot.imageUrl ? (
          <div className="relative w-full h-full">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-400 gap-1">
                <ImageIcon size={20} />
                <span className="text-xs">加载失败</span>
              </div>
            )}
            <img
              src={slot.imageUrl}
              alt={slot.label}
              className={`w-full h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            <button
              className="absolute bottom-2 right-2 p-1.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all shadow opacity-0 group-hover:opacity-100"
              onClick={handleClearClick}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            <span className="text-xs">拖入或上传</span>
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.slot.id === nextProps.slot.id &&
    prevProps.slot.imageUrl === nextProps.slot.imageUrl &&
    prevProps.slot.label === nextProps.slot.label &&
    prevProps.combinationShapeId === nextProps.combinationShapeId &&
    prevProps.canDelete === nextProps.canDelete &&
    prevProps.onFileSelect === nextProps.onFileSelect &&
    prevProps.onClear === nextProps.onClear &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onLabelChange === nextProps.onLabelChange
  )
})

interface OutputSlotRendererProps {
  slot: CustomCombinationSlot
  onLabelChange: (slotId: string, label: string) => void
  isGenerating: boolean
}

const OutputSlotRenderer = memo<OutputSlotRendererProps>(({ slot, onLabelChange, isGenerating }) => {
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState(slot.label)

  const handleLabelSubmit = useCallback(() => {
    setIsEditingLabel(false)
    if (editedLabel !== slot.label) {
      onLabelChange(slot.id, editedLabel)
    }
  }, [editedLabel, slot.id, slot.label, onLabelChange])

  const handleDoubleClick = useCallback(() => {
    setIsEditingLabel(true)
    setEditedLabel(slot.label)
  }, [slot.label])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLabelSubmit()
    if (e.key === 'Escape') {
      setEditedLabel(slot.label)
      setIsEditingLabel(false)
    }
  }, [handleLabelSubmit, slot.label])

  return (
    <div className="flex flex-col items-center" style={{ gap: 4 }}>
      <div className="flex items-center text-xs text-gray-500" style={{ gap: 4 }}>
        <ImageIcon size={14} />
        {isEditingLabel ? (
          <input
            type="text"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
            onBlur={handleLabelSubmit}
            onKeyDown={handleKeyDown}
            className="w-20 bg-transparent border-b border-gray-300 outline-none text-xs"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:text-gray-700"
            onDoubleClick={handleDoubleClick}
          >
            {slot.label}
          </span>
        )}
      </div>
      <div
        className="relative bg-gray-200 border-3 border-white overflow-hidden shadow-md"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
      >
        {(!slot.imageUrl && !isGenerating) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-0">
            <ImageIcon size={24} />
          </div>
        )}
        {(slot.imageUrl || isGenerating) && (
          <div 
            className={`absolute inset-0 z-10 ${slot.imageUrl ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onMouseDown={(e) => {
              if (slot.imageUrl) {
                e.stopPropagation()
                startMatrixDrag(e, slot.imageUrl)
              }
            }}
          >
            <div className="w-full h-full pointer-events-none">
              <OptimizedImage
                src={slot.imageUrl || ''}
                width={SLOT_WIDTH}
                height={SLOT_HEIGHT}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.slot.id === nextProps.slot.id &&
    prevProps.slot.imageUrl === nextProps.slot.imageUrl &&
    prevProps.slot.label === nextProps.slot.label &&
    prevProps.onLabelChange === nextProps.onLabelChange &&
    prevProps.isGenerating === nextProps.isGenerating
  )
})

export const CustomCombination: React.FC<CustomCombinationProps> = ({ shape }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const updateShape = useCanvasStore((state) => state.updateShape)

  const inputSlots = shape.customInputSlots || [{ id: `${shape.id}-input-1`, label: '输入1', imageUrl: undefined }]
  const outputSlots = shape.customOutputSlots || [{ id: `${shape.id}-output-1`, label: '输出', imageUrl: undefined }]
  const status = shape.customStatus || 'idle'

  const inputCount = inputSlots.length
  const outputCount = outputSlots.length

  const totalInputWidth = inputCount * SLOT_WIDTH + Math.max(0, inputCount - 1) * SLOT_GAP
  const totalOutputWidth = outputCount * SLOT_WIDTH + Math.max(0, outputCount - 1) * SLOT_GAP

  const inputPlusIconsWidth = Math.max(0, inputCount - 1) * (PLUS_WIDTH + SLOT_GAP * 2)
  const addButtonWidth = SLOT_GAP + 32
  const totalWidth = totalInputWidth + inputPlusIconsWidth + addButtonWidth + totalOutputWidth + BUTTON_WIDTH + EQUAL_WIDTH + PADDING * 2 + SLOT_GAP * 3
  const totalHeight = SLOT_HEIGHT + LABEL_HEIGHT + PADDING * 2

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null

    const updateDimensions = () => {
      rafId = null
      const rect = container.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) {
        if (Math.abs(rect.width - shape.width) > 1 || Math.abs(rect.height - shape.height) > 1) {
          updateShape(shape.id, { width: rect.width, height: rect.height })
        }
      }
    }

    const ro = new ResizeObserver(() => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateDimensions)
      }
    })
    ro.observe(container)

    requestAnimationFrame(updateDimensions)

    return () => {
      ro.disconnect()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [shape.id, shape.width, shape.height, updateShape])

  const shapeIdRef = useRef(shape.id)
  shapeIdRef.current = shape.id

  const handleFileSelect = useCallback(async (slotId: string, fileOrUrl: File | string) => {
    let imageUrl: string | undefined

    if (typeof fileOrUrl === 'string') {
      imageUrl = fileOrUrl
    } else {
      const result = await aiCombinationService.uploadImage(fileOrUrl, 'canvas-uploads')
      if (result.success && result.url) {
        imageUrl = result.url
      }
    }

    if (imageUrl) {
      const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
      const currentSlots = currentShape?.customInputSlots || []
      const newSlots = currentSlots.map(s =>
        s.id === slotId ? { ...s, imageUrl } : s
      )
      useCanvasStore.getState().updateShape(shapeIdRef.current, { customInputSlots: newSlots })
    }
  }, [])

  const handleClear = useCallback((slotId: string) => {
    const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
    const currentSlots = currentShape?.customInputSlots || []
    const newSlots = currentSlots.map(s =>
      s.id === slotId ? { ...s, imageUrl: undefined } : s
    )
    useCanvasStore.getState().updateShape(shapeIdRef.current, { customInputSlots: newSlots })
  }, [])

  const handleAddSlot = useCallback(() => {
    const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
    const currentSlots = currentShape?.customInputSlots || []
    const newSlot: CustomCombinationSlot = {
      id: `${shapeIdRef.current}-input-${Date.now()}`,
      label: `输入${currentSlots.length + 1}`,
      imageUrl: undefined,
    }
    useCanvasStore.getState().updateShape(shapeIdRef.current, {
      customInputSlots: [...currentSlots, newSlot],
    })
  }, [])

  const handleRemoveSlot = useCallback((slotId: string) => {
    const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
    const currentSlots = currentShape?.customInputSlots || []
    if (currentSlots.length <= 1) return
    const newSlots = currentSlots.filter(s => s.id !== slotId)
    useCanvasStore.getState().updateShape(shapeIdRef.current, { customInputSlots: newSlots })
  }, [])

  const handleLabelChange = useCallback((slotId: string, label: string, isInput: boolean) => {
    const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
    const slots = isInput 
      ? (currentShape?.customInputSlots || [])
      : (currentShape?.customOutputSlots || [])
    const key = isInput ? 'customInputSlots' : 'customOutputSlots'
    const newSlots = slots.map(s =>
      s.id === slotId ? { ...s, label } : s
    )
    useCanvasStore.getState().updateShape(shapeIdRef.current, { [key]: newSlots })
  }, [])

  const handleGenerate = useCallback(async () => {
    const currentShape = useCanvasStore.getState().shapes.find(s => s.id === shapeIdRef.current)
    const currentInputSlots = currentShape?.customInputSlots || []
    const currentOutputSlots = currentShape?.customOutputSlots || []
    const imageConfig = currentShape?.imageConfig
    
    // 验证输入
    const inputImages = currentInputSlots
      .filter(s => s.imageUrl)
      .map(s => s.imageUrl as string)
    
    if (inputImages.length === 0) {
      useCanvasStore.getState().updateShape(shapeIdRef.current, {
        customStatus: 'error',
        customError: '请上传至少一张输入图片',
      })
      return
    }

    // 验证提示词
    const prompt = imageConfig?.prompt || ''
    if (!prompt.trim()) {
      useCanvasStore.getState().updateShape(shapeIdRef.current, {
        customStatus: 'error',
        customError: '请输入提示词',
      })
      return
    }

    // 开始生成
    useCanvasStore.getState().updateShape(shapeIdRef.current, {
      isGenerating: true,
      customStatus: 'generating',
      customError: undefined,
    })

    try {
      const result = await imageGenerationService.generate({
        combinationTypeId: 'custom',
        images: inputImages,
        prompt,
        settings: {
          model: imageConfig?.model || 'openrouter-gemini-2-5-flash',
          resolution: imageConfig?.resolution || '2K',
          aspectRatio: imageConfig?.aspectRatio || '1:1',
        },
      })

      if (result.success && result.images.length > 0) {
        // 更新输出槽位
        const updatedOutputSlots = currentOutputSlots.map((slot, index) => ({
          ...slot,
          imageUrl: result.images[index] || result.images[0],
        }))

        // 如果生成的图片多于输出槽位，添加新槽位
        if (result.images.length > currentOutputSlots.length) {
          for (let i = currentOutputSlots.length; i < result.images.length; i++) {
            updatedOutputSlots.push({
              id: `${shapeIdRef.current}-output-${Date.now()}-${i}`,
              label: `输出${i + 1}`,
              imageUrl: result.images[i],
            })
          }
        }

        useCanvasStore.getState().updateShape(shapeIdRef.current, {
          isGenerating: false,
          customStatus: 'completed',
          customOutputSlots: updatedOutputSlots,
        })
      } else {
        useCanvasStore.getState().updateShape(shapeIdRef.current, {
          isGenerating: false,
          customStatus: 'error',
          customError: result.error || '生成失败',
        })
      }
    } catch (error) {
      console.error('[CustomCombination] 生成异常:', error)
      useCanvasStore.getState().updateShape(shapeIdRef.current, {
        isGenerating: false,
        customStatus: 'error',
        customError: error instanceof Error ? error.message : '生成失败',
      })
    }
  }, [])

  const handleInputLabelChange = useCallback((id: string, label: string) => {
    handleLabelChange(id, label, true)
  }, [handleLabelChange])

  const handleOutputLabelChange = useCallback((id: string, label: string) => {
    handleLabelChange(id, label, false)
  }, [handleLabelChange])

  return (
    <div
      ref={containerRef}
      className="border-2 border-dashed border-gray-200"
      style={{ width: totalWidth }}
    >
      <div className="p-3 pb-4 flex justify-center">
        <div className="inline-flex items-center" style={{ gap: SLOT_GAP }}>
          {inputSlots.map((slot, index) => (
            <React.Fragment key={slot.id}>
              {index > 0 && (
                <Plus size={16} className="text-gray-400 flex-shrink-0" />
              )}
              <InputSlotRenderer
                slot={slot}
                combinationShapeId={shape.id}
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                onDelete={handleRemoveSlot}
                onLabelChange={handleInputLabelChange}
                canDelete={inputSlots.length > 1}
              />
            </React.Fragment>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                onClick={handleAddSlot}
              >
                <Plus size={18} className="text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>添加输入槽</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center" style={{ gap: SLOT_GAP }}>
            <button
              className={`
                flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
                ${status === 'generating'
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'}
              `}
              onClick={handleGenerate}
              disabled={status === 'generating'}
            >
              <Play size={22} />
            </button>
            <Equal size={16} className="text-gray-400" />
          </div>

          {outputSlots.map((slot) => (
            <OutputSlotRenderer
              key={slot.id}
              slot={slot}
              onLabelChange={handleOutputLabelChange}
              isGenerating={status === 'generating'}
            />
          ))}
        </div>

        {shape.customError && (
          <div className="mt-2 text-xs text-red-500 text-center">
            {shape.customError}
          </div>
        )}
      </div>
    </div>
  )
}
