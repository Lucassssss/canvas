import { Image as ImageIcon, ZoomIn, Layers, Users } from 'lucide-react'

export function FeatureSectionCN() {
  return (
    <section id="features" className="py-24 md:py-32 bg-neutral-100 text-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-20 md:mb-32">
          <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
            核心能力
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            为电商视觉<br />
            <span className="font-sans-zh font-extralight text-neutral-400">重新定义</span><br />
            创作工作流
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5 md:row-span-2 relative overflow-hidden bg-neutral-950 text-white p-8 md:p-12">
            <div className="text-xs font-sans-zh text-neutral-400 tracking-[0.2em] uppercase mb-8">01</div>
            <div className="mb-6">
              <ImageIcon className="w-10 h-10 text-white/80" />
            </div>
            <h3 className="font-serif-display text-3xl md:text-4xl mb-4">
              智能换装
              <span className="text-xs font-sans-zh font-normal text-neutral-400 ml-2">2.0</span>
            </h3>
            <p className="font-sans-zh text-neutral-300 leading-relaxed mb-8">
              物理级贴合，精准识别衣服材质，自动计算自然光影与褶皱，告别生硬贴图感。
            </p>
            
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-t from-indigo-500/20 to-transparent" />
          </div>
          
          <div className="col-span-12 md:col-span-7 bg-white p-8 md:p-12 relative">
            <div className="text-xs font-sans-zh text-neutral-400 tracking-[0.2em] uppercase mb-8">02</div>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-4">
                  <ZoomIn className="w-8 h-8 text-neutral-950" />
                </div>
                <h3 className="font-serif-display text-2xl md:text-3xl mb-3">4K 无损放大</h3>
                <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed max-w-sm">
                  AI 智能补充纹理细节，放大后布料与五官依然清晰锐利。
                </p>
              </div>
              <div className="text-6xl font-serif-display text-neutral-100">4K</div>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white p-8 md:p-12 relative">
            <div className="text-xs font-sans-zh text-neutral-400 tracking-[0.2em] uppercase mb-6">03</div>
            <div className="mb-4">
              <Layers className="w-7 h-7 text-neutral-950" />
            </div>
            <h3 className="font-serif-display text-xl md:text-2xl mb-3">无限画布</h3>
            <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed">
              自由拖拽排版，支持海量图层同时编辑与处理。
            </p>
          </div>
          
          <div className="col-span-12 md:col-span-3 bg-neutral-950 text-white p-8 md:p-12 relative">
            <div className="text-xs font-sans-zh text-neutral-500 tracking-[0.2em] uppercase mb-6">04</div>
            <div className="mb-4">
              <Users className="w-7 h-7 text-white/80" />
            </div>
            <h3 className="font-serif-display text-xl md:text-2xl mb-3">云端协作</h3>
            <p className="font-sans-zh text-neutral-400 text-sm leading-relaxed">
              企业级资产库，团队共享设计规范与灵感，一键分发复用。
            </p>
            
            <div className="absolute bottom-4 right-4 text-5xl font-serif-display text-white/5">∞</div>
          </div>
        </div>
      </div>
    </section>
  )
}
