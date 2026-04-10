'use client'

import React, { useRef, useEffect, useState, memo, useMemo } from 'react'
import { Loader2 } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  width: number
  height: number
  onLoad?: () => void
  onError?: () => void
}

const imageCache = new Map<string, HTMLImageElement>()

function OptimizedImageComponent({
  src,
  width,
  height,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(() => {
    if (!src) return false
    const cached = imageCache.get(src)
    return cached ? cached.complete && cached.naturalWidth > 0 : false
  })
  const [error, setError] = useState(false)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!src) return

    const cachedImage = imageCache.get(src)
    if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
      setLoaded(true)
      setError(false)
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
        onLoad?.()
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

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-1">
        <span className="text-xs">加载失败</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={src}
        alt=""
        className="w-full h-full"
        style={imgStyle}
        draggable={false}
      />
    </div>
  )
}

export const OptimizedImage = memo(OptimizedImageComponent)
