'use client'

import React, { useCallback, useState } from 'react'
import { ImageIcon, Wand2, Download, Crop, ImagePlus, Eraser, Zap, Palette, Loader2, Sparkles } from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export const ImageBar: React.FC<{ shape: ShapeProps }> = ({ shape }) => {
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
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium transition-colors ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title="展开图片的高级重绘和编辑面板"
            >
              <Wand2 size={14} className="text-blue-500" />
              快速编辑
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 rounded-xl shadow-lg border border-gray-200" sideOffset={12}>
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-500" />
                AI 图像处理
              </div>
              
              <button 
                onClick={() => handleAction('智能抠图')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Eraser size={15} />
                  <span>智能抠图</span>
                </div>
                {activeAction === '智能抠图' && <Loader2 size={14} className="animate-spin" />}
              </button>

              <button 
                onClick={() => handleAction('高清放大 (Upscale)')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Zap size={15} />
                  <span>高清放大</span>
                </div>
                {activeAction === '高清放大 (Upscale)' && <Loader2 size={14} className="animate-spin" />}
              </button>

              <button 
                onClick={() => handleAction('风格重绘')}
                disabled={isProcessing}
                className="w-full flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Palette size={15} />
                  <span>风格重绘</span>
                </div>
                {activeAction === '风格重绘' && <Loader2 size={14} className="animate-spin" />}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1 text-sm">
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
