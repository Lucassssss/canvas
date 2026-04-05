'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useCanvasStore } from '../store'
import { combinationRegistry } from '@/ai-combination/registry'
import { aiCombinationService } from '@/ai-combination/service'
import { Upload, Play, X, Loader2, User, Shirt, Image as ImageIcon, Plus, Equal, Trash2 } from 'lucide-react'
import type { SlotDefinition, SlotContent } from '@/ai-combination/types'

interface AICombinationComponentProps {
  shape: {
    id: string
    type: 'ai-combination'
    x: number
    y: number
    width: number
    height: number
    combinationTypeId?: string
    slotContents?: Record<string, SlotContent>
    imageConfig?: {
      model: string
      resolution: '1K' | '2K' | '4K'
      aspectRatio: string
      count: number
      prompt: string
    }
    combinationStatus?: 'idle' | 'generating' | 'completed' | 'error'
    combinationResults?: string[]
    combinationError?: string
  }
}

const SLOT_WIDTH = 140
const SLOT_HEIGHT = 180
const SLOT_GAP = 12
const PADDING = 12
const BUTTON_WIDTH = 48
const EQUAL_WIDTH = 20
const PLUS_WIDTH = 16
const LABEL_HEIGHT = 20

const SLOT_ICONS: Record<string, React.ReactNode> = {
  model: <User size={14} />,
  clothing: <Shirt size={14} />,
  face: <User size={14} />,
  background: <ImageIcon size={14} />,
  pose: <User size={14} />,
  source: <ImageIcon size={14} />,
}

interface ImageSlotRendererProps {
  slot: SlotDefinition
  content: SlotContent
  onFileSelect: (slotId: string, fileOrUrl: File | string, source?: 'upload' | 'canvas') => void
  onClear: (slotId: string) => void
  isDragOver: boolean
  onDragEnter: () => void
  onDragLeave: () => void
}

const ImageSlotRenderer: React.FC<ImageSlotRendererProps> = ({
  slot,
  content,
  onFileSelect,
  onClear,
  isDragOver,
  onDragEnter,
  onDragLeave,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (slot.acceptDrop !== false) {
      onDragEnter()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragLeave()

    const dragData = useCanvasStore.getState().dragData
    if (dragData) {
      onFileSelect(slot.id, dragData.imageUrl, 'canvas')
      return
    }

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      onFileSelect(slot.id, files[0])
    }
  }

  return (
    <div
      className={`group relative bg-gray-200 border-3 overflow-hidden shadow-md transition-colors cursor-pointer ${
        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-white hover:border-white'
      }`}
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!content.imageUrl) {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) onFileSelect(slot.id, file)
          }
          input.click()
        }
      }}
    >
      {content.imageUrl ? (
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
            src={content.imageUrl}
            alt={slot.name}
            className={`w-full h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <button
            className="absolute top-2 right-2 p-1.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all shadow opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              setImageLoaded(false)
              setImageError(false)
              onClear(slot.id)
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
          <Upload size={24} />
          <span className="text-xs">{slot.placeholder || '拖入或上传'}</span>
        </div>
      )}
    </div>
  )
}

interface TextSlotRendererProps {
  slot: SlotDefinition
  content: SlotContent
  onTextChange: (slotId: string, text: string) => void
  onClear: (slotId: string) => void
}

const TextSlotRenderer: React.FC<TextSlotRendererProps> = ({
  slot,
  content,
  onTextChange,
  onClear,
}) => {
  const [isEditing, setIsEditing] = useState(!content.text)
  const textValue = content.text || slot.defaultValue || ''

  return (
    <div
      className="relative bg-white border-3 border-white rounded-lg overflow-hidden shadow-md hover:border-gray-300 transition-colors shadow"
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
    >
      {isEditing ? (
        <textarea
          className="w-full h-full p-2 resize-none text-sm"
          placeholder={slot.placeholder || '输入文本...'}
          value={textValue}
          onChange={(e) => onTextChange(slot.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div
          className="w-full h-full p-2 text-sm cursor-pointer overflow-auto"
          onClick={() => setIsEditing(true)}
        >
          {textValue || <span className="text-gray-400">{slot.placeholder || '点击编辑'}</span>}
        </div>
      )}
      {textValue && !isEditing && (
        <button
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow"
          onClick={(e) => {
            e.stopPropagation()
            onClear(slot.id)
          }}
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}

interface OutputSlotContentProps {
  slot: SlotDefinition
  resultImage?: string | null
}

const OutputSlotContent: React.FC<OutputSlotContentProps> = ({ slot, resultImage }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  return (
    <div
      className="relative bg-gray-200 border-3 border-white overflow-hidden shadow-md"
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
    >
      {resultImage ? (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          )}
          <img
            src={resultImage}
            alt={slot.name}
            className={`w-full h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ImageIcon size={24} />
        </div>
      )}
    </div>
  )
}

export const AICombinationComponent: React.FC<AICombinationComponentProps> = ({ shape }) => {
  const [isDragOver, setIsDragOver] = useState<string | null>(null)
  const { updateShape } = useCanvasStore()

  const combinationType = combinationRegistry.get(shape.combinationTypeId || 'simple-tryon')

  const inputSlots = combinationType?.slots.filter((slot) => slot.role === 'input') || []
  const outputSlots = combinationType?.slots.filter((slot) => slot.role === 'output') || []

  const inputCount = inputSlots.length
  const outputCount = outputSlots.length

  const totalInputWidth = inputCount * SLOT_WIDTH + Math.max(0, inputCount - 1) * SLOT_GAP
  const totalOutputWidth = outputCount * SLOT_WIDTH + Math.max(0, outputCount - 1) * SLOT_GAP

  const inputPlusIconsWidth = Math.max(0, inputCount - 1) * (PLUS_WIDTH + SLOT_GAP * 2)
  const outputPlusIconsWidth = 0
  const totalWidth = totalInputWidth + inputPlusIconsWidth + totalOutputWidth + outputPlusIconsWidth + BUTTON_WIDTH + EQUAL_WIDTH + PADDING * 2 + SLOT_GAP * 3
  const totalHeight = SLOT_HEIGHT + LABEL_HEIGHT + PADDING * 2

  useEffect(() => {
    if (combinationType && (shape.width !== totalWidth || shape.height !== totalHeight)) {
      updateShape(shape.id, { width: totalWidth, height: totalHeight })
    }
  }, [combinationType, shape.id, shape.width, shape.height, totalWidth, totalHeight, updateShape])

  const handleFileSelect = useCallback((
    slotId: string,
    fileOrUrl: File | string,
    source: 'upload' | 'canvas' = 'upload'
  ) => {
    const processImage = async (imageUrl: string) => {
      const newSlotContents: Record<string, SlotContent> = {
        ...shape.slotContents,
        [slotId]: { imageUrl, source },
      }
      updateShape(shape.id, { slotContents: newSlotContents })
    }

    if (source === 'canvas' && typeof fileOrUrl === 'string') {
      processImage(fileOrUrl)
    } else if (source === 'upload' && typeof fileOrUrl !== 'string') {
      const uploadImage = async () => {
        const result = await aiCombinationService.uploadImage(fileOrUrl, 'canvas-uploads')
        const imageUrl = result.success && result.url ? result.url : null
        if (imageUrl) {
          processImage(imageUrl)
        }
      }
      uploadImage()
    }
  }, [shape.id, shape.slotContents, updateShape])

  const handleTextChange = useCallback((slotId: string, text: string) => {
    const newSlotContents: Record<string, SlotContent> = {
      ...shape.slotContents,
      [slotId]: { text, source: 'text' },
    }
    updateShape(shape.id, { slotContents: newSlotContents })
  }, [shape.id, shape.slotContents, updateShape])

  const handleExecute = useCallback(async () => {
    if (shape.combinationStatus === 'generating') return

    updateShape(shape.id, { combinationStatus: 'generating', combinationError: undefined })

    const resolutionMap: Record<string, { width: number; height: number }> = {
      '1K': { width: 1024, height: 1024 },
      '2K': { width: 2048, height: 2048 },
      '4K': { width: 4096, height: 4096 },
    }

    const settings = {
      prompt: shape.imageConfig?.prompt || '',
      resolution: resolutionMap[shape.imageConfig?.resolution || '2K'] || { width: 2048, height: 2048 },
    }

    const result = await aiCombinationService.generate({
      id: shape.id,
      combinationTypeId: shape.combinationTypeId || 'simple-tryon',
      slotContents: shape.slotContents || {},
      settings,
    })

    if (result.success && result.imageUrl) {
      updateShape(shape.id, {
        combinationStatus: 'completed',
        combinationResults: [result.imageUrl],
      })
    } else {
      updateShape(shape.id, {
        combinationStatus: 'error',
        combinationError: result.error,
      })
    }
  }, [shape, updateShape])

  const clearSlot = useCallback((slotId: string) => {
    if (!combinationType) return
    const slot = combinationType.slots.find((s) => s.id === slotId)
    const newSlotContents: Record<string, SlotContent> = {
      ...shape.slotContents,
      [slotId]: slot?.type === 'text'
        ? { text: null, source: 'none' }
        : { imageUrl: null, source: 'none' },
    }
    updateShape(shape.id, { slotContents: newSlotContents })
  }, [shape.id, shape.slotContents, updateShape, combinationType])

  if (!combinationType) {
    return (
      <div className="w-full h-full inline-flex items-center justify-center p-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center text-gray-400">
          <Loader2 size={24} className="animate-spin mx-auto mb-2" />
          <span className="text-xs">加载中...</span>
        </div>
      </div>
    )
  }

  const renderInputSlot = (slot: SlotDefinition) => {
    const content = shape.slotContents?.[slot.id] || { source: 'none' as const }
    const slotIcon = SLOT_ICONS[slot.id] || <ImageIcon size={14} />

    return (
      <div key={slot.id} className="flex flex-col items-center" style={{ gap: 4 }}>
        <div className="flex items-center text-xs text-gray-500" style={{ gap: 4 }}>
          {slotIcon}
          <span>{slot.name}</span>
        </div>
        {slot.type === 'image' ? (
          <ImageSlotRenderer
            slot={slot}
            content={content}
            onFileSelect={handleFileSelect}
            onClear={clearSlot}
            isDragOver={isDragOver === slot.id}
            onDragEnter={() => setIsDragOver(slot.id)}
            onDragLeave={() => setIsDragOver(null)}
          />
        ) : (
          <TextSlotRenderer
            slot={slot}
            content={content}
            onTextChange={handleTextChange}
            onClear={clearSlot}
          />
        )}
      </div>
    )
  }

  const renderOutputSlot = (slot: SlotDefinition, index: number) => {
    const slotIcon = SLOT_ICONS[slot.id] || <ImageIcon size={14} />
    const resultImage = shape.combinationResults?.[index] || null

    return (
      <div key={slot.id} className="flex flex-col items-center" style={{ gap: 4 }}>
        <div className="flex items-center text-xs text-gray-500" style={{ gap: 4 }}>
          {slotIcon}
          <span>{slot.name}</span>
        </div>
        <OutputSlotContent slot={slot} resultImage={resultImage} />
      </div>
    )
  }

  return (
    <div className="w-full h-full inline-flex items-center justify-center p-3" style={{ gap: SLOT_GAP }}>
      {inputSlots.map((slot, index) => (
        <React.Fragment key={slot.id}>
          {index > 0 && (
            <Plus size={16} className="text-gray-400 flex-shrink-0" />
          )}
          {renderInputSlot(slot)}
        </React.Fragment>
      ))}

      {inputSlots.length > 0 && (
        <div className="flex items-center" style={{ gap: SLOT_GAP }}>
          <button
            className={`
              flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
              ${shape.combinationStatus === 'generating'
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'}
            `}
            onClick={handleExecute}
            disabled={shape.combinationStatus === 'generating'}
          >
            {shape.combinationStatus === 'generating' ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Play size={22} />
            )}
          </button>
          <Equal size={16} className="text-gray-400" />
        </div>
      )}

      {outputSlots.map((slot, index) => (
        <React.Fragment key={slot.id}>
          {renderOutputSlot(slot, index)}
        </React.Fragment>
      ))}

      {shape.combinationStatus === 'error' && shape.combinationError && (
        <div className="absolute -bottom-8 left-0 right-0 p-2 text-gray-600 text-xs bg-gray-50 rounded">
          {shape.combinationError}
        </div>
      )}
    </div>
  )
}
