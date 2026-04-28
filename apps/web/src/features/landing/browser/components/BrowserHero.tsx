import React from 'react'
import { ArrowRight, Headset } from 'lucide-react'

export function BrowserHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white text-neutral-950">
      {/* 顶部背景装饰色块 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2B7FFF]/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">

        {/* 顶部标签 */}
        <div className="text-xs font-sans-zh font-medium text-[#2B7FFF] tracking-[0.2em] uppercase mb-8 flex items-center gap-2 px-4 py-2 bg-[#2B7FFF]/5 rounded-full border border-[#2B7FFF]/20">
          <div className="w-2 h-2 rounded-full bg-[#2B7FFF] animate-pulse"></div>
          全新一代物理级防关联引擎 · 跨境大卖的安全出海首选
        </div>

        {/* 居中大标题 */}
        <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] tracking-tight mb-8 text-center max-w-4xl mx-auto">
          免费无限制的<br />
          <span className="text-[#2B7FFF]">指纹浏览器</span>
        </h1>

        {/* 副标题 */}
        <p className="font-sans-zh text-base md:text-xl text-neutral-500 max-w-2xl text-center mb-10 leading-relaxed">
          不限多开窗口，免收设备添加费，为您打造零成本、绝对防关联的出海护城河。
        </p>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full">
          <button className="group inline-flex flex-col items-center justify-center h-16 px-10 bg-[#2B7FFF] text-white font-sans-zh font-medium hover:bg-[#2266cc] transition-all shadow-lg shadow-[#2B7FFF]/20 w-full sm:w-auto rounded-none">
            <span className="flex items-center gap-2 text-base">
              免费下载客户端
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[10px] text-white/70 font-normal mt-0.5 tracking-widest uppercase">无隐形消费 · 3分钟极速上手</span>
          </button>
          <a href="#contact" className="h-16 px-8 bg-neutral-100 text-neutral-600 font-sans-zh font-medium hover:bg-neutral-200 transition-colors w-full sm:w-auto border border-neutral-200 flex items-center justify-center gap-2">
            <Headset className="w-5 h-5" />
            联系顾问
          </a>
        </div>

        {/* 底部 Mockup 界面 */}
        <div className="w-full max-w-7xl mx-auto relative group perspective-[2000px]">
          {/* Mockup 阴影/光晕 */}
          <div className="absolute -inset-4 bg-[#2B7FFF]/10 blur-3xl rounded-[2rem] opacity-50 group-hover:opacity-80 transition-opacity duration-700 -z-10"></div>

          <div className="relative">
            <img src="/browser-preview/env_list.png" alt="浆果浏览器多环境管理" className="w-full h-auto block" />
            {/* 渐变遮罩，使截图底部自然融入背景 */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
          </div>
        </div>

      </div>
    </section>
  )
}
