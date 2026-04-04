'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Sparkles,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Wand2,
  Gauge,
  Zap,
} from 'lucide-react'
import { useCanvasStore } from '../store'
import { aiCombinationService } from '@/ai-combination/service'
import { detailImageService } from './service'
import type { AspectRatio, Resolution, ModelType, GenerationSpeed, TargetLanguage, DetailImageStep } from './store'

interface DetailImageShapeProps {
  shape: {
    id: string
    type: 'detail-image'
    x: number
    y: number
    width: number
    height: number
    rotation: number
  }
}

const SLOT_WIDTH = 120
const SLOT_HEIGHT = 160
const PADDING = 16
const LABEL_HEIGHT = 20
const COLLAPSED_HEIGHT = 200
const EXPANDED_HEIGHT = 400

const STEPS: { key: DetailImageStep; label: string }[] = [
  { key: 'input', label: '输入' },
  { key: 'analyzing', label: '分析中' },
  { key: 'planning', label: '确认规划' },
  { key: 'generating', label: '生成中' },
  { key: 'done', label: '完成' },
]

const STEP_INDEX: Record<DetailImageStep, number> = {
  input: 0,
  analyzing: 1,
  planning: 2,
  generating: 3,
  done: 4,
}

const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: '1:1', label: '1:1' },
  { value: '3:4 竖版', label: '3:4' },
  { value: '4:3 横版', label: '4:3' },
  { value: '9:16 竖版', label: '9:16' },
  { value: '16:9 横版', label: '16:9' },
]

const RESOLUTION_OPTIONS: { value: Resolution; label: string }[] = [
  { value: '1K 标准', label: '1K' },
  { value: '2K 高清', label: '2K' },
  { value: '4K 超清', label: '4K' },
]

const SPEED_OPTIONS: { value: GenerationSpeed; label: string; icon: React.ReactNode }[] = [
  { value: 'standard', label: '标准', icon: <Gauge size={12} /> },
  { value: 'fast', label: '快速', icon: <Zap size={12} /> },
  { value: 'ultra', label: '极速', icon: <Sparkles size={12} /> },
]

interface ProductImageSlotProps {
  imageUrl?: string | null
  onFileSelect: (file: File) => void
  onClear: () => void
  isUploading: boolean
}

const ProductImageSlot: React.FC<ProductImageSlotProps> = ({
  imageUrl,
  onFileSelect,
  onClear,
  isUploading,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    if (!imageUrl && !isUploading) {
      inputRef.current?.click()
    }
  }

  return (
    <div
      className={`relative bg-neutral-100 border-2 rounded-lg overflow-hidden transition-all cursor-pointer ${
        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-neutral-200 hover:border-neutral-300'
      } ${imageUrl ? '' : 'border-dashed'}`}
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
      />

      {isUploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <Loader2 size={20} className="animate-spin text-neutral-400" />
        </div>
      ) : imageUrl ? (
        <div className="relative w-full h-full">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
              <Loader2 size={20} className="animate-spin text-neutral-400" />
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-200 text-neutral-400 gap-1">
              <ImageIcon size={20} />
              <span className="text-xs">加载失败</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt="产品图"
            className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
          <button
            className="absolute top-1.5 right-1.5 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onClear()
            }}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-400">
          <Upload size={20} />
          <span className="text-xs">上传产品图</span>
        </div>
      )}
    </div>
  )
}

interface GeneratedPreviewProps {
  imageUrl: string
}

const GeneratedPreview: React.FC<GeneratedPreviewProps> = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div
      className="relative bg-neutral-100 border-2 border-neutral-200 rounded-lg overflow-hidden"
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
          <Loader2 size={20} className="animate-spin text-neutral-400" />
        </div>
      )}
      <img
        src={imageUrl}
        alt="生成结果"
        className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  )
}

const StepIndicator: React.FC<{ currentStep: DetailImageStep }> = ({ currentStep }) => {
  const currentIndex = STEP_INDEX[currentStep]

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex
        return (
          <React.Fragment key={step.key}>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold transition-all ${
                isDone
                  ? 'bg-black text-white'
                  : isActive
                  ? 'bg-black text-white'
                  : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {isDone ? <Check size={10} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-4 transition-all ${
                  i < currentIndex ? 'bg-black' : 'bg-neutral-200'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export const DetailImageShape: React.FC<DetailImageShapeProps> = ({ shape }) => {
  const { updateShape } = useCanvasStore()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isUploading, setIsUploading] = useState(false)

  const [step, setStep] = useState<DetailImageStep>('input')
  const [productImages, setProductImages] = useState<string[]>([])
  const [requirementText, setRequirementText] = useState('')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4 竖版')
  const [resolution, setResolution] = useState<Resolution>('2K 高清')
  const [generationSpeed, setGenerationSpeed] = useState<GenerationSpeed>('standard')
  const [generationCount, setGenerationCount] = useState(1)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const totalHeight = isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT

  useEffect(() => {
    if (shape.width < 300 || shape.height < 200) {
      updateShape(shape.id, {
        width: Math.max(shape.width, 400),
        height: Math.max(shape.height, COLLAPSED_HEIGHT),
      })
    }
  }, [shape.id, shape.width, shape.height, updateShape])

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (productImages.length >= 6) return

      setIsUploading(true)
      const result = await aiCombinationService.uploadImage(file, 'detail-images')
      setIsUploading(false)

      if (result.success && result.url) {
        setProductImages((prev) => [...prev, result.url!])
      } else {
        const localUrl = URL.createObjectURL(file)
        setProductImages((prev) => [...prev, localUrl])
      }
    },
    [productImages.length]
  )

  const handleClearImage = useCallback((index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleStartGenerating = useCallback(async () => {
    if (productImages.length === 0) return

    setStep('analyzing')
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStep('planning')
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setStep('generating')
    setIsGenerating(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockImages = Array.from({ length: generationCount }, (_, i) => ({
      url: `https://picsum.photos/seed/detail${Date.now() + i}/768/1024`,
    }))

    setGeneratedImages(mockImages.map((m) => m.url))
    setStep('done')
    setIsGenerating(false)
  }, [productImages.length, generationCount])

  const handleReset = useCallback(() => {
    setStep('input')
    setProductImages([])
    setRequirementText('')
    setGeneratedImages([])
    setIsGenerating(false)
  }, [])

  const handleAddToCanvas = useCallback(() => {
    generatedImages.forEach((url, i) => {
      useCanvasStore.getState().addShape({
        type: 'image',
        x: shape.x + shape.width + 20 + (i % 2) * 220,
        y: shape.y + Math.floor(i / 2) * 220,
        width: 200,
        height: 200,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        imageUrl: url,
      })
    })
  }, [generatedImages, shape.x, shape.y, shape.width])

  const renderContent = () => {
    if (step === 'done') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-800">生成完成</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              新建项目
            </button>
          </div>

          <div className="flex-1 flex items-center gap-3 overflow-x-auto pb-2">
            {generatedImages.map((url, i) => (
              <GeneratedPreview key={i} imageUrl={url} />
            ))}
          </div>

          <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-200">
            <button
              onClick={handleAddToCanvas}
              className="flex-1 py-2 px-3 bg-black text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={12} />
              添加到画布
            </button>
            <button
              onClick={handleReset}
              className="py-2 px-3 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
              重新生成
            </button>
          </div>
        </div>
      )
    }

    if (step === 'generating') {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-black animate-spin">
            <Loader2 size={32} className="animate-spin text-neutral-400" />
          </div>
          <div className="text-sm font-medium text-neutral-800">AI 正在生成中...</div>
          <div className="text-xs text-neutral-400">请稍候，这将需要几秒钟</div>
          <div className="w-48 h-1 bg-neutral-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-black rounded-full transition-all duration-1000"
              style={{ width: '60%' }}
            />
          </div>
        </div>
      )
    }

    if (step === 'planning' || step === 'analyzing') {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <Loader2 size={24} className="animate-spin text-neutral-400" />
          <div className="text-sm font-medium text-neutral-800">
            {step === 'analyzing' ? 'AI 正在分析产品...' : '确认规划中...'}
          </div>
          <div className="text-xs text-neutral-400">
            {step === 'analyzing' ? '识别产品特征和设计要素' : '生成设计方案'}
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={14} className="text-neutral-500" />
            <span className="text-xs font-medium text-neutral-700">产品图片</span>
            <span className="text-xs text-neutral-400">({productImages.length}/6)</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {productImages.map((url, i) => (
              <ProductImageSlot
                key={i}
                imageUrl={url}
                onFileSelect={handleFileSelect}
                onClear={() => handleClearImage(i)}
                isUploading={false}
              />
            ))}
            {productImages.length < 6 && (
              <ProductImageSlot
                imageUrl={null}
                onFileSelect={handleFileSelect}
                onClear={() => {}}
                isUploading={isUploading}
              />
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Wand2 size={14} className="text-neutral-500" />
            <span className="text-xs font-medium text-neutral-700">生成设置</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-neutral-500">尺寸</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
              >
                {ASPECT_RATIO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-neutral-500">清晰度</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full px-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-400"
              >
                {RESOLUTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[10px] text-neutral-500 mb-1.5 block">生成数量</label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setGenerationCount(n)}
                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                  generationCount === n
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-[10px] text-neutral-500 mb-1.5 block">生图速度</label>
          <div className="flex gap-1.5">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGenerationSpeed(opt.value)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  generationSpeed === opt.value
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 mb-3">
          <label className="text-[10px] text-neutral-500 mb-1.5 block">需求描述</label>
          <textarea
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            placeholder="描述产品信息和期望的详情图风格..."
            className="w-full h-16 px-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg resize-none focus:outline-none focus:border-neutral-400"
          />
        </div>

        <button
          onClick={handleStartGenerating}
          disabled={productImages.length === 0}
          className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
            productImages.length === 0
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-neutral-800'
          }`}
        >
          <Sparkles size={14} />
          开始生成详情图
        </button>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full bg-white rounded-xl border-2 border-neutral-200 shadow-lg overflow-hidden flex flex-col"
      style={{ width: shape.width, height: totalHeight }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 bg-neutral-50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center">
            <Wand2 size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-neutral-800">详情图生成</span>
          <StepIndicator currentStep={step} />
        </div>
        <button className="p-1 hover:bg-neutral-200 rounded transition-colors">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex-1 p-4 overflow-y-auto">
          {renderContent()}
        </div>
      )}
    </div>
  )
}
