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
            重塑电商视觉，用 AI<br />
            <span className="font-sans-zh font-extralight text-neutral-400">驱动全域</span><br />
            生意增长
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5 md:row-span-2 relative overflow-hidden bg-neutral-950 text-white p-8 md:p-12">
            <div className="text-xs font-sans-zh text-neutral-400 tracking-[0.2em] uppercase mb-8">01</div>
            <div className="mb-6">
              <ImageIcon className="w-10 h-10 text-white/80" />
            </div>
            <h3 className="font-serif-display text-3xl md:text-4xl mb-4">
              实拍级自然模特
            </h3>
            <p className="font-sans-zh text-neutral-300 leading-relaxed mb-8">
              深度学习面料材质，自适应张力与光影褶皱。完美告别“一眼假”的塑料感，有效提升转化并降低退货率。
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
                <h3 className="font-serif-display text-2xl md:text-3xl mb-3">主图过检合规</h3>
                <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed max-w-sm">
                  满足淘宝/得物等严苛的主图清晰度规范。放大镜视效下细节依然锐利，拒绝残影噪点。
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
            <h3 className="font-serif-display text-xl md:text-2xl mb-3">海量 SKU 快反</h3>
            <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed">
              突破单图处理瓶颈。支持大批量同时编辑，应对“小单快反”高频上新需求。
            </p>
          </div>
          
          <div className="col-span-12 md:col-span-3 bg-neutral-950 text-white p-8 md:p-12 relative">
            <div className="text-xs font-sans-zh text-neutral-500 tracking-[0.2em] uppercase mb-6">04</div>
            <div className="mb-4">
              <Users className="w-7 h-7 text-white/80" />
            </div>
            <h3 className="font-serif-display text-xl md:text-2xl mb-3">全渠道资产云</h3>
            <p className="font-sans-zh text-neutral-400 text-sm leading-relaxed">
              一套素材多端复用。全员云端共享出海与内销素材库，一键分发变体至各平台。
            </p>
            
            <div className="absolute bottom-4 right-4 text-5xl font-serif-display text-white/5">∞</div>
          </div>
        </div>
      </div>
    </section>
  )
}
