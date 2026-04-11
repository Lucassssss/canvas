import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ZoomIn, ZoomOut, Maximize, Download, Crop as CropIcon, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useCanvasStore } from '../store'
import { aiCombinationService } from '@/ai-combination/service'

export const ImagePreviewModal: React.FC = () => {
  const { previewImage, setPreviewImage } = useCanvasStore()
  
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isFitScreen, setIsFitScreen] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const [isCropMode, setIsCropMode] = useState(false)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isUploadingCrop, setIsUploadingCrop] = useState(false)
  const [dimensions, setDimensions] = useState<{w: number, h: number} | null>(null)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (previewImage) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setIsFitScreen(true)
      setIsCropMode(false)
      setDimensions(null)
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
  
  const stopNativeEvents = (e: React.MouseEvent | React.WheelEvent | React.TouchEvent) => {
    e.stopPropagation()
    // Depending on React version, native stopImmediatePropagation helps isolate from window global listeners
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation()
    }
  }

  const getCropDimensions = () => {
    if (!isCropMode || !crop || !crop.width || !crop.height || !imgRef.current) return null;
    const img = imgRef.current;
    if (img.width === 0 || img.height === 0) return null;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    return {
      w: Math.round(crop.width * scaleX),
      h: Math.round(crop.height * scaleY)
    }
  }

  const cropDims = getCropDimensions()

  const handleConfirmCrop = async () => {
    if (completedCrop && completedCrop.width && completedCrop.height && imgRef.current) {
      const image = imgRef.current
      const canvas = document.createElement('canvas')
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      canvas.width = completedCrop.width * scaleX
      canvas.height = completedCrop.height * scaleY
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      )

      canvas.toBlob(async (blob) => {
        if (!blob) return
        
        setIsUploadingCrop(true)
        try {
          const file = new File([blob], `cropped-${Date.now()}.png`, { type: 'image/png' })
          const result = await aiCombinationService.uploadImage(file, 'canvas-uploads')
          if (result.success && result.url) {
            setPreviewImage({ url: result.url })
            setIsCropMode(false)
            setCrop(undefined)
          } else {
            console.error('Upload failed:', result.error)
            alert('上传裁剪图片失败')
          }
        } catch (error) {
          console.error(error)
          alert('上传过程发生错误')
        } finally {
          setIsUploadingCrop(false)
        }
      }, 'image/png')
    } else {
      setIsCropMode(false)
    }
  }

  if (!previewImage) return null

  // Ensure we only portal when document is defined (browser env)
  if (typeof document === 'undefined') return null

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] bg-black/90 flex flex-col backdrop-blur-sm"
      onWheel={handleWheel}
      onMouseMove={(e) => {
        stopNativeEvents(e)
        if (!isCropMode) handleMouseMove(e)
      }}
      onMouseUp={(e) => {
        stopNativeEvents(e)
        if (!isCropMode) handleMouseUp()
      }}
      onMouseLeave={() => {
        if (!isCropMode) handleMouseUp()
      }}
      onMouseDown={stopNativeEvents}
      onTouchStart={stopNativeEvents}
      onTouchMove={stopNativeEvents}
      onTouchEnd={stopNativeEvents}
    >
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent absolute top-0 left-0 right-0 z-10 w-full pointer-events-none">
        <div className="flex gap-2">
          <div className="text-white/80 text-sm pointer-events-auto bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            按 ESC 退出
          </div>
          {dimensions && (
            <div className="text-white/80 text-sm pointer-events-auto bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1">
              <ImageIcon size={14} />
              {dimensions.w} × {dimensions.h}
            </div>
          )}
          {isCropMode && cropDims && (
            <div className="text-blue-300 font-medium text-sm pointer-events-auto bg-blue-900/60 px-3 py-1.5 rounded-full backdrop-blur-md border border-blue-400/30 flex items-center gap-1 shadow-inner shadow-blue-500/20">
              <CropIcon size={14} />
              截取: {cropDims.w} × {cropDims.h}
            </div>
          )}
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
                <CropIcon size={16} /> 裁剪
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-colors ml-2 shadow-lg" title="下载原图">
                <Download size={16} /> 下载
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsCropMode(false)} disabled={isUploadingCrop} className="px-4 py-1.5 text-sm text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50">
                取消裁剪
              </button>
              <button 
                onClick={handleConfirmCrop} 
                disabled={isUploadingCrop}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isUploadingCrop ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {isUploadingCrop ? '处理中...' : '确认裁剪'}
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
          if (!isCropMode) handleMouseDown(e)
        }}
        onWheel={(e) => {
            stopNativeEvents(e)
            handleWheel(e)
        }}
      >
        {isCropMode ? (
          <ReactCrop 
            crop={crop} 
            onChange={(c) => setCrop(c)} 
            onComplete={(c) => setCompletedCrop(c)}
             className="max-h-[85vh] max-w-[90vw]"
          >
            <img
              ref={imgRef}
              src={previewImage.url}
              crossOrigin="anonymous"
              alt="Crop Preview"
              draggable={false}
              onLoad={(e) => {
                const img = e.currentTarget
                setDimensions({ w: img.naturalWidth, h: img.naturalHeight })
              }}
              className="max-h-[85vh] max-w-[90vw] object-contain block"
            />
          </ReactCrop>
        ) : (
          <img
            ref={imgRef}
            src={previewImage.url}
            crossOrigin="anonymous"
            alt="Preview"
            draggable={false}
            onLoad={(e) => {
              const img = e.currentTarget
              setDimensions({ w: img.naturalWidth, h: img.naturalHeight })
            }}
            className="transition-all duration-75 block"
            style={
              isFitScreen 
               ? { maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', transform: `translate(${position.x}px, ${position.y}px)` }
               : { transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: 'center' }
            }
          />
        )}
      </div>
    </div>,
    document.body
  )
}
