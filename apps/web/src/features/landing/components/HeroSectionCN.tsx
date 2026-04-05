import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function HeroSectionCN() {
  return (
    <section className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden bg-white text-neutral-950">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-neutral-100/50" />
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-7">
            <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-8">
              电商视觉 AI 革命
            </div>
            
            <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
              <span className="block">智能</span>
              <span className="block font-sans-zh font-extralight text-neutral-400">换装</span>
              <span className="block">无限</span>
            </h1>
            
            <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-md mb-12 leading-relaxed">
              基于大模型的电商视觉基础设施，打破创意边界。物理级贴合，4K无损放大，让每一帧都成为可能。
            </p>
            
            <div className="flex items-center gap-4">
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
          
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden group">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-90 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000&auto=format&fit=crop")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="text-xs font-sans-zh text-neutral-500 tracking-widest uppercase mb-2">Joii Engine 2.0</div>
                <div className="text-lg font-serif-zh font-medium text-neutral-950">AI 驱动的视觉创作</div>
              </div>
              
              <div className="absolute top-6 right-6 w-16 h-16 border border-neutral-300 flex items-center justify-center font-mono text-xs text-neutral-400">
                01
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-24 md:mt-32 pt-12 border-t border-neutral-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">300%</div>
              <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">贴合度提升</div>
            </div>
            <div>
              <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">4K</div>
              <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">无损放大输出</div>
            </div>
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
    </section>
  )
}
