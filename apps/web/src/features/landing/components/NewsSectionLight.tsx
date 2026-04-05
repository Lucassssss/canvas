import Link from 'next/link'
import { ArrowRight, Calendar, Sparkles } from 'lucide-react'

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

export function NewsSectionLight() {
  return (
    <section className="py-32 px-6 bg-neutral-50 text-neutral-950 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Latest <span className="font-serif italic font-light text-indigo-600">Updates.</span>
            </h2>
            <p className="text-xl text-neutral-500 font-medium">
              探索 Joii 产品更新与前沿 AIGC 技术分享。
            </p>
          </div>
          <Link href="/news" className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs">
            View All
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {NEWS_ITEMS.map((item) => (
            <article key={item.id} className="group relative flex flex-col bg-white rounded-[2.5rem] p-8 md:p-12 border border-neutral-200 hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between text-sm font-medium text-neutral-500 mb-8">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-full border border-neutral-200 text-neutral-700 uppercase tracking-widest text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  {item.category}
                </span>
                <span className="inline-flex items-center gap-2 font-mono text-xs">
                  <Calendar className="w-3 h-3" />
                  <time dateTime={item.date}>{item.date}</time>
                </span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight group-hover:text-indigo-600 transition-colors tracking-tight">
                <Link href={`/news/${item.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                  {item.title}
                </Link>
              </h3>
              
              <p className="text-neutral-500 leading-relaxed mb-12 line-clamp-2 text-lg">
                {item.excerpt}
              </p>
              
              <div className="mt-auto inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-neutral-700 group-hover:gap-4 transition-all">
                Read Article
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
