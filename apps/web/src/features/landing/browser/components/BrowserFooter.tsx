import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function BrowserFooter() {
  return (
    <footer className="bg-neutral-950 text-white relative overflow-hidden">
      {/* 底部转化区 */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2B7FFF]/20 rounded-full blur-[150px] -z-10" />
        
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-7xl mb-8 tracking-tight">
            立即构建您的<br />
            <span className="font-sans-zh font-extralight text-neutral-400">安全</span><br />
            出海矩阵
          </h2>
          <p className="font-sans-zh text-neutral-400 mb-12 max-w-md mx-auto leading-relaxed">
            不要让一次关联风控，毁掉半年的运营心血。现在下载，即刻锁定不限多开窗口的永久免费特权。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="group inline-flex items-center gap-3 px-10 py-5 bg-[#2B7FFF] text-white font-sans-zh font-medium text-sm hover:bg-[#2266cc] transition-colors w-full sm:w-auto justify-center">
              <span>免费下载客户端</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a href="#contact" className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 text-white border border-white/10 font-sans-zh font-medium text-sm hover:bg-white/10 transition-colors w-full sm:w-auto justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.46 7.64c.2 0 .4.04.59.1.58.21.96.79.93 1.4-.04.6-.46 1.12-1.04 1.28-.15.04-.3.06-.46.06h-.14c-.65 0-1.25-.43-1.46-1.05-.12-.34-.1-.73.06-1.05.15-.31.42-.56.74-.68.17-.06.35-.08.53-.08a1.64 1.64 0 0 1 .25.02zM12 2C6.48 2 2 6.03 2 11s4.48 9 10 9c1.05 0 2.06-.15 3-.42l3.41 1.7c.39.2.86.13 1.18-.18.31-.3.4-.77.22-1.16l-1.12-2.34C20.67 15.68 22 13.43 22 11c0-4.97-4.48-9-10-9zm5 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z" />
              </svg>
              联系企微顾问
            </a>
          </div>
        </div>
      </section>

      {/* 页脚链接区 */}
      <div className="border-t border-neutral-800 pt-16 pb-12 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <img src="/joii_berry_logo_withtext.svg" alt="Joii Berry" className="h-6 brightness-0 invert" />
            </div>
            
            <div className="flex gap-8 font-sans-zh text-sm text-neutral-500">
              <Link href="#" className="hover:text-white transition-colors">隐私政策</Link>
              <Link href="#" className="hover:text-white transition-colors">服务条款</Link>
              <Link href="#" className="hover:text-white transition-colors">帮助中心</Link>
            </div>
          </div>
          
          <div className="mt-12 text-center md:text-left font-sans-zh text-xs text-neutral-600">
            © {new Date().getFullYear()} Joii Berry Browser. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
