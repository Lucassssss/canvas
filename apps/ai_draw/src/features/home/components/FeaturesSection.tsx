import React from 'react'
import { Sparkles, Zap, Layers, Shield } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI 智能生成',
    description: '基于先进 AI 技术，一键生成精美图片'
  },
  {
    icon: Zap,
    title: '实时协作',
    description: '多人同时编辑，实时同步更新'
  },
  {
    icon: Layers,
    title: '图层管理',
    description: '强大的图层功能，轻松实现复杂设计'
  },
  {
    icon: Shield,
    title: '安全可靠',
    description: '企业级安全保障，数据隐私无忧'
  },
]

export const FeaturesSection: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-medium text-neutral-700">为什么选择 joii</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-lg bg-neutral-900 w-fit mb-3">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-medium text-neutral-800 mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-neutral-500">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
