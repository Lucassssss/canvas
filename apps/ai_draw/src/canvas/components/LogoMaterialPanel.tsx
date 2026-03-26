import React, { useState, useCallback, useRef } from 'react'
import { useCanvasStore } from '../store'
import { X, Upload, Image as ImageIcon, Square, Circle, Triangle, Loader2 } from 'lucide-react'
import { aiCombinationService } from '@/ai-combination/service'

const SHAPE_PRESETS = [
  { id: 'rect', icon: <Square size={20} />, name: '矩形' },
  { id: 'circle', icon: <Circle size={20} />, name: '圆形' },
  { id: 'triangle', icon: <Triangle size={20} />, name: '三角形' },
]

const PRESET_LOGO_IMAGE = '/asset_logo.svg.png'

export const LogoMaterialPanel: React.FC = () => {
  const { logoEditingState, exitLogoEditing, shapes, selectedIds, updateShape } = useCanvasStore()
  const [activeTab, setActiveTab] = useState<'shapes' | 'text' | 'images' | 'templates'>('images')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const clothingShape = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id) && s.activeLogoId
  )

  const handlePresetIconClick = useCallback(() => {
    if (!clothingShape || !clothingShape.activeLogoId) return
    const logoId = clothingShape.activeLogoId
    const currentLogoContent = clothingShape.logoContent || {}
    updateShape(clothingShape.id, {
      logoContent: { ...currentLogoContent, [logoId]: PRESET_LOGO_IMAGE },
    })
  }, [clothingShape, updateShape])

  const handleClearLogo = useCallback(() => {
    if (!clothingShape || !clothingShape.activeLogoId) return
    const logoId = clothingShape.activeLogoId
    const currentLogoContent = clothingShape.logoContent || {}
    const newLogoContent = { ...currentLogoContent }
    delete newLogoContent[logoId]
    updateShape(clothingShape.id, { logoContent: newLogoContent })
  }, [clothingShape, updateShape])

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !clothingShape || !clothingShape.activeLogoId) return

    setIsUploading(true)
    try {
      const result = await aiCombinationService.uploadImage(file, 'logo-uploads')
      if (result.success && result.url) {
        const logoId = clothingShape.activeLogoId
        const currentLogoContent = clothingShape.logoContent || {}
        updateShape(clothingShape.id, {
          logoContent: { ...currentLogoContent, [logoId]: result.url },
        })
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [clothingShape, updateShape])

  const activeLogoId = clothingShape?.activeLogoId
  const hasLogoImage = activeLogoId ? clothingShape?.logoContent?.[activeLogoId] : false

  if (!logoEditingState.isEditing) return null

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[320px] bg-white border-l border-gray-200 flex flex-col z-[9997] shadow-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">LOGO 素材库</h3>
            <p className="text-xs text-gray-400">点击素材填充到区域</p>
          </div>
        </div>
        <button onClick={exitLogoEditing} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex border-b border-gray-100">
        {(['shapes', 'text', 'images', 'templates'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-colors ${
              activeTab === tab ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50/50' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'shapes' ? '图形' : tab === 'text' ? '文字' : tab === 'images' ? '图片' : '模板'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">基础图形</h4>
              <div className="grid grid-cols-4 gap-2">
                {SHAPE_PRESETS.map((shape) => (
                  <button key={shape.id} className="aspect-square rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-md">
                    <div className="text-gray-600">{shape.icon}</div>
                    <span className="text-[10px] text-gray-500">{shape.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">线条样式</h4>
              <div className="grid grid-cols-4 gap-2">
                {['实线', '虚线', '点线', '双线'].map((style, i) => (
                  <button key={style} className="aspect-square rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1.5 transition-all hover:shadow-md">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-5 h-0.5 bg-gray-400" style={{ borderStyle: i === 1 ? 'dashed' : i === 2 ? 'dotted' : 'solid', borderWidth: i === 3 ? '2px 0 0 0' : undefined }} />
                    </div>
                    <span className="text-[10px] text-gray-500">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">字体风格</h4>
            <div className="space-y-2">
              {[{ name: '思源黑体', sample: 'Aa' }, { name: '思源宋体', sample: '文字' }, { name: '阿里巴巴普惠体', sample: 'LOGO' }, { name: '站酷快乐体', sample: '设计' }].map((font) => (
                <button key={font.name} className="w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center gap-3 transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-medium shadow-sm">{font.sample}</div>
                  <span className="text-sm text-gray-700">{font.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">预设图标</h4>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={handlePresetIconClick}
                  className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all overflow-hidden p-1 ${hasLogoImage ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-amber-400 hover:bg-amber-50'}`}
                >
                  <img src={PRESET_LOGO_IMAGE} alt="预设图标" className="w-full h-full object-contain" />
                </button>
                {Array.from({ length: 7 }).map((_, i) => (
                  <button key={i} className="aspect-square rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-all hover:shadow-md">
                    <ImageIcon size={20} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
            {hasLogoImage && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm text-green-700">已填充图标</span>
                  </div>
                  <button onClick={handleClearLogo} className="text-xs text-red-500 hover:text-red-700 underline">清除</button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-center w-full pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={handleUploadClick}
                disabled={isUploading || !clothingShape?.activeLogoId}
                className="w-full py-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-amber-400 hover:bg-amber-50/50 flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={28} className="text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-500">上传中...</span>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-gray-400" />
                    <span className="text-sm text-gray-500">上传图片</span>
                    <span className="text-xs text-gray-400">PNG, SVG, JPG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-3">
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 border border-gray-200 flex items-center gap-3 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md" />
              <span className="text-sm font-medium text-white">简约品牌</span>
            </button>
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 border border-gray-200 flex items-center gap-3 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md" />
              <span className="text-sm font-medium text-white">科技感</span>
            </button>
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 border border-gray-200 flex items-center gap-3 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-md" />
              <span className="text-sm font-medium text-white">运动风格</span>
            </button>
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 border border-gray-200 flex items-center gap-3 transition-all hover:shadow-lg hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-md" />
              <span className="text-sm font-medium text-white">奢华典雅</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>点击素材填充到 LOGO 区域</span>
        </div>
      </div>
    </div>
  )
}