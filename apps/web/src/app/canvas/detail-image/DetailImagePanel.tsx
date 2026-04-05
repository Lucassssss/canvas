'use client'

import React, { useRef, useState, useCallback } from 'react'
import {
  Plus,
  X,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Zap,
  Gauge,
} from 'lucide-react'
import {
  useDetailImageStore,
  type AspectRatio,
  type Resolution,
  type ModelType,
  type TargetLanguage,
  type GenerationSpeed,
} from './store'
import { detailImageService } from './service'
import { aiCombinationService } from '@/ai-combination/service'
import { AIWriteModal } from './AIWriteModal'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// ───────────────────────────────────────────────
// 步骤条
// ───────────────────────────────────────────────
const STEPS = ['输入', '分析中', '确认规划', '生成中', '完成'] as const

const StepBar: React.FC = () => {
  const { step } = useDetailImageStore()

  const stepIndex: Record<string, number> = {
    input: 0,
    analyzing: 1,
    planning: 2,
    generating: 3,
    done: 4,
  }

  const current = stepIndex[step] ?? 0

  return (
    <div className="di-step-bar">
      {STEPS.map((label, i) => {
        const isDone = i < current
        const isActive = i === current
        return (
          <React.Fragment key={label}>
            <div className="di-step-item">
              <div
                className={`di-step-circle ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
              >
                {isDone ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span className={`di-step-label ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`di-step-line ${isDone ? 'done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ───────────────────────────────────────────────
// 产品图上传区
// ───────────────────────────────────────────────
const ProductImageUpload: React.FC = () => {
  const { productImages, maxProductImages, addProductImage, removeProductImage } =
    useDetailImageStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (!files.length) return
      setUploading(true)
      for (const file of files) {
        if (productImages.length >= maxProductImages) break
        const result = await aiCombinationService.uploadImage(file, 'detail-images')
        if (result.success && result.url) {
          addProductImage(result.url)
        } else {
          // 使用本地 object URL 作为降级方案
          const url = URL.createObjectURL(file)
          addProductImage(url)
        }
      }
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [productImages.length, maxProductImages, addProductImage]
  )

  return (
    <div className="di-section">
      <div className="di-section-header">
        <div className="flex items-center gap-2">
          <div className="di-section-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
              <path d="M1 9.5l3-3 2.5 2.5 2-2L13 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="di-section-title">产品图</p>
            <p className="di-section-sub">上传清晰的产品图片</p>
          </div>
        </div>
        <span className="di-image-count">
          {productImages.length}/{maxProductImages}
        </span>
      </div>

      <div className="di-image-grid">
        {productImages.map((url, i) => (
          <div key={i} className="di-image-thumb">
            <img src={url} alt={`产品图 ${i + 1}`} />
            <button
              className="di-image-remove"
              onClick={() => removeProductImage(i)}
            >
              <X size={10} />
            </button>
            {i === 0 && <div className="di-image-badge">1</div>}
          </div>
        ))}
        {productImages.length < maxProductImages && (
          <button
            className="di-image-add"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}

// ───────────────────────────────────────────────
// Select 下拉
// ───────────────────────────────────────────────
interface SelectFieldProps<T extends string> {
  label: string
  value: T
  options: T[]
  onChange: (val: T) => void
}

function SelectField<T extends string>({ label, value, options, onChange }: SelectFieldProps<T>) {
  return (
    <div className="di-field">
      <label className="di-label">{label}</label>
      <div className="di-select-wrap">
        <select
          className="di-select"
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="di-select-icon" />
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────
// 详情图表单
// ───────────────────────────────────────────────
const DetailForm: React.FC = () => {
  const {
    requirementText,
    targetLanguage,
    model,
    aspectRatio,
    resolution,
    generationCount,
    generationSpeed,
    aiWriteLoading,
    setRequirementText,
    setTargetLanguage,
    setModel,
    setAspectRatio,
    setResolution,
    setGenerationCount,
    setGenerationSpeed,
    setShowAIWriteModal,
    setAIWriteSuggestions,
    setAIWriteLoading,
    productImages,
  } = useDetailImageStore()

  const handleAIWrite = async () => {
    setAIWriteLoading(true)
    setShowAIWriteModal(true)
    const result = await detailImageService.generateAIWriteSuggestions({
      productImageUrls: productImages,
      initialRequirement: requirementText,
      targetLanguage,
    })
    setAIWriteLoading(false)
    if (result.success && result.suggestions) {
      setAIWriteSuggestions(result.suggestions)
    }
  }

  const speedOptions: { value: GenerationSpeed; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'standard', label: '标准', icon: <Gauge size={14} />, desc: '标准速度，积分消耗最低' },
    { value: 'fast', label: '快速', icon: <Zap size={14} />, desc: '' },
    { value: 'ultra', label: '极速', icon: <Sparkles size={14} />, desc: '' },
  ]

  return (
    <div className="di-section">
      {/* 需求文本 */}
      <div className="mb-3">
        <label className="di-label mb-1.5 block">详情图要求</label>
        <p className="text-xs text-neutral-400 mb-2">描述您的产品信息和期望的详情图风格</p>
        <div className="di-textarea-wrap">
          <textarea
            className="di-textarea"
            value={requirementText}
            onChange={(e) => setRequirementText(e.target.value)}
            placeholder="描述您的产品信息和期望的详情图风格"
            rows={4}
          />
          <button
            className="di-ai-write-btn"
            onClick={handleAIWrite}
            disabled={aiWriteLoading}
          >
            <Sparkles size={12} />
            <span>AI 帮写</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle size={10} className="opacity-50 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>AI将根据您的产品信息帮写详情图要求</p>
              </TooltipContent>
            </Tooltip>
          </button>
        </div>
      </div>

      {/* 目标语言 */}
      <SelectField<TargetLanguage>
        label="目标语言"
        value={targetLanguage}
        options={['无文字（纯视觉）', '中文（简体）', '英文', '日文']}
        onChange={setTargetLanguage}
      />

      {/* 模型 + 尺寸比例 */}
      <div className="di-grid-2">
        <SelectField<ModelType>
          label="模型"
          value={model}
          options={['Nano Banana', 'Nano Banana Pro']}
          onChange={setModel}
        />
        <SelectField<AspectRatio>
          label="尺寸比例"
          value={aspectRatio}
          options={['1:1', '3:4 竖版', '4:3 横版', '9:16 竖版', '16:9 横版']}
          onChange={setAspectRatio}
        />
      </div>

      {/* 清晰度 + 生成数量 */}
      <div className="di-grid-2">
        <SelectField<Resolution>
          label="清晰度"
          value={resolution}
          options={['1K 标准', '2K 高清', '4K 超清']}
          onChange={setResolution}
        />
        <SelectField<string>
          label="生成数量"
          value={String(generationCount)}
          options={['1', '2', '3', '4', '5', '6']}
          onChange={(v) => setGenerationCount(Number(v))}
        />
      </div>

      {/* 生图速度 */}
      <div className="mb-3">
        <label className="di-label mb-2 block">生图速度</label>
        <p className="text-xs text-neutral-400 mb-2">
          {speedOptions.find((s) => s.value === generationSpeed)?.desc || ''}
        </p>
        <div className="di-speed-group">
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              className={`di-speed-btn ${generationSpeed === opt.value ? 'active' : ''}`}
              onClick={() => setGenerationSpeed(opt.value)}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────
// 完成态：结果展示（在左侧面板简单展示信息）
// ───────────────────────────────────────────────
const DonePanel: React.FC = () => {
  const { reset } = useDetailImageStore()
  return (
    <div className="di-section text-center py-6">
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#22c55e" />
          <path d="M7 12l3.5 3.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-neutral-800 mb-1">生成完成</p>
      <p className="text-xs text-neutral-400 mb-4">所有图片已生成完成，请在右侧查看结果</p>
      <button
        className="di-btn-outline text-xs"
        onClick={reset}
      >
        <Plus size={12} />
        新建项目
      </button>
    </div>
  )
}

// ───────────────────────────────────────────────
// 主面板
// ───────────────────────────────────────────────
export const DetailImagePanel: React.FC = () => {
  const {
    step,
    activeTab,
    productImages,
    generationCount,
    generationSpeed,
    requirementText,
    targetLanguage,
    model,
    aspectRatio,
    resolution,
    showAIWriteModal,
    setActiveTab,
    startAnalyzing,
    confirmPlan,
    setStep,
    reset,
  } = useDetailImageStore()

  const canGenerate = productImages.length > 0

  const speedCostMap: Record<string, number> = {
    standard: 5,
    fast: 10,
    ultra: 20,
  }

  const handleGoBack = () => {
    if (step === 'planning') setStep('input')
    else if (step === 'done') reset()
  }

  const renderBottomAction = () => {
    if (step === 'input') {
      return (
        <div className="di-bottom-action">
          <button
            className={`di-btn-primary ${!canGenerate ? 'disabled' : ''}`}
            disabled={!canGenerate}
            onClick={startAnalyzing}
          >
            <Sparkles size={14} />
            分析产品
          </button>
        </div>
      )
    }

    if (step === 'analyzing') {
      return (
        <div className="di-bottom-action">
          <button className="di-btn-primary disabled" disabled>
            <div className="di-spinner" />
            分析中...
          </button>
        </div>
      )
    }

    if (step === 'planning') {
      return (
        <div className="di-bottom-action">
          <button
            className="di-btn-primary"
            onClick={confirmPlan}
          >
            确认生成 {generationCount} 张图片
          </button>
          <p className="di-cost-hint">消耗 {speedCostMap[generationSpeed] * generationCount} 积分</p>
          <button className="di-btn-back" onClick={handleGoBack}>
            <ArrowLeft size={12} />
            返回上一步
          </button>
        </div>
      )
    }

    if (step === 'generating') {
      return (
        <div className="di-bottom-action">
          <button className="di-btn-primary disabled" disabled>
            <div className="di-spinner" />
            生成中...
          </button>
        </div>
      )
    }

    if (step === 'done') {
      return (
        <div className="di-bottom-action">
          <button className="di-btn-primary" onClick={reset}>
            <Plus size={14} />
            新建项目
          </button>
          <button className="di-btn-back" onClick={handleGoBack}>
            <ArrowLeft size={12} />
            返回上一步
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="di-panel">
      {/* 步骤条 */}
      <div className="di-step-bar-wrap">
        <StepBar />
      </div>

      {/* 可滚动内容区 */}
      <div className="di-scroll-area">
        {/* 产品图上传 */}
        <ProductImageUpload />

        {/* Tab 切换：主图 / 详情图 */}
        <div className="di-tab-wrap">
          <div className="di-tab-group">
            <button
              className={`di-tab ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => setActiveTab('main')}
            >
              主图
            </button>
            <button
              className={`di-tab ${activeTab === 'detail' ? 'active' : ''}`}
              onClick={() => setActiveTab('detail')}
            >
              详情图
            </button>
          </div>
        </div>

        {/* 内容区 */}
        {step === 'done' ? (
          <DonePanel />
        ) : (
          <DetailForm />
        )}
      </div>

      {/* 底部操作区 */}
      {renderBottomAction()}

      {/* AI 帮写弹窗 */}
      {showAIWriteModal && <AIWriteModal />}
    </div>
  )
}
