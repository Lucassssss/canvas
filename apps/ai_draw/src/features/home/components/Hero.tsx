import React from 'react'

export const Hero: React.FC = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-5xl font-medium tracking-tight text-neutral-900">
        {/* Joii, 好素材自己会说话 */}
        {/* 从新手到高手，只差一个Joii */}
        素材无忧，爆单不愁
      </h1>
      <p className="max-w-xl mx-auto text-lg  tracking-tight text-neutral-600">
        {/* 从一个想法，到全球爆单 */}
        Joii电商AI神器，让爆单轻松发生
      </p>
    </div>
  )
}
