import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroCanvas } from './HeroCanvas'

export function HeroSectionCN() {
  return (
    <section className="relative overflow-hidden bg-white text-neutral-950 mt-20">
      <div className="absolute top-0 right-0 w-1/2 bottom-0 bg-neutral-100/50" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-12 gap-6 lg:gap-12 items-stretch">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between min-h-[auto] lg:min-h-[800px] pt-12 lg:pt-0">
            <div className="pt-12 md:pt-32">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-8">
                电商视觉 AI 革命
              </div>

              <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
                <span className="block">智能</span>
                <span className="block font-sans-zh font-extralight text-neutral-500">换装</span>
                <span className="block">无限</span>
              </h1>

              <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-md leading-relaxed">
                基于大模型的电商视觉基础设施，打破创意边界。物理级贴合，4K无损放大，让每一帧都成为可能。
              </p>

              <div className="flex items-center gap-4 mt-8">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-950 text-white font-sans-zh font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors"
                >
                  <span>开始创作</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <span className="text-xs font-sans-zh text-neutral-400 tracking-wider">
                  v1.1.0 现已发布
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 h-[500px] lg:min-h-[800px] relative mt-12 lg:mt-0">
            <HeroCanvas className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-12 items-stretch border-t border-neutral-200">
          <div className="col-span-12 lg:col-span-6 py-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">300%</div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">贴合度提升</div>
              </div>
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">4K</div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">无损放大输出</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 py-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">∞</div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">无限画布创作</div>
              </div>
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">10x</div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">效率倍增</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
