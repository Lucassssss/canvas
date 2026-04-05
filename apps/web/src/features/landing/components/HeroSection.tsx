import Link from 'next/link'
import { Sparkles, ArrowRight, Play, ChevronRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-neutral-950 text-white selection:bg-white selection:text-neutral-950">
      {/* Abstract Noise Texture & Deep Gradients */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Pill badge - Brutalist Style */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest mb-12 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span>Joii v1.1.0 现已发布</span>
          <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Headline - Extreme Scale & Editorial Typography */}
        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-sm">
          DESIGN<br />
          <span className="font-serif italic font-light text-white/90">without</span> LIMITS.
        </h1>

        {/* Subheadline - High Contrast */}
        <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium tracking-tight">
          物理级智能换装与 4K 高清放大。基于大模型的电商视觉基础设施，打破创意的最后一道边界。
        </p>

        {/* CTA Buttons - High Impact */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-neutral-950 rounded-full text-sm font-bold uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Start Creating</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/help"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent text-white border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            Watch Film
          </Link>
        </div>

        {/* Hero Mockup - Editorial / Editorial Poster Style */}
        <div className="relative mx-auto max-w-6xl aspect-[21/9] md:aspect-[16/7] rounded-none md:rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl group cursor-pointer">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-1000 grayscale group-hover:grayscale-0 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="text-left">
              <div className="text-xs font-mono text-indigo-400 mb-2 tracking-widest uppercase">Joii Engine 2.0</div>
              <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">AI-Powered Visuals</h3>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white font-mono text-xs hover:bg-white hover:text-neutral-950 transition-colors">01</div>
              <div className="w-12 h-12 rounded-full border border-white/20 backdrop-blur-md flex items-center justify-center text-white font-mono text-xs hover:bg-white hover:text-neutral-950 transition-colors">02</div>
            </div>
          </div>
          
          {/* Abstract Scanline */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/50 blur-[1px] animate-[scan_4s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  )
}
