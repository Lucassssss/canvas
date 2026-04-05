import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: '新闻动态 - Joii 无限画布智能设计平台',
  description: '获取 Joii 最新产品动态、功能更新、行业资讯与电商AI设计干货。了解我们如何通过AI技术革新电商设计体验。',
  keywords: 'Joii新闻, 产品更新, AI设计资讯, 电商AI动态, 智能画布更新, AIGC电商',
}

const NEWS_ITEMS = [
  {
    id: 1,
    title: 'Joii v1.1.0 重磅发布：全新智能换装模型与高清放大功能上线',
    excerpt: '在最新版本的 Joii 中，我们引入了基于最前沿大模型技术的智能换装功能，不仅贴合度提升了300%，还支持最高 4K 的无损放大，为电商商品图提供直接商用的画质保证。',
    date: '2026-04-05',
    category: '产品更新',
    readTime: '3 分钟阅读',
    coverImage: 'bg-gradient-to-br from-indigo-100 to-purple-50',
    featured: true,
  },
  {
    id: 2,
    title: '电商大促备战指南：如何用 Joii 一天生成 1000 张爆款主图',
    excerpt: '618即将来临，电商视觉设计团队面临巨大压力。本文将详细拆解如何利用 Joii 的无限画布组合批量生成能力，配合精准的 Prompt 词，实现高转化率商品图的量产。',
    date: '2026-03-20',
    category: '设计干货',
    readTime: '5 分钟阅读',
    coverImage: 'bg-gradient-to-br from-neutral-200 to-neutral-100',
    featured: false,
  },
  {
    id: 3,
    title: '从提示词到成品：解密 Joii "图生图" 背后的光影重构技术',
    excerpt: '很多用户好奇为什么 Joii 生成的商品图在光影表现上如此真实。今天我们的算法团队将为您深入浅出地讲解我们在 ControlNet 和光照模型上做出的独家优化。',
    date: '2026-01-10',
    category: '技术专栏',
    readTime: '8 分钟阅读',
    coverImage: 'bg-gradient-to-br from-neutral-200 to-neutral-100',
    featured: false,
  },
  {
    id: 4,
    title: 'Joii 完成千万级 A 轮融资，加速布局 AIGC 电商设计基础设施',
    excerpt: '本轮融资由知名投资机构领投。资金将主要用于底层大模型的持续优化、核心技术团队扩充以及开拓更多垂直电商领域的 AI 应用场景。',
    date: '2026-02-15',
    category: '公司动态',
    readTime: '2 分钟阅读',
    coverImage: 'bg-gradient-to-br from-neutral-200 to-neutral-100',
    featured: false,
  },
]

export default function NewsPage() {
  const featuredNews = NEWS_ITEMS.find(n => n.featured)
  const regularNews = NEWS_ITEMS.filter(n => !n.featured)

  return (
    <div className="min-h-screen w-full bg-white flex">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pl-20">
        <PageHeader breadcrumbs={[{ label: '新闻动态' }]} />

        <div className="max-w-[1600px] mx-auto py-16 md:py-24 lg:py-32 px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 mb-16 md:mb-24">
            <div className="col-span-12 lg:col-span-5">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-6">
                最新资讯
              </div>
              <h1 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                Updates<span className="font-sans-zh font-extralight italic text-neutral-400">.</span>
              </h1>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7 flex items-end">
              <p className="font-sans-zh text-sm md:text-base text-neutral-400 max-w-md leading-relaxed">
                探索 Joii 的最新产品功能、<br className="hidden md:block" />
                行业洞察与前沿 <span className="italic">AIGC</span> 技术分享。
              </p>
            </div>
          </div>

          {featuredNews && (
            <article className="group relative bg-neutral-100 p-8 md:p-12 mb-16 md:mb-20 overflow-hidden">
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-300" />
              
              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-12 lg:col-span-7 relative">
                  <div className="flex items-center gap-6 mb-8">
                    <span className="font-mono text-xs text-neutral-400">01</span>
                    <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{featuredNews.category}</span>
                    <span className="font-sans-zh text-xs text-neutral-400 flex items-center gap-1.5 ml-auto">
                      <time dateTime={featuredNews.date}>{featuredNews.date}</time>
                    </span>
                  </div>
                  
                  <h2 className="font-serif-zh text-2xl md:text-3xl lg:text-4xl font-medium mb-6 leading-snug">
                    <Link href={`/news/${featuredNews.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                      {featuredNews.title}
                    </Link>
                  </h2>
                  
                  <p className="font-sans-zh text-neutral-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                    {featuredNews.excerpt}
                  </p>
                  
                  <Link href={`/news/${featuredNews.id}`} className="inline-flex items-center gap-2 font-sans-zh text-sm font-medium text-neutral-900 group-hover:gap-3 transition-all">
                    <span>阅读更多</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="col-span-12 lg:col-span-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/40 rounded-full blur-3xl mix-blend-overlay" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif-display text-6xl text-neutral-300/50">01</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="grid grid-cols-12 gap-6">
            {regularNews.map((item, index) => (
              <article key={item.id} className="group relative col-span-12 md:col-span-6 bg-white p-8 md:p-12 border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-xs text-neutral-300">{String(index + 2).padStart(2, '0')}</span>
                  <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{item.category}</span>
                  <span className="font-sans-zh text-xs text-neutral-400 ml-auto">{item.date}</span>
                </div>
                
                <h2 className="font-serif-zh text-xl md:text-2xl font-medium mb-4 leading-snug">
                  <Link href={`/news/${item.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                    {item.title}
                  </Link>
                </h2>
                
                <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {item.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="font-sans-zh text-xs text-neutral-400">{item.readTime}</span>
                  <Link href={`/news/${item.id}`} className="inline-flex items-center gap-1 font-sans-zh text-xs text-neutral-500 hover:text-neutral-900 group-hover:gap-2 transition-all">
                    <span>阅读</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 md:mt-20 flex justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-950 text-white font-sans-zh font-medium text-sm hover:bg-neutral-800 transition-colors">
              加载更多
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}