import React from 'react'
import { ArrowRight } from 'lucide-react'

export function BrowserHero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white text-neutral-950">
      {/* 顶部背景装饰色块 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2B7FFF]/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center">

        {/* 顶部标签 */}
        <div className="text-xs font-sans-zh font-medium text-[#2B7FFF] tracking-[0.2em] uppercase mb-8 flex items-center gap-2 px-4 py-2 bg-[#2B7FFF]/5 rounded-full border border-[#2B7FFF]/20">
          <div className="w-2 h-2 rounded-full bg-[#2B7FFF] animate-pulse"></div>
          基于大厂级底层架构 · 专为跨境电商打造
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
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.46 7.64c.2 0 .4.04.59.1.58.21.96.79.93 1.4-.04.6-.46 1.12-1.04 1.28-.15.04-.3.06-.46.06h-.14c-.65 0-1.25-.43-1.46-1.05-.12-.34-.1-.73.06-1.05.15-.31.42-.56.74-.68.17-.06.35-.08.53-.08a1.64 1.64 0 0 1 .25.02zM12 2C6.48 2 2 6.03 2 11s4.48 9 10 9c1.05 0 2.06-.15 3-.42l3.41 1.7c.39.2.86.13 1.18-.18.31-.3.4-.77.22-1.16l-1.12-2.34C20.67 15.68 22 13.43 22 11c0-4.97-4.48-9-10-9zm5 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
            </svg>
            联系企微顾问
          </a>
        </div>

        {/* 底部 Mockup 界面 */}
        <div className="w-full max-w-5xl mx-auto relative group perspective-[2000px]">
          {/* Mockup 阴影/光晕 */}
          <div className="absolute -inset-4 bg-[#2B7FFF]/10 blur-3xl rounded-[2rem] opacity-50 group-hover:opacity-80 transition-opacity duration-700 -z-10"></div>

          <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] transform transition-transform duration-700 hover:-translate-y-2">

            {/* Mock UI 顶部控制栏 (原生 App 风格) */}
            <div className="h-12 bg-neutral-50 border-b border-neutral-200 flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="font-serif-zh text-sm font-medium text-neutral-500">Joii Berry Client</div>
              <div className="w-16"></div> {/* 占位平衡 */}
            </div>

            {/* Mock UI 主体 */}
            <div className="flex h-[calc(100%-3rem)] bg-neutral-50/50">
              {/* 侧边栏 */}
              <div className="w-48 border-r border-neutral-200 bg-white p-4 hidden md:flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-6 h-6 bg-[#2B7FFF] rounded flex items-center justify-center text-white font-serif-display text-xs font-bold">J</div>
                  <span className="text-sm font-bold text-neutral-900 font-serif-zh tracking-wide">浆果浏览器</span>
                </div>
                <div className="h-8 rounded bg-[#2B7FFF]/10 border border-[#2B7FFF]/20 w-full mb-2 flex items-center px-3">
                  <div className="w-3 h-3 rounded-sm bg-[#2B7FFF]"></div>
                  <div className="ml-2 h-2 w-16 bg-[#2B7FFF]/60 rounded"></div>
                </div>
                <div className="h-8 rounded w-full flex items-center px-3 hover:bg-neutral-100">
                  <div className="w-3 h-3 rounded-sm bg-neutral-300"></div>
                  <div className="ml-2 h-2 w-12 bg-neutral-300 rounded"></div>
                </div>
                <div className="h-8 rounded w-full flex items-center px-3 hover:bg-neutral-100">
                  <div className="w-3 h-3 rounded-sm bg-neutral-300"></div>
                  <div className="ml-2 h-2 w-16 bg-neutral-300 rounded"></div>
                </div>
              </div>

              {/* 内容区 */}
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-6 w-32 bg-neutral-200 rounded"></div>
                  <div className="h-8 w-24 bg-[#2B7FFF] rounded shadow-sm shadow-[#2B7FFF]/30"></div>
                </div>

                {/* 模拟表格头 */}
                <div className="h-10 w-full bg-white border border-neutral-200 rounded flex items-center px-4 shadow-sm">
                  <div className="w-1/3 h-3 bg-neutral-100 rounded"></div>
                  <div className="w-1/3 h-3 bg-neutral-100 rounded"></div>
                  <div className="w-1/3 h-3 bg-neutral-100 rounded"></div>
                </div>

                {/* 模拟数据行 */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 w-full bg-white border border-neutral-200 rounded flex items-center px-4 shadow-sm group hover:border-[#2B7FFF]/30 transition-colors">
                    <div className="w-1/3 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-400 font-mono">{i}</div>
                      <div className="h-3 w-24 bg-neutral-200 rounded"></div>
                    </div>
                    <div className="w-1/3 flex items-center">
                      <div className="h-5 w-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center px-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></div>
                        <div className="text-[10px] text-emerald-600 font-sans-zh">安全隔离</div>
                      </div>
                    </div>
                    <div className="w-1/3 flex items-center justify-end">
                      <div className="h-7 w-16 bg-neutral-100 rounded border border-neutral-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
