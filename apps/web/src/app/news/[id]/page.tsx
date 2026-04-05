import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import Link from 'next/link'
import { ArrowLeft, Calendar, Share2, Link as LinkIcon, ArrowRight, MessageCircle, Heart, Bookmark } from 'lucide-react'

const NEWS_ITEMS = [
  {
    id: 1,
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
        <li>物理级贴合：告别生硬的"贴图感"，衣服自然下垂贴合人体曲线。</li>
        <li>光影一致性：自动匹配原图环境光，衣服高光和阴影完美融入。</li>
        <li>一键操作：无需复杂蒙版，选中图层一键应用。</li>
      </ul>

      <div class="image-placeholder">
        <div class="visual">
          <span class="font-serif-display text-4xl text-neutral-300">01</span>
          <span class="mt-4 text-sm text-neutral-400">换装效果对比图演示区域</span>
        </div>
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
      <p>我们已经在紧锣密鼓地筹备下一个大版本，重点将放在"批量处理"和"团队协作"上。敬请期待！</p>
    `
  },
  {
    id: 2,
    title: '电商大促备战指南：如何用 Joii 一天生成 1000 张爆款主图',
    date: '2026-03-20',
    category: '设计干货',
    readTime: '5 分钟阅读',
    content: `
      <p class="lead">618即将来临，电商视觉设计团队面临巨大压力。本文将详细拆解如何利用 Joii 的无限画布组合批量生成能力，配合精准的 Prompt 词，实现高转化率商品图的量产。</p>
      
      <h2>准备工作</h2>
      <p>在开始批量生成之前，需要做好以下准备：收集参考图、整理产品卖点、编写基础 Prompt 模板。</p>
      
      <h2>批量生成流程</h2>
      <p>使用 Joii 的组合功能，可以同时处理多组商品图，大大提升工作效率。</p>
    `
  },
  {
    id: 3,
    title: '从提示词到成品：解密 Joii "图生图" 背后的光影重构技术',
    date: '2026-01-10',
    category: '技术专栏',
    readTime: '8 分钟阅读',
    content: `
      <p class="lead">很多用户好奇为什么 Joii 生成的商品图在光影表现上如此真实。今天我们的算法团队将为您深入浅出地讲解我们在 ControlNet 和光照模型上做出的独家优化。</p>
      
      <h2>光影重构原理</h2>
      <p>Joii 采用自主研发的光照估计算法，能够精准分析输入图像的光源方向、强度和色温。</p>
    `
  },
  {
    id: 4,
    title: 'Joii 完成千万级 A 轮融资，加速布局 AIGC 电商设计基础设施',
    date: '2026-02-15',
    category: '公司动态',
    readTime: '2 分钟阅读',
    content: `
      <p class="lead">本轮融资由知名投资机构领投。资金将主要用于底层大模型的持续优化、核心技术团队扩充以及开拓更多垂直电商领域的 AI 应用场景。</p>
      
      <h2>融资详情</h2>
      <p>本轮融资金额达数千万元，将助力 Joii 在 AIGC 电商设计领域继续深耕。</p>
    `
  }
]

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  const news = NEWS_ITEMS.find(n => n.id === id) || NEWS_ITEMS[0]
  
  return {
    title: `${news.title} - Joii 新闻动态`,
    description: `${news.title} - ${news.category}`,
  }
}

export function generateStaticParams() {
  return NEWS_ITEMS.map(n => ({ id: String(n.id) }))
}

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <NewsDetailContent params={params} />
}

async function NewsDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  const news = NEWS_ITEMS.find(n => n.id === id) || NEWS_ITEMS[0]
  const currentIndex = NEWS_ITEMS.findIndex(n => n.id === id)
  const prevNews = currentIndex > 0 ? NEWS_ITEMS[currentIndex - 1] : null
  const nextNews = currentIndex < NEWS_ITEMS.length - 1 ? NEWS_ITEMS[currentIndex + 1] : null

  return (
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pb-24 lg:pb-32 md:pl-20">
        <PageHeader 
          breadcrumbs={[
            { label: '新闻动态', href: '/news' },
            { label: '详情' }
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
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-neutral-200 -translate-x-6 md:-translate-x-12" />
              
              <header className="mb-12 md:mb-16 pt-8">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-xs text-neutral-400">{String(currentIndex + 1).padStart(2, '0')}</span>
                  <span className="font-sans-zh text-xs text-neutral-500 tracking-wider uppercase">{news.category}</span>
                  <span className="font-sans-zh text-xs text-neutral-400 ml-auto">{news.date}</span>
                </div>
                
                <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-950 mb-8 leading-[1.1]">
                  {news.title}
                </h1>
                
                <div className="flex items-center gap-6 font-sans-zh text-sm text-neutral-500 border-y border-neutral-200 py-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={news.date}>{news.date}</time>
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span>{news.readTime}</span>
                </div>
              </header>

              <div 
                className="font-sans-zh text-base md:text-lg text-neutral-600
                  [&_h2]:font-serif-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-neutral-950 [&_h2]:mt-16 [&_h2]:mb-8 [&_h2]:tracking-tight
                  [&_p]:mb-6 [&_p]:leading-loose
                  [&_ul]:mb-6 [&_ul]:space-y-3
                  [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-neutral-400 [&_li]:before:content-['—']
                  
                  [&_.lead]:text-xl [&_.lead]:md:text-2xl [&_.lead]:text-neutral-800 [&_.lead]:font-medium [&_.lead]:leading-relaxed [&_.lead]:mb-12 [&_.lead]:py-8 [&_.lead]:border-y [&_.lead]:border-neutral-200
                  
                  [&_.image-placeholder]:my-12 [&_.image-placeholder]:w-full
                  [&_.image-placeholder_.visual]:w-full [&_.image-placeholder_.visual]:h-[400px] [&_.image-placeholder_.visual]:bg-neutral-100 [&_.image-placeholder_.visual]:flex [&_.image-placeholder_.visual]:flex-col [&_.image-placeholder_.visual]:items-center [&_.image-placeholder_.visual]:justify-center [&_.image-placeholder_.visual]:text-neutral-400 [&_.image-placeholder_.visual]:border [&_.image-placeholder_.visual]:border-neutral-200
                  [&_.image-placeholder_.caption]:text-sm [&_.image-placeholder_.caption]:text-center [&_.image-placeholder_.caption]:text-neutral-400 [&_.image-placeholder_.caption]:mt-4
                  
                  [&_blockquote]:my-12 [&_blockquote]:p-8 [&_blockquote]:bg-neutral-100 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-950 [&_blockquote]:rounded-r-lg [&_blockquote]:text-neutral-700 [&_blockquote]:italic [&_blockquote]:leading-relaxed
                "
                dangerouslySetInnerHTML={{ __html: news.content }}
              />

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
                {prevNews ? (
                  <Link href={`/news/${prevNews.id}`} className="group flex flex-col gap-2 p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                    <span className="font-sans-zh text-xs text-neutral-400 tracking-wider">上一篇</span>
                    <div className="flex items-center gap-2 font-sans-zh text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="truncate">{prevNews.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                
                {nextNews ? (
                  <Link href={`/news/${nextNews.id}`} className="group flex flex-col gap-2 p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors text-right relative md:col-start-2">
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
                    <span className="font-sans-zh text-xs text-neutral-400 tracking-wider">下一篇</span>
                    <div className="flex items-center justify-end gap-2 font-sans-zh text-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      <span className="truncate">{nextNews.title}</span>
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
