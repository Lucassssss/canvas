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
  'https://d-assets-cn.joii.cc/ai-generated/e0fff5b8-b243-4cf1-97ab-ae6d0b988160.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/3944e695-e53b-4d84-842c-909f55b2aca7.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/0c6ec393-4569-4378-b38c-5b6c9b0649d7.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/715c8ad3-e596-4c45-980b-752aa9a0008a.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/d9a9ea2b-cf1c-4593-a6ee-77f078dfb9c5.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/bc6ad51b-833c-4f80-9d54-83a3188dc569.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/2d452cc6-6f20-4253-8a71-8bdce71f806b.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/95c050ff-dc6f-4dae-bc4f-a8e3d18824b2.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/dcc2a007-0672-4369-a887-7d22c8cdcbfe.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/25ba2f9f-c4f5-4399-a250-479c726a971b.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/d2efa344-be2a-4dd3-9085-2f3cfa5062ce.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/e5fccb7b-6406-4f44-8868-2a941138ed09.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/30d91813-85b1-432d-b2d8-a816b8d85864.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/353492d9-ef86-46a8-8e59-a9a9aac90c0c.png?fmt=webp&w=800',
  'https://d-assets-cn.joii.cc/ai-generated/0212900c-e7d5-4d30-a774-eefaf93d6ae0.png?fmt=webp&w=1200',
  'https://d-assets-cn.joii.cc/ai-generated/5f3928d3-b977-41d2-9227-518c19779386.png?fmt=webp&w=1200',
  'https://d-assets-cn.joii.cc/ai-generated/31172e47-0d0f-4f95-9f3a-9e937d8e0923.png?fmt=webp&w=1200',
  'https://d-assets-cn.joii.cc/ai-generated/52bdc0f0-2448-437d-b03b-75222ce0169a.png?fmt=webp&w=800',
]

const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80', 'h-44', 'h-52', 'h-68', 'h-60', 'h-96']

const titles = [
  '欧美跨境外模 针织衫测款', '淘宝平铺白底转街拍', '小红书氛围感 辣妹风换模', '亚马逊主图 细节无损超分',
  'Shein爆款风格 连衣长裙', '高级纯净棚拍 外套展示', '韩系东大门 穿搭种草', '多模特色彩批量换装',
]

const authors = [
  '跨境大卖电商团队', '淘系女装TOP店', '种草视觉工作室', 'Amazon视觉优化师', '独立站出海买手',
  '杭州光影实创', '首尔风尚', '广州极速测款团队',
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
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-sans-zh text-sm font-medium text-neutral-700">电商换装案例库</h2>
              <p className="font-sans-zh text-xs text-neutral-400 mt-1">探索 500+ 出海与内销头部的爆款换装模版，一键即刻测款</p>
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="group cursor-pointer break-inside-avoid mb-4"
              >
                <div className="relative bg-neutral-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto block transition-opacity duration-200 group-hover:opacity-90"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 pt-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-sans-zh text-xs font-medium text-white line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        <p className="font-sans-zh text-[10px] text-neutral-300 truncate mb-2">
                          by {item.author}
                        </p>
                      </div>
                      <button className="shrink-0 px-2 py-1 bg-white/20 hover:bg-white text-white hover:text-neutral-900 rounded text-[10px] font-medium backdrop-blur-sm transition-colors mt-0.5">
                        一键同款
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-white/70 mt-1">
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
              <div className="flex items-center gap-2 text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-sans-zh text-xs">加载更多...</span>
              </div>
            )}
            {!hasMore && items.length > 0 && (
              <span className="font-sans-zh text-xs text-neutral-400">已加载全部 {items.length} 个灵感作品</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
