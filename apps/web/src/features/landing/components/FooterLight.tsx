import Link from 'next/link'

export function FooterLight() {
  return (
    <footer className="bg-neutral-100 pt-32 pb-12 px-6 border-t border-neutral-200 text-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-12 mb-24">
          <div className="col-span-2 md:col-span-5 pr-8">
            <Link href="/" className="inline-block mb-8">
              <img src="/joii_logo_fa.svg" alt="Joii" className="h-8" />
            </Link>
            <p className="text-neutral-500 max-w-sm text-sm leading-relaxed font-medium">
              Joii 致力于为电商设计师和商家提供基于前沿大模型的视觉创作工具，通过无限画布和智能算法，大幅提升生产效率与视觉质量。
            </p>
          </div>
          
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-bold uppercase tracking-widest text-xs text-neutral-700 mb-8">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-500">
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">智能换装</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">无限画布</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 transition-colors">4K 放大</Link></li>
              <li><Link href="/news" className="hover:text-neutral-950 transition-colors">更新日志</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs text-neutral-700 mb-8">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-500">
              <li><Link href="/help" className="hover:text-neutral-950 transition-colors">帮助中心</Link></li>
              <li><Link href="/help" className="hover:text-neutral-950 transition-colors">视频教程</Link></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">API 文档</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">联系我们</a></li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-bold uppercase tracking-widest text-xs text-neutral-700 mb-8">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-500">
              <li><a href="#" className="hover:text-neutral-950 transition-colors">隐私政策</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">服务条款</a></li>
              <li><a href="#" className="hover:text-neutral-950 transition-colors">版权声明</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 uppercase tracking-widest">
          <p>© 2026 Joii AI Inc.</p>
          <div className="flex items-center gap-2">
            <span>System Status:</span>
            <span className="flex items-center gap-2 text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
