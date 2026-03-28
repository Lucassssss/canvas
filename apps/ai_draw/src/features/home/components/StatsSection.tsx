import React from 'react'

const stats = [
  { value: '10K+', label: '活跃用户' },
  { value: '50K+', label: '创作作品' },
  { value: '99.9%', label: '服务可用性' },
  { value: '24/7', label: '技术支持' },
]

export const StatsSection: React.FC = () => {
  return (
    <div className="bg-neutral-100 rounded-xl p-6 border border-neutral-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-semibold text-neutral-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
