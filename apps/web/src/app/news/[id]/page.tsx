import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2, Link as LinkIcon, ArrowRight, MessageCircle, Heart, Bookmark } from 'lucide-react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// This would typically come from an API/CMS
const MOCK_NEWS_DATA = {
  title: 'Joii v1.1.0 重磅发布：全新智能换装模型与高清放大功能上线',
  date: '2026-04-05',
  category: '产品更新',
  readTime: '3 分钟阅读',
  content: `
    <p class="lead">在最新版本的 Joii 中，我们引入了基于最前沿大模型技术的智能换装功能，不仅贴合度提升了300%，还支持最高 4K 的无损放大，为电商商品图提供直接商用的画质保证。</p>
    
    <h2>1. 智能换装模型 2.0</h2>
    <p>电商服装商家面临的最大痛点之一就是模特图拍摄成本高、周期长。Joii v1.1.0 带来的全新智能换装模型完美解决了这个问题。</p>
    <p>我们的算法团队重写了底层 ControlNet 逻辑，现在 AI 能够精准识别服装的材质（如丝绸、针织、牛仔等），并在换装时自动计算自然的光影褶皱。这意味着：</p>
    <ul>
      <li><strong>物理级贴合</strong>：告别生硬的"贴图感"，衣服自然下垂贴合人体曲线。</li>
      <li><strong>光影一致性</strong>：自动匹配原图环境光，衣服高光和阴影完美融入。</li>
      <li><strong>一键操作</strong>：无需复杂蒙版，选中图层一键应用。</li>
    </ul>

    <div class="image-placeholder">
      <div class="visual">换装效果对比图演示区域</div>
      <p class="caption">图 1：旧版模型与 v1.1.0 新版模型换装细节对比</p>
    </div>

    <h2>2. 4K 级无损高清放大</h2>
    <p>为了满足电商详情页和主图的严苛要求，我们在这此更新中加入了 AI 图像超分技术。现在，所有的生成结果都可以一键无损放大至 4K 分辨率。</p>
    <p>这不仅仅是简单的像素拉伸，AI 会在放大的同时智能补充纹理细节，让布料纹理、五官细节在放大后依然清晰锐利。</p>

    <h2>3. 交互体验优化</h2>
    <p>除了核心能力的提升，我们还听取了社区的反馈，对无限画布的交互进行了多项优化：</p>
    <ul>
      <li>支持按住 Space 键加鼠标拖拽平移画布</li>
      <li>优化了图层面板的拖拽排序手感</li>
      <li>新增了深色模式（Dark Mode）的初步支持</li>
    </ul>

    <blockquote>
      "Joii v1.1.0 是我们迈向专业级 AIGC 电商设计工具的重要一步。我们希望通过技术的进步，让每一位电商设计师都能享受到 AI 带来的生产力飞跃。" —— Joii 产品团队
    </blockquote>

    <h2>下一步计划</h2>
    <p>我们已经在紧锣密鼓地筹备下一个大版本，重点将放在“批量处理”和“团队协作”上。敬请期待！</p>
  `
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return {
    title: `${MOCK_NEWS_DATA.title} - Joii 新闻动态`,
    description: MOCK_NEWS_DATA.content.substring(0, 150).replace(/<[^>]*>?/gm, ''),
  }
}

export function generateStaticParams() {
  // Return the known news IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ]
}

export default function NewsDetailPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pl-20 relative">
        
        {/* Header */}
        <header className="w-full h-14 flex items-center justify-between px-8 sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200/50">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center">
                  <img src="/joii_logo_fa.svg" alt="LOGO" className="h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/news">新闻动态</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>新闻详情</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors" title="分享">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>



        <article className="max-w-[720px] mx-auto mt-16 px-8 lg:px-0">
          {/* Article Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              {MOCK_NEWS_DATA.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-8 leading-[1.15]">
              {MOCK_NEWS_DATA.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm font-medium text-neutral-500 border-y border-neutral-200/60 py-4">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={MOCK_NEWS_DATA.date}>{MOCK_NEWS_DATA.date}</time>
              </span>
              <span className="before:content-['·'] before:mr-6 before:text-neutral-300">
                {MOCK_NEWS_DATA.readTime}
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg prose-neutral max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-900
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
              prose-li:text-neutral-600 prose-li:my-2
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:text-indigo-900 prose-blockquote:not-italic prose-blockquote:font-medium
              prose-strong:text-neutral-900
              
              /* Custom lead paragraph */
              [&_.lead]:text-xl [&_.lead]:text-neutral-800 [&_.lead]:font-medium [&_.lead]:leading-relaxed [&_.lead]:mb-10
              
              /* Custom image placeholder */
              [&_.image-placeholder]:my-12 [&_.image-placeholder]:w-full
              [&_.image-placeholder_.visual]:w-full [&_.image-placeholder_.visual]:h-[400px] [&_.image-placeholder_.visual]:bg-neutral-100 [&_.image-placeholder_.visual]:rounded-3xl [&_.image-placeholder_.visual]:flex [&_.image-placeholder_.visual]:items-center [&_.image-placeholder_.visual]:justify-center [&_.image-placeholder_.visual]:text-neutral-400 [&_.image-placeholder_.visual]:border [&_.image-placeholder_.visual]:border-neutral-200/60
              [&_.image-placeholder_.caption]:text-sm [&_.image-placeholder_.caption]:text-center [&_.image-placeholder_.caption]:text-neutral-400 [&_.image-placeholder_.caption]:mt-4 [&_.image-placeholder_.caption]:mb-0
            "
            dangerouslySetInnerHTML={{ __html: MOCK_NEWS_DATA.content }}
          />

          {/* Article Footer & Share */}
          <footer className="mt-16 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-neutral-900">互动</span>
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
            
            <div className="flex items-center gap-3">
              <Link href="/news/2" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                下一篇：电商大促备战指南...
              </Link>
              <ArrowRight className="w-4 h-4 text-neutral-400" />
            </div>
          </footer>
        </article>
      </main>
    </div>
  )
}
