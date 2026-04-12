import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

const NEWS_ITEMS = [
  {
    id: 'nano-banana2-xiaohongshu-ootd',
    title: 'Nano banana2 + 小红书 = 流量密码',
    excerpt: '3 分钟阅读',
    date: '2026-04-13',
    category: '运营实操',
  },
  {
    id: 'image-to-image-tech',
    title: 'Joii 核心引擎升级：如何利用光影重构降低 20% 售后退货率',
    excerpt: '最新版本强化了服装材质的物理反馈模型，彻底解决卖家秀与实物由于面料质感不符导致的退货客诉。跨境与淘系卖家必看。',
    date: '2026-04-05',
    category: '产品更新',
  },
]

export function NewsSectionCN() {
  return (
    <section className="py-24 md:py-32 bg-neutral-100 text-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-5">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
                最新资讯
              </div>
              <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Updates<span className="font-sans-zh font-extralight text-neutral-400">.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:text-right">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 font-sans-zh text-sm font-medium text-neutral-500 hover:text-neutral-950 transition-colors"
              >
                <span>查看全部文章</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {NEWS_ITEMS.map((item, index) => (
            <article key={item.id} className="group relative bg-white p-8 md:p-12">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-200" />

              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono text-xs text-neutral-300">{String(index + 1).padStart(2, '0')}</span>
                <span className="font-sans-zh text-xs text-neutral-400 tracking-wider uppercase">{item.category}</span>
              </div>

              <h3 className="font-serif-zh text-xl md:text-2xl font-medium mb-4 leading-tight group-hover:text-neutral-600 transition-colors">
                <Link href={`/news/${item.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                  {item.title}
                </Link>
              </h3>

              <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">
                {item.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-sans-zh text-neutral-400">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={item.date}>{item.date}</time>
                </div>
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-2 font-sans-zh text-xs font-medium text-neutral-950 group-hover:gap-3 transition-all"
                >
                  <span>阅读更多</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
