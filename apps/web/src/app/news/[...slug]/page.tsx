import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2, Link as LinkIcon, ArrowRight, MessageCircle, Heart, Bookmark } from 'lucide-react'
import { source } from '@/lib/source'
import { notFound } from 'next/navigation'
import { getMDXComponents } from './mdx'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import type { NewsFrontmatter } from '../../../../source.config'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const page = source.getPage(resolvedParams.slug ?? [])
  if (!page) notFound()

  return {
    title: `${page.data.title} - Joii 新闻动态`,
    description: page.data.description,
  }
}

export function generateStaticParams() {
  return source.generateParams()
}

export default async function NewsDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug ?? []
  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body
  const allPages = source.getPages()
  const currentIndex = allPages.findIndex(p => p.url === `/${slug.join('/')}`)
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : null
  const nextPage = currentIndex < allPages.length - 1 ? allPages[currentIndex + 1] : null

  const frontmatter = page.data as NewsFrontmatter
  const formattedDate = frontmatter.date ? new Date(frontmatter.date).toISOString().split('T')[0] : ''
  const description = frontmatter.description ?? ''
  const category = frontmatter.category || '新闻动态'

  return (
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pb-24 lg:pb-32 lg:pl-20">
        <PageHeader 
          breadcrumbs={[
            { label: '新闻动态', href: '/news' },
            { label: page.data.title }
          ]}
          rightContent={
            <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors" title="分享">
              <Share2 className="w-4 h-4" />
            </button>
          }
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-12 gap-6">
            <article className="col-span-12 lg:col-span-8 lg:col-start-3 relative">
              <div className="hidden md:block absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-200 -translate-x-6 md:-translate-x-12" />
              
              <header className="mb-12 md:mb-16 pt-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-xs text-neutral-400">{String(currentIndex + 1).padStart(2, '0')}</span>
                  <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{category}</span>
                  {formattedDate && <span className="font-sans-zh text-xs text-neutral-400 ml-auto">{formattedDate}</span>}
                </div>
                
                <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-950 mb-8 leading-[1.1]">
                  {page.data.title}
                </h1>
                
                {formattedDate && (
                  <div className="flex items-center gap-6 font-sans-zh text-sm text-neutral-500 border-y border-neutral-200 py-4">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={formattedDate}>{formattedDate}</time>
                    </span>
                    {description && (
                      <>
                        <span className="text-neutral-300">·</span>
                        <span>{description}</span>
                      </>
                    )}
                  </div>
                )}
              </header>

              <div 
                className="font-sans-zh text-base md:text-lg text-neutral-600
                  [&_h2]:font-serif-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-neutral-950 [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:tracking-tight
                  [&_h3]:font-serif-display [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:text-neutral-950 [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:tracking-tight
                  [&_p]:mb-6 [&_p]:leading-loose
                  [&_ul]:mb-6 [&_ul]:space-y-3
                  [&_ol]:mb-6 [&_ol]:space-y-3 [&_ol]:list-decimal [&_ol]:list-inside
                  [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-neutral-400 [&_li]:before:content-['—']
                  [&_li_p]:mb-0 [&_li]:text-neutral-700
                  
                  [&_strong]:font-semibold [&_strong]:text-neutral-900
                  [&_em]:italic
                  [&_a]:text-neutral-900 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-neutral-600 [&_a]:transition-colors
                  
                  [&_.lead]:text-xl [&_.lead]:md:text-2xl [&_.lead]:text-neutral-800 [&_.lead]:font-medium [&_.lead]:leading-relaxed [&_.lead]:mb-12 [&_.lead]:py-8 [&_.lead]:border-y [&_.lead]:border-neutral-200
                  
                  [&_.image-placeholder]:my-12 [&_.image-placeholder]:w-full
                  [&_.image-placeholder_.visual]:w-full [&_.image-placeholder_.visual]:h-[400px] [&_.image-placeholder_.visual]:bg-neutral-100 [&_.image-placeholder_.visual]:flex [&_.image-placeholder_.visual]:flex-col [&_.image-placeholder_.visual]:items-center [&_.image-placeholder_.visual]:justify-center [&_.image-placeholder_.visual]:text-neutral-400 [&_.image-placeholder_.visual]:border [&_.image-placeholder_.visual]:border-neutral-200
                  [&_.image-placeholder_.caption]:text-sm [&_.image-placeholder_.caption]:text-center [&_.image-placeholder_.caption]:text-neutral-400 [&_.image-placeholder_.caption]:mt-4
                  
                  [&_blockquote]:my-12 [&_blockquote]:p-8 [&_blockquote]:bg-neutral-100 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-950 [&_blockquote]:rounded-r-lg [&_blockquote]:text-neutral-700 [&_blockquote]:italic [&_blockquote]:leading-relaxed
                  
                  [&_pre]:my-6 [&_pre]:p-6 [&_pre]:bg-neutral-900 [&_pre]:text-neutral-100 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-sm
                  [&_code]:font-mono [&_code]:text-sm
                  [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:bg-neutral-100 [&_p_code]:rounded [&_p_code]:text-rose-600
                  
                  [&_hr]:my-12 [&_hr]:border-neutral-200
                  
                  [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse
                  [&_th]:text-left [&_th]:p-4 [&_th]:bg-neutral-100 [&_th]:font-medium [&_th]:text-neutral-900 [&_th]:border [&_th]:border-neutral-200
                  [&_td]:p-4 [&_td]:border [&_td]:border-neutral-200
                "
              >
                <MDX 
                  components={getMDXComponents({
                    a: createRelativeLink(source, page),
                  })}
                />
              </div>

              <footer className="mt-16 md:mt-20 pt-8 border-t border-neutral-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="font-sans-zh text-sm font-medium text-neutral-900">互动</span>
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 bg-neutral-100 hover:bg-rose-50 text-neutral-600 hover:text-rose-600 rounded-full transition-colors group">
                        <Heart className="w-4 h-4 group-hover:fill-rose-600" />
                      </button>
                      <button className="p-2.5 bg-neutral-100 hover:bg-indigo-50 text-neutral-600 hover:text-indigo-600 rounded-full transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2.5 bg-neutral-100 hover:bg-amber-50 text-neutral-600 hover:text-amber-600 rounded-full transition-colors group">
                        <Bookmark className="w-4 h-4 group-hover:fill-amber-600" />
                      </button>
                      <button className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-full transition-colors ml-2">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <Link href="/news" className="inline-flex items-center gap-2 font-sans-zh text-sm text-neutral-500 hover:text-neutral-900 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>返回列表</span>
                  </Link>
                </div>
              </footer>

              <nav className="mt-16 pt-8 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                {prevPage ? (
                  <Link href={prevPage.url} className="group flex flex-col gap-2 p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                    <span className="font-sans-zh text-xs text-neutral-400 tracking-wider">上一篇</span>
                    <div className="flex items-center gap-2 font-sans-zh text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="truncate">{prevPage.data.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                
                {nextPage ? (
                  <Link href={nextPage.url} className="group flex flex-col gap-2 p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors text-right relative md:col-start-2">
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                    <span className="font-sans-zh text-xs text-neutral-400 tracking-wider">下一篇</span>
                    <div className="flex items-center justify-end gap-2 font-sans-zh text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      <span className="truncate">{nextPage.data.title}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ) : (
                  <div className="md:col-start-2" />
                )}
              </nav>
            </article>
          </div>
        </div>
      </main>
    </div>
  )
}

