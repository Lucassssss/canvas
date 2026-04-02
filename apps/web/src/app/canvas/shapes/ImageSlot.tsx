'use client'

import React, { useState, useCallback } from 'react'
import { useCanvasStore } from '../store'
import { aiCombinationService } from '@/ai-combination/service'
import { Loader2, Upload, Copy, Download, Trash2, ImageIcon, X } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

export interface ImageSlotProps {
  id: string
  imageUrl?: string
  label?: string
  placeholder?: string
  width?: number
  height?: number
  draggable?: boolean
  droppable?: boolean
  clickable?: boolean
  exportable?: boolean
  clearable?: boolean
  deletable?: boolean
  variant?: 'input' | 'output' | 'standalone'
  onImageChange?: (imageUrl: string, source: 'upload' | 'drop' | 'canvas') => void
  onImageClear?: () => void
  onDelete?: () => void
  onLabelChange?: (label: string) => void
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  id,
  imageUrl,
  label,
  placeholder = '拖入或上传',
  width = 140,
  height = 180,
  draggable = true,
  droppable = true,
  clickable = true,
  exportable = true,
  clearable = true,
  deletable = false,
  variant = 'input',
  onImageChange,
  onImageClear,
  onDelete,
  onLabelChange,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editedLabel, setEditedLabel] = useState(label || '')

  const { dragData, setDragData } = useCanvasStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!droppable) return
    e.preventDefault()
    setIsDragOver(true)
  }, [droppable])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!droppable) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    if (dragData) {
      onImageChange?.(dragData.imageUrl, 'canvas')
      return
    }

    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [droppable, dragData, onImageChange])

  const handleFileUpload = useCallback(async (file: File) => {
    const result = await aiCombinationService.uploadImage(file, 'image-slot')
    if (result.success && result.url) {
      onImageChange?.(result.url, 'upload')
    }
  }, [onImageChange])

  const handleClick = useCallback(() => {
    if (!clickable || imageUrl) return

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) handleFileUpload(file)
    }
    input.click()
  }, [clickable, imageUrl, handleFileUpload])

  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (!draggable || !imageUrl) return

    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('text/plain', id)
    setDragData({ shapeId: id, imageUrl })
  }, [draggable, imageUrl, id, setDragData])

  const handleDragEnd = useCallback(() => {
    setDragData(null)
  }, [setDragData])

  const handleExport = useCallback(async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `image-${id.slice(0, 8)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export image:', error)
    }
  }, [imageUrl, id])

  const handleCopyUrl = useCallback(() => {
    if (imageUrl) {
      navigator.clipboard.writeText(imageUrl)
    }
  }, [imageUrl])

  const handleClear = useCallback(() => {
    setImageLoaded(false)
    setImageError(false)
    onImageClear?.()
  }, [onImageClear])

  const handleLabelSubmit = useCallback(() => {
    setIsEditingLabel(false)
    if (editedLabel !== label) {
      onLabelChange?.(editedLabel)
    }
  }, [editedLabel, label, onLabelChange])

  const borderColorClass = isDragOver
    ? 'border-blue-500 bg-blue-50'
    : 'border-white hover:border-gray-300'

  const variantStyles = {
    input: 'bg-gray-200',
    output: 'bg-gray-100 ring-2 ring-blue-100',
    standalone: 'bg-gray-200',
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`group relative border-3 rounded-lg overflow-hidden shadow-md transition-all cursor-pointer ${borderColorClass} ${variantStyles[variant]}`}
          style={{ width, height }}
          draggable={draggable && !!imageUrl}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {label && (
            <div className="absolute top-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 z-10">
              {isEditingLabel ? (
                <input
                  type="text"
                  value={editedLabel}
                  onChange={(e) => setEditedLabel(e.target.value)}
                  onBlur={handleLabelSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLabelSubmit()
                    if (e.key === 'Escape') {
                      setEditedLabel(label || '')
                      setIsEditingLabel(false)
                    }
                  }}
                  className="w-full bg-transparent border-none outline-none text-white text-xs"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className="cursor-pointer"
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    setIsEditingLabel(true)
                    setEditedLabel(label || '')
                  }}
                >
                  {label}
                </span>
              )}
            </div>
          )}

          {deletable && (
            <button
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow z-20 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
            >
              <X size={10} />
            </button>
          )}

          {imageUrl ? (
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
                src={imageUrl}
                alt={label || 'image'}
                className={`w-full h-full object-contain transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
              {clearable && (
                <button
                  className="absolute bottom-2 right-2 p-1.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all shadow opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <Upload size={24} />
              <span className="text-xs">{placeholder}</span>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {imageUrl && (
          <>
            <ContextMenuItem onClick={handleCopyUrl}>
              <Copy size={14} className="mr-2" />
              复制图片链接
            </ContextMenuItem>
            {exportable && (
              <ContextMenuItem onClick={handleExport}>
                <Download size={14} className="mr-2" />
                导出图片
              </ContextMenuItem>
            )}
            {clearable && (
              <ContextMenuItem onClick={handleClear}>
                <Trash2 size={14} className="mr-2" />
                清除图片
              </ContextMenuItem>
            )}
          </>
        )}
        {clickable && !imageUrl && (
          <ContextMenuItem onClick={handleClick}>
            <Upload size={14} className="mr-2" />
            上传图片
          </ContextMenuItem>
        )}
        {deletable && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive" onClick={() => onDelete?.()}>
              <Trash2 size={14} className="mr-2" />
              删除槽位
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
