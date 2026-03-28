import React from 'react'
import { User, Shirt, Image, Scan, Copy, ArrowRight } from 'lucide-react'

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
    id: 'fixed-bg-tryon',
    name: '固定面部背景换衣',
    icon: Image,
    inputs: [
      { name: '面部参考', icon: User, image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=133&fit=crop' },
      { name: '背景参考', icon: Image, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=133&fit=crop' },
      { name: '服装图', icon: Shirt, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&h=133&fit=crop' },
    ],
    outputs: [{ 
      name: '结果图', 
      count: 1, 
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=133&fit=crop'] 
    }],
    description: '保持面部和背景不变',
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

const IMAGE_WIDTH = 100
const IMAGE_HEIGHT = 133
const IMAGE_GAP = 4

interface ImageStackProps {
  images: { src: string; label: string }[]
  showLabel: boolean
}

const ImageStack: React.FC<ImageStackProps> = ({ images, showLabel }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const totalImages = images.length

  const getOverlap = () => {
    if (totalImages <= 1) return 0
    if (totalImages === 2) return 50
    if (totalImages === 3) return 60
    if (totalImages === 4) return 70
    return 75
  }

  const overlap = getOverlap()
  const singleWidth = IMAGE_WIDTH - overlap
  const totalWidth = singleWidth + (totalImages - 1) * (IMAGE_WIDTH - overlap) + overlap

  return (
    <div 
      className="relative"
      style={{ 
        height: IMAGE_HEIGHT + (showLabel ? 28 : 0),
        width: totalWidth
      }}
    >
      {images.map((img, idx) => {
        const zIndex = hoveredIndex === idx ? totalImages + 1 : totalImages - idx
        const scale = hoveredIndex === idx ? 1.25 : 1
        const left = idx * (IMAGE_WIDTH - overlap)

        return (
          <div
            key={idx}
            className="absolute cursor-pointer transition-all duration-300"
            style={{
              left,
              top: showLabel ? 28 : 0,
              width: IMAGE_WIDTH,
              height: IMAGE_HEIGHT,
              zIndex,
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full rounded-lg overflow-hidden border-2 border-white shadow-md"
            >
              <img 
                src={img.src} 
                alt={img.label}
                className="w-full h-full object-cover"
              />
            </div>
            
            {showLabel && hoveredIndex === idx && (
              <div 
                className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-neutral-800 text-white text-xs rounded whitespace-nowrap"
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

export const EcommerceMaster: React.FC = () => {
  const handleModeClick = (modeId: string) => {
    console.log('Tryon mode clicked:', modeId)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-medium text-neutral-700">AI换装</h2>
        <p className="text-sm text-neutral-500 mt-1">智能搭配场景与模特，丝滑获得服装套图</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tryonModes.map((mode) => {
          const Icon = mode.icon
          const inputImages = mode.inputs.map(i => ({ src: i.image || '', label: i.name }))
          const outputImages = mode.outputs[0].images?.map((src, i) => ({ 
            src, 
            label: `${mode.outputs[0].name} ${i + 1}` 
          })) || []

          const inputOverlap = inputImages.length > 2 ? 70 : (inputImages.length === 2 ? 50 : 0)
          const outputOverlap = outputImages.length > 2 ? 70 : (outputImages.length === 2 ? 50 : 0)
          
          const inputWidth = inputImages.length === 1 
            ? IMAGE_WIDTH 
            : IMAGE_WIDTH - inputOverlap + (inputImages.length - 1) * (IMAGE_WIDTH - inputOverlap)
          
          const outputWidth = outputImages.length === 1 
            ? IMAGE_WIDTH 
            : IMAGE_WIDTH - outputOverlap + (outputImages.length - 1) * (IMAGE_WIDTH - outputOverlap)

          return (
            <button
              key={mode.id}
              onClick={() => handleModeClick(mode.id)}
              className="group bg-white rounded-xl p-5 border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-neutral-900">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-neutral-800">{mode.name}</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div 
                  className="flex items-center justify-end"
                  style={{ minWidth: inputWidth }}
                >
                  <ImageStack 
                    images={inputImages} 
                    showLabel={true}
                  />
                </div>
                
                <div className="w-8 flex-shrink-0 flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-neutral-400" />
                </div>
                
                <div 
                  className="flex items-center justify-start"
                  style={{ minWidth: outputWidth }}
                >
                  <ImageStack 
                    images={outputImages} 
                    showLabel={true}
                  />
                </div>
              </div>

              <p className="text-xs text-neutral-500 mt-6 pt-3 border-t border-neutral-100">
                {mode.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
