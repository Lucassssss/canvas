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
    <div className="flex flex-wrap items-center gap-2">
      {quickTags.map((tag, index) => {
        const Icon = tag.icon
        return (
          <button
            key={index}
            className="
              inline-flex items-center gap-1.5 px-3 py-1.5
              rounded-full border border-neutral-200
              bg-white hover:bg-neutral-50 hover:border-neutral-300
              transition-all
            "
          >
            <Icon className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-xs font-medium text-neutral-600">
              {tag.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
