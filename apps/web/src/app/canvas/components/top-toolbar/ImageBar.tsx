'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { ImageIcon, Wand2, Download, Crop, ImagePlus, Eraser, Zap, Palette, Loader2, Sparkles } from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'


export const ImageBar: React.FC<{ shape: ShapeProps }> = ({ shape }) => {
  const { updateShape } = useCanvasStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const handleDownload = useCallback(async () => {
    if (!shape.imageUrl) return
    try {
      const response = await fetch(shape.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = shape.imageName || 'image.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Failed to download image:', e)
    }
  }, [shape.imageUrl, shape.imageName])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      if (e.key === 'Tab') {
        e.preventDefault()
        useCanvasStore.getState().updateShape(shape.id, { showConfigPanel: !shape.showConfigPanel })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shape.id, shape.showConfigPanel])

  const handleAction = useCallback((action: string) => {
    setActiveAction(action)
    setIsProcessing(true)
    // Placeholder for real AI processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setActiveAction(null)
      alert(`[UI Mock] "${action}" 完成！后续将接入真实 AI 服务。`)
    }, 1500)
  }, [])

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium pr-2 border-r border-gray-200">
        <ImageIcon size={16} />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            updateShape(shape.id, { showConfigPanel: !shape.showConfigPanel })
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
            shape.showConfigPanel 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
          }`}
          title="展开/收起图片资源与配置面板 (Tab)"
        >
          <Wand2 size={14} className={shape.showConfigPanel ? 'text-blue-600' : 'text-blue-500'} />
          快速编辑 <span className="text-[10px] bg-black/5 px-1.5 py-0.5 rounded font-mono ml-0.5">Tab</span>
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1 text-sm">
        <button 
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors relative" 
          title="智能抠图" 
          onClick={() => handleAction('智能抠图')}
          disabled={isProcessing}
        >
          <Eraser size={14} />
          <span className="text-xs">抠图</span>
          {activeAction === '智能抠图' && <Loader2 size={10} className="animate-spin absolute right-1 bottom-1 text-blue-500" />}
        </button>
        <button 
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors relative" 
          title="高清放大" 
          onClick={() => handleAction('高清放大 (Upscale)')}
          disabled={isProcessing}
        >
          <Zap size={14} />
          <span className="text-xs">高清</span>
          {activeAction === '高清放大 (Upscale)' && <Loader2 size={10} className="animate-spin absolute right-1 bottom-1 text-blue-500" />}
        </button>
        <button 
          className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors relative" 
          title="风格重绘" 
          onClick={() => handleAction('风格重绘')}
          disabled={isProcessing}
        >
          <Palette size={14} />
          <span className="text-xs">风格化</span>
          {activeAction === '风格重绘' && <Loader2 size={10} className="animate-spin absolute right-1 bottom-1 text-blue-500" />}
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="裁剪">
          <Crop size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="替换图片">
          <ImagePlus size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="下载/导出" onClick={handleDownload}>
          <Download size={16} />
        </button>
      </div>
    </div>
  )
}
