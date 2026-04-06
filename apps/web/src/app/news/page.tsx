import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { source } from '@/lib/source'
import type { NewsFrontmatter } from '../../../source.config'

export const metadata: Metadata = {
  title: '新闻动态 - Joii 无限画布智能设计平台',
  description: '获取 Joii 最新产品动态、功能更新、行业资讯与电商AI设计干货。了解我们如何通过AI技术革新电商设计体验。',
  keywords: 'Joii新闻, 产品更新, AI设计资讯, 电商AI动态, 智能画布更新, AIGC电商',
}

export default function NewsPage() {
  const allPages = source.getPages()
  const featuredNews = allPages[0]
  const regularNews = allPages.slice(1)

  return (
    <div className="min-h-screen w-full bg-white flex">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 lg:pl-20">
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

          {featuredNews && (() => {
            const frontmatter = featuredNews.data as NewsFrontmatter
            return (
              <article className="group relative bg-neutral-100 p-8 md:p-12 mb-16 md:mb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-300" />
                
                <div className="grid grid-cols-12 gap-6 items-center">
                  <div className="col-span-12 lg:col-span-7 relative">
                    <div className="flex items-center gap-6 mb-8">
                      <span className="font-mono text-xs text-neutral-400">01</span>
                      <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{frontmatter.category || '产品更新'}</span>
                      {frontmatter.date && (
                        <span className="font-sans-zh text-xs text-neutral-400 flex items-center gap-1.5 ml-auto">
                          <time dateTime={frontmatter.date}>{frontmatter.date}</time>
                        </span>
                      )}
                    </div>
                    
                    <h2 className="font-serif-zh text-2xl md:text-3xl lg:text-4xl font-medium mb-6 leading-snug">
                      <Link href={featuredNews.url} className="outline-none focus-visible:underline before:absolute before:inset-0">
                        {frontmatter.title}
                      </Link>
                    </h2>
                    
                    {frontmatter.description && (
                      <p className="font-sans-zh text-neutral-500 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
                        {frontmatter.description}
                      </p>
                    )}
                    
                    <Link href={featuredNews.url} className="inline-flex items-center gap-2 font-sans-zh text-sm font-medium text-neutral-900 group-hover:gap-3 transition-all">
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
            )
          })()}

          <div className="grid grid-cols-12 gap-6">
            {regularNews.map((item, index) => {
              const frontmatter = item.data as NewsFrontmatter
              return (
                <article key={item.url} className="group relative col-span-12 md:col-span-6 bg-white p-8 md:p-12 border border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-xs text-neutral-300">{String(index + 2).padStart(2, '0')}</span>
                    <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{frontmatter.category || '产品更新'}</span>
                    {frontmatter.date && <span className="font-sans-zh text-xs text-neutral-400 ml-auto">{frontmatter.date}</span>}
                  </div>
                  
                  <h2 className="font-serif-zh text-xl md:text-2xl font-medium mb-4 leading-snug">
                    <Link href={item.url} className="outline-none focus-visible:underline before:absolute before:inset-0">
                      {frontmatter.title}
                    </Link>
                  </h2>
                  
                  {frontmatter.description && (
                    <p className="font-sans-zh text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {frontmatter.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    {frontmatter.description && <span className="font-sans-zh text-xs text-neutral-400">{frontmatter.description}</span>}
                    <Link href={item.url} className="inline-flex items-center gap-1 font-sans-zh text-xs text-neutral-500 hover:text-neutral-900 group-hover:gap-2 transition-all">
                      <span>阅读</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              )
            })}
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