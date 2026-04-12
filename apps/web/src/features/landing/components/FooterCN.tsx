import Link from 'next/link'

export function FooterCN() {
  return (
    <footer className="bg-white pt-20 pb-12 px-6 md:px-12 border-t border-neutral-200 text-neutral-950">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-12 mb-20">
          <div className="col-span-12 md:col-span-5">
            <Link href="/" className="inline-block mb-6">
              <img src="/joii_logo_fa.svg" alt="Joii" className="h-8 w-8" width="32" height="32" />
            </Link>
            <p className="font-sans-zh text-neutral-500 max-w-sm text-sm leading-relaxed mb-6">
              Joii 为出海与内销头部商家提供实战级商品视觉增长工具。彻底告别传统实拍与模特的高昂成本，用极速测款和极致真实感驱动全域生意增长。
            </p>
            <div className="flex items-center gap-2 text-xs font-sans-zh text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>系统运行正常</span>
            </div>
          </div>

          <div className="col-span-6 md:col-span-2 md:col-start-7">
            <h4 className="font-sans-zh font-medium text-xs text-neutral-400 tracking-widest uppercase mb-6">解决方案</h4>
            <ul className="space-y-4 font-sans-zh text-sm text-neutral-600">
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">淘系爆款主图</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">跨境多区模特</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">社交平台种草</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">主图合规过检</Link></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h4 className="font-sans-zh font-medium text-xs text-neutral-400 tracking-widest uppercase mb-6">资源</h4>
            <ul className="space-y-4 font-sans-zh text-sm text-neutral-600">
              <li><Link href="/help" className="hover:text-neutral-950 transition-colors">帮助中心</Link></li>
              <li><Link href="/help" className="hover:text-neutral-950 transition-colors">视频教程</Link></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">API 文档</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">联系我们</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <h4 className="font-sans-zh font-medium text-xs text-neutral-400 tracking-widest uppercase mb-6">法律</h4>
            <ul className="space-y-4 font-sans-zh text-sm text-neutral-600">
              <li><a href="#" className="hover:text-neutral-950 transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">服务条款</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">版权声明</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 font-sans-zh text-xs text-neutral-400">
            <span>© 2026 Joii AI Inc. 保留所有权利</span>
            <span className="hidden md:inline">|</span>
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 transition-colors">陇ICP备19004300号</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans-zh text-xs text-neutral-400 hover:text-neutral-950 transition-colors">中文</a>
            <a href="#" className="font-sans-zh text-xs text-neutral-400 hover:text-neutral-950 transition-colors">English</a>
            <a href="#" className="font-sans-zh text-xs text-neutral-400 hover:text-neutral-950 transition-colors">日本語</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
