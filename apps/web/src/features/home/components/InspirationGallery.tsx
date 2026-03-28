'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Heart, Eye, Loader2 } from 'lucide-react'

interface InspirationItem {
  id: string
  title: string
  imageUrl: string
  author: string
  likes: number
  views: number
  height?: string
}

const imageUrls = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=350&fit=crop',
  'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&h=550&fit=crop',
  'https://images.unsplash.com/photo-1561998338-13ad7883b20f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=450&fit=crop',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=320&fit=crop',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=480&fit=crop',
]

const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80', 'h-44', 'h-52', 'h-68', 'h-60', 'h-96']

const titles = [
  '极简风格 logo 设计', '科技感插画', '品牌形象视觉', '抽象艺术海报',
  '产品包装设计', 'UI 界面设计', '创意字体排版', '3D 渲染场景',
]

const authors = [
  '设计师 A', '创作者 B', '艺术家 C', '画师 D', '品牌 E',
  '产品 F', '字体 G', '3D H',
]

const generateItems = (count: number, startIndex: number = 0): InspirationItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i
    return {
      id: `inspiration-${index}`,
      title: titles[index % titles.length],
      imageUrl: imageUrls[index % imageUrls.length],
      author: authors[index % authors.length],
      likes: Math.floor(Math.random() * 1000) + 100,
      views: Math.floor(Math.random() * 5000) + 500,
      height: heights[Math.floor(Math.random() * heights.length)],
    }
  })
}

export function InspirationGallery() {
  const [items, setItems] = useState<InspirationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadMoreItems = () => {
    if (loading || !hasMore) return

    setLoading(true)
    setTimeout(() => {
      const currentLength = items.length
      const remaining = 50 - currentLength
      const toLoad = Math.min(12, remaining)

      if (toLoad <= 0) {
        setHasMore(false)
        setLoading(false)
        return
      }

      const newItems = generateItems(toLoad, currentLength)
      setItems([...items, ...newItems])
      setLoading(false)

      if (currentLength + toLoad >= 50) {
        setHasMore(false)
      }
    }, 500)
  }

  useEffect(() => {
    loadMoreItems()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreItems()
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, items.length])

  const handleItemClick = (itemId: string) => {
    console.log('View inspiration:', itemId)
  }

  const handleLike = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    console.log('Like inspiration:', itemId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-medium text-neutral-700">灵感发现</h2>
          <p className="text-sm text-neutral-500 mt-1">探索更多优秀设计作品</p>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="group cursor-pointer break-inside-avoid mb-4"
          >
            <div className={`relative ${item.height || 'h-56'} rounded-lg overflow-hidden bg-neutral-200`}>
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-sm font-medium text-white truncate mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-300 truncate mb-2">
                  by {item.author}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/80">
                  <button
                    onClick={(e) => handleLike(e, item.id)}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-3 h-3" />
                    {item.likes}
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={loaderRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-neutral-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">加载更多...</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <span className="text-sm text-neutral-400">已加载全部 {items.length} 个灵感作品</span>
        )}
      </div>
    </div>
  )
}
