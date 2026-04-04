'use client'

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useCanvasStore } from '../store'
import { aiCombinationService } from '@/ai-combination/service'
import { Plus, Loader2, Play, Equal, Image as ImageIcon } from 'lucide-react'
import type { ShapeProps, CustomCombinationSlot } from './types'

interface CustomCombinationProps {
  shape: ShapeProps
}

const SLOT_WIDTH = 140
const SLOT_HEIGHT = 180
const SLOT_GAP = 12
const PADDING = 12
const BUTTON_WIDTH = 48
const EQUAL_WIDTH = 20
const PLUS_WIDTH = 16
const LABEL_HEIGHT = 20

interface InputSlotRendererProps {
  slot: CustomCombinationSlot
  onFileSelect: (slotId: string, file: File) => void
  onClear: (slotId: string) => void
  onDelete: (slotId: string) => void
  onLabelChange: (slotId: string, label: string) => void
  canDelete: boolean
  isDragOver: boolean
  onDragEnter: () => void
  onDragLeave: () => void
}

const InputSlotRenderer: React.FC<InputSlotRendererProps> = ({
  slot,
  onFileSelect,
  onClear,
  onDelete,
  onLabelChange,
  canDelete,
  isDragOver,
  onDragEnter,
  onDragLeave,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState(slot.label)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    onDragEnter()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDragLeave()

    const dragData = useCanvasStore.getState().dragData
    if (dragData) {
      onFileSelect(slot.id, dragData.imageUrl as unknown as File)
      return
    }

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      onFileSelect(slot.id, files[0])
    }
  }

  const handleLabelSubmit = () => {
    setIsEditingLabel(false)
    if (editedLabel !== slot.label) {
      onLabelChange(slot.id, editedLabel)
    }
  }

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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLabelSubmit()
              if (e.key === 'Escape') {
                setEditedLabel(slot.label)
                setIsEditingLabel(false)
              }
            }}
            className="w-20 bg-transparent border-b border-gray-300 outline-none text-xs"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:text-gray-700"
            onDoubleClick={() => {
              setIsEditingLabel(true)
              setEditedLabel(slot.label)
            }}
          >
            {slot.label}
          </span>
        )}
      </div>
      <div
        className={`group relative bg-gray-200 border-3 overflow-hidden shadow-md transition-colors cursor-pointer ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-white hover:border-white'
        }`}
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
        onDragOver={handleDragOver}
        onDragLeave={onDragLeave}
        onDrop={handleDrop}
        onClick={() => {
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
        }}
      >
        {canDelete && (
          <button
            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow z-20 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(slot.id)
            }}
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
              onClick={(e) => {
                e.stopPropagation()
                setImageLoaded(false)
                setImageError(false)
                onClear(slot.id)
              }}
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
}

interface OutputSlotRendererProps {
  slot: CustomCombinationSlot
  onLabelChange: (slotId: string, label: string) => void
}

const OutputSlotRenderer: React.FC<OutputSlotRendererProps> = ({ slot, onLabelChange }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState(slot.label)

  const handleLabelSubmit = () => {
    setIsEditingLabel(false)
    if (editedLabel !== slot.label) {
      onLabelChange(slot.id, editedLabel)
    }
  }

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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLabelSubmit()
              if (e.key === 'Escape') {
                setEditedLabel(slot.label)
                setIsEditingLabel(false)
              }
            }}
            className="w-20 bg-transparent border-b border-gray-300 outline-none text-xs"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:text-gray-700"
            onDoubleClick={() => {
              setIsEditingLabel(true)
              setEditedLabel(slot.label)
            }}
          >
            {slot.label}
          </span>
        )}
      </div>
      <div
        className="relative bg-gray-200 border-3 border-white overflow-hidden shadow-md"
        style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
      >
        {slot.imageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}
            <img
              src={slot.imageUrl}
              alt={slot.label}
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
    </div>
  )
}

export const CustomCombination: React.FC<CustomCombinationProps> = ({ shape }) => {
  const [isDragOver, setIsDragOver] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { updateShape } = useCanvasStore()

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
      const newSlots = inputSlots.map(s =>
        s.id === slotId ? { ...s, imageUrl } : s
      )
      updateShape(shape.id, { customInputSlots: newSlots })
    }
  }, [shape.id, inputSlots, updateShape])

  const handleClear = useCallback((slotId: string) => {
    const newSlots = inputSlots.map(s =>
      s.id === slotId ? { ...s, imageUrl: undefined } : s
    )
    updateShape(shape.id, { customInputSlots: newSlots })
  }, [shape.id, inputSlots, updateShape])

  const handleAddSlot = useCallback(() => {
    const newSlot: CustomCombinationSlot = {
      id: `${shape.id}-input-${Date.now()}`,
      label: `输入${inputSlots.length + 1}`,
      imageUrl: undefined,
    }
    updateShape(shape.id, {
      customInputSlots: [...inputSlots, newSlot],
    })
  }, [shape.id, inputSlots, updateShape])

  const handleRemoveSlot = useCallback((slotId: string) => {
    if (inputSlots.length <= 1) return
    const newSlots = inputSlots.filter(s => s.id !== slotId)
    updateShape(shape.id, { customInputSlots: newSlots })
  }, [shape.id, inputSlots, updateShape])

  const handleLabelChange = useCallback((slotId: string, label: string, isInput: boolean) => {
    const slots = isInput ? inputSlots : outputSlots
    const key = isInput ? 'customInputSlots' : 'customOutputSlots'
    const newSlots = slots.map(s =>
      s.id === slotId ? { ...s, label } : s
    )
    updateShape(shape.id, { [key]: newSlots })
  }, [shape.id, inputSlots, outputSlots, updateShape])

  const handleGenerate = useCallback(() => {
    updateShape(shape.id, {
      customStatus: 'generating',
      customError: undefined,
    })

    setTimeout(() => {
      const hasAllInputs = inputSlots.every(s => s.imageUrl)
      if (!hasAllInputs) {
        updateShape(shape.id, {
          customStatus: 'error',
          customError: '请上传所有输入图片',
        })
        return
      }

      updateShape(shape.id, {
        customStatus: 'completed',
        customOutputSlots: outputSlots.map(s => ({
          ...s,
          imageUrl: 'https://picsum.photos/seed/output/1024/1024',
        })),
      })
    }, 2000)
  }, [shape.id, inputSlots, outputSlots, updateShape])

  return (
    <div
      ref={containerRef}
      className="border-3 border-dashed border-gray-200"
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
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                onDelete={handleRemoveSlot}
                onLabelChange={(id, label) => handleLabelChange(id, label, true)}
                canDelete={inputSlots.length > 1}
                isDragOver={isDragOver === slot.id}
                onDragEnter={() => setIsDragOver(slot.id)}
                onDragLeave={() => setIsDragOver(null)}
              />
            </React.Fragment>
          ))}

          <button
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={handleAddSlot}
            title="添加输入槽"
          >
            <Plus size={18} className="text-gray-500" />
          </button>

          <div className="flex items-center" style={{ gap: SLOT_GAP }}>
            <button
              className={`
                flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
                ${status === 'generating'
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'}
              `}
              onClick={handleGenerate}
              disabled={status === 'generating'}
            >
              {status === 'generating' ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <Play size={22} />
              )}
            </button>
            <Equal size={16} className="text-gray-400" />
          </div>

          {outputSlots.map((slot) => (
            <OutputSlotRenderer
              key={slot.id}
              slot={slot}
              onLabelChange={(id, label) => handleLabelChange(id, label, false)}
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
