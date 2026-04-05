import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Newspaper, Tag, TrendingUp, Sparkles, Image as ImageIcon } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
    icon: <Sparkles className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600',
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
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    coverImage: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    featured: false,
  },
  {
    id: 3,
    title: '从提示词到成品：解密 Joii "图生图" 背后的光影重构技术',
    excerpt: '很多用户好奇为什么 Joii 生成的商品图在光影表现上如此真实。今天我们的算法团队将为您深入浅出地讲解我们在 ControlNet 和光照模型上做出的独家优化。',
    date: '2026-01-10',
    category: '技术专栏',
    readTime: '8 分钟阅读',
    icon: <ImageIcon className="w-5 h-5" />,
    color: 'bg-amber-50 text-amber-600',
    coverImage: 'bg-gradient-to-br from-amber-50 to-orange-50',
    featured: false,
  },
  {
    id: 4,
    title: 'Joii 完成千万级 A 轮融资，加速布局 AIGC 电商设计基础设施',
    excerpt: '本轮融资由知名投资机构领投。资金将主要用于底层大模型的持续优化、核心技术团队扩充以及开拓更多垂直电商领域的 AI 应用场景。',
    date: '2026-02-15',
    category: '公司动态',
    readTime: '2 分钟阅读',
    icon: <Newspaper className="w-5 h-5" />,
    color: 'bg-blue-50 text-blue-600',
    coverImage: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    featured: false,
  },
]

export default function NewsPage() {
  const featuredNews = NEWS_ITEMS.find(n => n.featured)
  const regularNews = NEWS_ITEMS.filter(n => !n.featured)

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pl-20">
        {/* Header */}
        <header className="w-full h-14 flex items-center justify-between px-8 sticky top-0 z-10 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200/50">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center">
                  <img src="/joii_logo_fa.svg" alt="LOGO" className="h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>新闻动态</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">简体中文</span>
          </div>
        </header>

        <div className="max-w-6xl mx-auto mt-12 px-8">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
              新闻动态
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl">
              探索 Joii 的最新产品功能、行业洞察与前沿 AIGC 技术分享。
            </p>
          </div>

          {/* Featured News Hero Card */}
          {featuredNews && (
            <article className="mb-16 group relative bg-white rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col md:flex-row">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 mb-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${featuredNews.color}`}>
                    {featuredNews.icon}
                    {featuredNews.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={featuredNews.date}>{featuredNews.date}</time>
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                  <Link href={`/news/${featuredNews.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                    {featuredNews.title}
                  </Link>
                </h2>
                
                <p className="text-lg text-neutral-500 leading-relaxed mb-8 line-clamp-3">
                  {featuredNews.excerpt}
                </p>
                
                <div className="inline-flex items-center gap-2 text-base font-semibold text-neutral-900 group-hover:gap-3 transition-all mt-auto">
                  阅读全文
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              
              {/* Right Abstract Visual */}
              <div className={`w-full md:w-2/5 min-h-[300px] md:min-h-full relative overflow-hidden ${featuredNews.coverImage}`}>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/40 rounded-full blur-3xl mix-blend-overlay animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-900/10">
                  <Sparkles className="w-32 h-32" />
                </div>
              </div>
            </article>
          )}

          {/* Grid Layout for Regular News */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularNews.map((item) => (
              <article key={item.id} className="group flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                
                {/* Card Header Visual */}
                <div className={`h-40 w-full relative ${item.coverImage}`}>
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
                  <div className="absolute top-6 left-6 p-3 bg-white/60 rounded-2xl backdrop-blur-md border border-white/50 text-neutral-700 shadow-sm">
                    {item.icon}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md ${item.color}`}>
                      {item.category}
                    </span>
                    <time dateTime={item.date}>{item.date}</time>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors leading-snug">
                    <Link href={`/news/${item.id}`} className="outline-none focus-visible:underline before:absolute before:inset-0">
                      {item.title}
                    </Link>
                  </h2>
                  
                  <p className="text-sm text-neutral-500 leading-relaxed mb-6 line-clamp-3">
                    {item.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">{item.readTime}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Placeholder */}
          <div className="mt-16 mb-10 flex justify-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-neutral-200 rounded-full shadow-sm text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
              加载更多
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}