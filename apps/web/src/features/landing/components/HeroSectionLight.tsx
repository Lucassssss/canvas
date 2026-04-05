import Link from 'next/link'
import { Sparkles, ArrowRight, Play, ChevronRight } from 'lucide-react'

export function HeroSectionLight() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-white text-neutral-950 selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs font-bold uppercase tracking-widest mb-12 hover:bg-neutral-200 transition-colors cursor-pointer group">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Joii v1.1.0 现已发布</span>
          <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[0.9] text-neutral-950">
          DESIGN<br />
          <span className="font-serif italic font-light text-indigo-600">without</span> LIMITS.
        </h1>

        <p className="text-lg md:text-2xl text-neutral-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
          物理级智能换装与 4K 高清放大。基于大模型的电商视觉基础设施，打破创意的最后一道边界。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-neutral-950 text-white rounded-full text-sm font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 hover:bg-neutral-800"
          >
            <span className="relative z-10">Start Creating</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/help"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent text-neutral-950 border border-neutral-200 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-neutral-100 transition-all"
          >
            <Play className="w-4 h-4 fill-neutral-950 group-hover:scale-110 transition-transform" />
            Watch Film
          </Link>
        </div>

        <div className="relative mx-auto max-w-6xl aspect-[21/9] md:aspect-[16/7] rounded-none md:rounded-[2rem] overflow-hidden bg-neutral-100 border border-neutral-200 shadow-2xl group cursor-pointer">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity duration-1000 grayscale group-hover:grayscale-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="text-left">
              <div className="text-xs font-mono text-indigo-600 mb-2 tracking-widest uppercase font-bold">Joii Engine 2.0</div>
              <h3 className="text-2xl md:text-4xl font-bold text-neutral-950 tracking-tight">AI-Powered Visuals</h3>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-neutral-300 backdrop-blur-md flex items-center justify-center text-neutral-700 font-mono text-xs hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-colors">01</div>
              <div className="w-12 h-12 rounded-full border border-neutral-300 backdrop-blur-md flex items-center justify-center text-neutral-700 font-mono text-xs hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-colors">02</div>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/50 blur-[1px] animate-[scan_4s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
