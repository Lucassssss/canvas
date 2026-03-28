import React from 'react'
import { Sparkles, Image, Palette, Brush, Layers, Wand2 } from 'lucide-react'

const quickTags = [
  { icon: Sparkles, label: 'AI 生成' },
  { icon: Image, label: '图片编辑' },
  { icon: Palette, label: '风格转换' },
  { icon: Brush, label: '手绘效果' },
  { icon: Layers, label: '图层混合' },
  { icon: Wand2, label: '智能修图' },
]

export const QuickTags: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-neutral-700">快捷功能</h2>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {quickTags.map((tag, index) => {
          const Icon = tag.icon
          return (
            <button
              key={index}
              className="
                group relative flex flex-col items-center gap-2 p-4
                rounded-lg border border-neutral-200
                bg-white hover:bg-neutral-50
                transition-all hover:border-neutral-300 hover:shadow-sm
              "
            >
              <div className="p-2.5 rounded-lg bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
                <Icon className="w-5 h-5 text-white" />
              </div>
              
              <span className="text-xs font-medium text-neutral-600 group-hover:text-neutral-800">
                {tag.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
