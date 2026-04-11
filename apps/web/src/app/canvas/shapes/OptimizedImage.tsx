'use client'

import React, { useRef, useEffect, useState, memo, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { useCanvasStore } from '../store'

interface OptimizedImageProps {
  src: string
  width: number
  height: number
  onLoad?: (dimensions: { naturalWidth: number; naturalHeight: number }) => void
  onError?: () => void
  isGenerating?: boolean
}

const imageCache = new Map<string, HTMLImageElement>()

function OptimizedImageComponent({
  src,
  width,
  height,
  onLoad,
  onError,
  isGenerating,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(() => {
    if (!src) return false
    const cached = imageCache.get(src)
    return cached ? cached.complete && cached.naturalWidth > 0 : false
  })
  const [error, setError] = useState(false)
  const loadingRef = useRef(false)
  
  const setPreviewImage = useCanvasStore((state) => state.setPreviewImage)

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (src && loaded) {
      setPreviewImage({ url: src })
    }
  }

  useEffect(() => {
    if (!src) return

    const cachedImage = imageCache.get(src)
    if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
      setLoaded(true)
      setError(false)
      onLoad?.({ naturalWidth: cachedImage.naturalWidth, naturalHeight: cachedImage.naturalHeight })
      return
    }

    if (loadingRef.current) return
    loadingRef.current = true

    const img = new Image()

    img.onload = () => {
      loadingRef.current = false
      if (img.naturalWidth > 0) {
        imageCache.set(src, img)
        setLoaded(true)
        setError(false)
        onLoad?.({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight })
      } else {
        setError(true)
        onError?.()
      }
    }

    img.onerror = () => {
      loadingRef.current = false
      setError(true)
      onError?.()
    }

    img.src = src
  }, [src])

  const imgStyle = useMemo(() => ({
    // objectFit: 'fill' as const,
    objectFit: 'contain' as const,
    imageRendering: 'auto' as const,
    willChange: 'transform' as const,
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
  }), [])

  if (error && !isGenerating) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-1">
        <span className="text-xs">加载失败</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {src && (
        <img
          src={src}
          alt=""
          className={`w-full h-full ${isGenerating ? 'opacity-50 blur-sm' : ''}`}
          style={imgStyle}
          draggable={false}
          onDoubleClick={handleDoubleClick}
        />
      )}

      {!loaded && !error && !isGenerating && src && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}

      {isGenerating && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-slate-50">
          {/* Frosted original image overlay (optional, keeps the previous image slightly visible) */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] z-20" />

          {/* Liquid Mesh Background container */}
          <div className="absolute inset-0 z-10 opacity-70" style={{ filter: 'blur(50px)' }}>
            <div
              className="absolute rounded-full mix-blend-multiply bg-purple-300/80"
              style={{
                top: '-10%', left: '-10%', width: '70%', height: '70%',
                animation: 'liquid-blob 10s infinite alternate ease-in-out'
              }}
            />
            <div
              className="absolute rounded-full mix-blend-multiply bg-pink-300/80"
              style={{
                top: '-10%', right: '-10%', width: '60%', height: '70%',
                animation: 'liquid-blob 12s infinite alternate-reverse ease-in-out',
                animationDelay: '1s'
              }}
            />
            <div
              className="absolute rounded-full mix-blend-multiply bg-blue-300/80"
              style={{
                bottom: '-20%', left: '10%', width: '80%', height: '80%',
                animation: 'liquid-blob 14s infinite alternate ease-in-out',
                animationDelay: '2s'
              }}
            />
            <div
              className="absolute rounded-full mix-blend-multiply bg-cyan-300/80"
              style={{
                bottom: '-10%', right: '-10%', width: '60%', height: '60%',
                animation: 'liquid-blob 11s infinite alternate-reverse ease-in-out',
                animationDelay: '3s'
              }}
            />
          </div>

          {/* Add generating indicator text/spinner */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 drop-shadow-md">
            <Loader2 size={18} className="animate-spin text-gray-700/90" />
            <span className="text-sm text-gray-700/90">生成中</span>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes liquid-blob {
              0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
              33% { transform: translate(15%, -15%) scale(1.1) rotate(10deg); }
              66% { transform: translate(-10%, 15%) scale(0.9) rotate(-5deg); }
              100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
            }
          `}} />
        </div>
      )}
    </div>
  )
}

export const OptimizedImage = memo(OptimizedImageComponent)
