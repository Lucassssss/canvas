'use client'

import React from 'react'
import { User, Shirt, Image, Scan, Copy, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TryonMode {
  id: string
  name: string
  icon: React.ElementType
  inputs: { name: string; icon: React.ElementType; image?: string }[]
  outputs: { name: string; count: number; images?: string[] }[]
  description: string
}

const tryonModes: TryonMode[] = [
  {
    id: 'simple-tryon',
    name: '服装换装',
    icon: Shirt,
    inputs: [
      { name: '服装图', icon: Shirt, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=133&fit=crop' },
      { name: '模特图', icon: User, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=133&fit=crop' },
    ],
    outputs: [{ 
      name: '结果图', 
      count: 1, 
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=133&fit=crop'] 
    }],
    description: '模特图 + 服装图 = 换装结果',
  },
  {
    id: 'fixed-face-tryon',
    name: '固定面部换衣',
    icon: User,
    inputs: [
      { name: '面部参考', icon: User, image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=133&fit=crop' },
      { name: '服装图', icon: Shirt, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=133&fit=crop' },
    ],
    outputs: [{ 
      name: '结果图', 
      count: 1, 
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=133&fit=crop'] 
    }],
    description: '保持面部特征不变',
  },
  {
    id: 'fixed-pose-tryon',
    name: '固定姿势换衣',
    icon: Scan,
    inputs: [
      { name: '面部参考', icon: User, image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=133&fit=crop' },
      { name: '背景参考', icon: Image, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=133&fit=crop' },
      { name: '姿势参考', icon: Scan, image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=133&fit=crop' },
      { name: '服装图', icon: Shirt, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=133&fit=crop' },
    ],
    outputs: [{ 
      name: '结果图', 
      count: 1, 
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=133&fit=crop'] 
    }],
    description: '保持面部、背景和姿势不变',
  },
  {
    id: 'pose-fission',
    name: '姿势裂变',
    icon: Copy,
    inputs: [
      { name: '输入图', icon: Image, image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=133&fit=crop' },
    ],
    outputs: [{ 
      name: '结果图', 
      count: 5, 
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=133&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=133&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=133&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=133&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=133&fit=crop',
      ] 
    }],
    description: '单图输入生成 5 个姿势',
  },
]

const IMAGE_WIDTH = 80
const IMAGE_HEIGHT = 106

interface ImageStackProps {
  images: { src: string; label: string }[]
  showLabel: boolean
  targetWidth?: number
}

function ImageStack({ images, showLabel, targetWidth }: ImageStackProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const totalImages = images.length

  const calculateLayout = () => {
    if (totalImages === 1) {
      return { totalWidth: IMAGE_WIDTH, visibleWidth: 0 }
    }

    if (targetWidth && targetWidth > IMAGE_WIDTH) {
      const visibleWidth = Math.max(
        20,
        Math.min(
          IMAGE_WIDTH * 0.4,
          (targetWidth - IMAGE_WIDTH) / (totalImages - 1)
        )
      )
      const totalWidth = IMAGE_WIDTH + (totalImages - 1) * visibleWidth
      return { totalWidth, visibleWidth }
    }

    const visibleWidth = totalImages <= 2 ? 32 : totalImages <= 3 ? 28 : 24
    const totalWidth = IMAGE_WIDTH + (totalImages - 1) * visibleWidth
    return { totalWidth, visibleWidth }
  }

  const { totalWidth, visibleWidth } = calculateLayout()

  return (
    <div 
      className="relative"
      style={{ 
        height: IMAGE_HEIGHT,
        width: totalWidth,
        minWidth: totalWidth,
      }}
    >
      {images.map((img, idx) => {
        const isHovered = hoveredIndex === idx
        const zIndex = isHovered ? totalImages + 10 : totalImages - idx
        const scale = isHovered ? 1.15 : 1
        const left = idx * visibleWidth

        return (
          <div
            key={idx}
            className="absolute cursor-pointer transition-all duration-200 ease-out"
            style={{
              left,
              top: 0,
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              zIndex,
              transform: `scale(${scale})`,
              transformOrigin: 'left center',
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-lg bg-white"
            >
              <img 
                src={img.src} 
                alt={img.label}
                className="w-full h-full object-cover"
              />
            </div>
            
            {showLabel && isHovered && (
              <div 
                className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-50"
              >
                {img.label}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function EcommerceMaster() {
  const handleModeClick = (modeId: string) => {
    console.log('Tryon mode clicked:', modeId)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-medium text-neutral-700">AI换装</h2>
        <p className="text-sm text-neutral-500 mt-1">智能搭配场景与模特，丝滑获得服装套图</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tryonModes.map((mode) => {
          const Icon = mode.icon
          const inputImages = mode.inputs.map(i => ({ src: i.image || '', label: i.name }))
          const outputImages = mode.outputs[0].images?.map((src, i) => ({ 
            src, 
            label: mode.outputs[0].count > 1 ? `${mode.outputs[0].name} ${i + 1}` : mode.outputs[0].name
          })) || []

          const ARROW_WIDTH = 20
          const CARD_CONTENT_WIDTH = 320
          const availableWidth = CARD_CONTENT_WIDTH - ARROW_WIDTH
          
          const inputTargetWidth = inputImages.length > 1 && outputImages.length === 1 
            ? availableWidth - IMAGE_WIDTH - ARROW_WIDTH 
            : undefined
          
          const outputTargetWidth = outputImages.length > 1 && inputImages.length === 1 
            ? availableWidth - IMAGE_WIDTH - ARROW_WIDTH 
            : undefined

          return (
            <div
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className="group bg-white rounded-xl p-4 border border-neutral-200 hover:border-neutral-400 hover:shadow-lg transition-all duration-200 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-4 justify-between">
                <div className='flex items-center gap-2'>
                  <div className="p-1 rounded-sm border">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium text-neutral-800">{mode.name}</span>
                </div>
                <Button variant="link" size="xs" className="text-sm transition-colors flex items-center gap-1">
                  做同款
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex-shrink-0">
                  <ImageStack 
                    images={inputImages} 
                    showLabel={true}
                    targetWidth={inputTargetWidth}
                  />
                </div>
                
                <div className="flex-shrink-0 px-1">
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </div>
                
                <div className="flex-shrink-0">
                  <ImageStack 
                    images={outputImages} 
                    showLabel={true}
                    targetWidth={outputTargetWidth}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
