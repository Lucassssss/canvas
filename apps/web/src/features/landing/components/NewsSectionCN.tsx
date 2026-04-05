import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Joii v1.1.0 重磅发布：全新智能换装模型与高清放大功能上线',
    excerpt: '在最新版本的 Joii 中，我们引入了基于最前沿大模型技术的智能换装功能，不仅贴合度提升了300%，还支持最高 4K 的无损放大...',
    date: '2026-04-05',
    category: '产品更新',
  },
  {
    id: 2,
    title: '电商大促备战指南：如何用 Joii 一天生成 1000 张爆款主图',
    excerpt: '618即将来临，电商视觉设计团队面临巨大压力。本文将详细拆解如何利用 Joii 的无限画布组合批量生成能力...',
    date: '2026-03-20',
    category: '设计干货',
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
