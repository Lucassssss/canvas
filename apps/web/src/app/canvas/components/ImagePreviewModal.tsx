import React, { useCallback, useEffect, useRef, useState } from 'react'
import { X, ZoomIn, ZoomOut, Maximize, Download, Crop, Check, Image as ImageIcon } from 'lucide-react'
import { useCanvasStore } from '../store'

export const ImagePreviewModal: React.FC = () => {
  const { previewImage, setPreviewImage } = useCanvasStore()
  
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isFitScreen, setIsFitScreen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const [isCropMode, setIsCropMode] = useState(false)
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 300, height: 300 })
  const [isDraggingCrop, setIsDraggingCrop] = useState(false)
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (previewImage) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsFitScreen(true)
      setIsCropMode(false)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [previewImage])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    
    if (isCropMode) return
    setIsFitScreen(false)
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
    setScale(s => Math.min(Math.max(0.1, s * zoomFactor), 10))
  }, [isCropMode])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isCropMode || e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }, [isCropMode, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || isCropMode) return
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }, [isDragging, dragStart, isCropMode])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDownload = async () => {
    if (!previewImage) return
    try {
      const response = await fetch(previewImage.url)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `exported-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(objectUrl)
    } catch {
      const a = document.createElement('a')
      a.href = previewImage.url
      a.download = `exported-image-${Date.now()}.png`
      a.click()
    }
  }

  const handleFitScreen = () => {
    setIsFitScreen(true)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleRealSize = () => {
    setIsFitScreen(false)
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCropMode) setIsCropMode(false)
        else setPreviewImage(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCropMode, setPreviewImage])
  
  const stopNativeEvents = (e: React.MouseEvent | React.WheelEvent) => {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  if (!previewImage) return null

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/90 flex flex-col backdrop-blur-sm"
      onWheel={handleWheel}
      onMouseMove={(e) => {
        stopNativeEvents(e)
        if (isDraggingCrop) {
          setCropBox(prev => ({
            ...prev,
            x: e.clientX - cropDragStart.x,
            y: e.clientY - cropDragStart.y
          }))
        } else {
          handleMouseMove(e)
        }
      }}
      onMouseUp={(e) => {
        stopNativeEvents(e)
        handleMouseUp()
        setIsDraggingCrop(false)
      }}
      onMouseLeave={handleMouseUp}
      onMouseDown={stopNativeEvents}
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-10 w-full pointer-events-none">
        <div className="text-white/80 text-sm pointer-events-auto bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
          按 ESC 退出
        </div>
        
        <div className="flex gap-2 pointer-events-auto bg-black/40 p-2 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
          {!isCropMode ? (
            <>
              <button onClick={() => { setIsFitScreen(false); setScale(s => s * 0.9) }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors" title="缩小">
                <ZoomOut size={16} /> 缩小
              </button>
              <button onClick={() => { setIsFitScreen(false); setScale(s => s * 1.1) }} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors" title="放大">
                <ZoomIn size={16} /> 放大
              </button>
              
              <div className="w-px h-5 bg-white/20 my-auto mx-1" />
              
              <button onClick={handleFitScreen} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors ${isFitScreen ? 'bg-white/20' : ''}`} title="适应屏幕">
                <Maximize size={16} /> 适应屏幕
              </button>
              <button onClick={handleRealSize} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors ${!isFitScreen && scale === 1 ? 'bg-white/20' : ''}`} title="原尺寸">
                <ImageIcon size={16} /> 原尺寸 (1:1)
              </button>

              <div className="w-px h-5 bg-white/20 my-auto mx-1" />

              <button onClick={() => setIsCropMode(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors" title="进入裁剪模式">
                <Crop size={16} /> 裁剪
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors ml-2 shadow-lg" title="下载原图">
                <Download size={16} /> 下载
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsCropMode(false)} className="px-4 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors">
                取消裁剪
              </button>
              <button onClick={() => { setIsCropMode(false); alert('开发中：应用裁剪区坐标'); }} className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                <Check size={16} /> 确认裁剪
              </button>
            </>
          )}

          <div className="w-px h-5 bg-white/20 my-auto ml-3 mr-1" />
          <button onClick={() => setPreviewImage(null)} className="p-1.5 text-white hover:bg-red-500/20 hover:text-red-400 rounded-full transition-colors flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-move"
        onMouseDown={(e) => {
          stopNativeEvents(e)
          handleMouseDown(e)
        }}
        onWheel={(e) => {
            stopNativeEvents(e)
            handleWheel(e)
        }}
      >
        <img
          ref={imgRef}
          src={previewImage.url}
          alt="Preview"
          draggable={false}
          className={`transition-all duration-75 ${isCropMode ? 'opacity-30' : 'opacity-100'}`}
          style={
            isFitScreen 
             ? { maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', transform: `translate(${position.x}px, ${position.y}px)` }
             : { transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: 'center' }
          }
        />
        
        {isCropMode && (
          <div 
            className="absolute border-2 border-blue-400 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-20 flex items-center justify-center text-blue-300 font-medium"
            style={{
              width: `${cropBox.width}px`,
              height: `${cropBox.height}px`,
              transform: `translate(${cropBox.x}px, ${cropBox.y}px)`
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              setIsDraggingCrop(true)
              setCropDragStart({
                x: e.clientX - cropBox.x,
                y: e.clientY - cropBox.y
              })
            }}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
            挪动裁剪框
          </div>
        )}
      </div>
    </div>
  )
}
