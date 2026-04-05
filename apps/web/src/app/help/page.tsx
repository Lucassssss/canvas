import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import Link from 'next/link'
import { ArrowLeft, Book, HelpCircle, Mail, MessageCircle, PlayCircle, Search, ChevronRight, FileText, LayoutDashboard, Wand2, ArrowRight } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: '帮助中心 - Joii 无限画布智能设计平台',
  description: 'Joii 帮助中心为您提供电商AI设计工具的使用教程、常见问题解答(FAQ)以及设计技巧，助您快速上手无限画布，提升设计效率。',
  keywords: 'Joii帮助中心, AI设计教程, 无限画布使用指南, 电商设计FAQ, Joii客服, 智能设计工具',
}

const FAQ_ITEMS = [
  {
    question: 'Joii 支持哪些格式的图片导出？',
    answer: 'Joii 目前支持导出 PNG、JPEG 和 WebP 格式的高清图片。在设计完成后，点击右上角的导出按钮即可选择您需要的格式和分辨率。对于付费用户，还支持无损放大导出。',
  },
  {
    question: '如何使用 AI 一键换装功能？',
    answer: '在画布中选中任意包含人物的图层，点击右侧属性栏的"智能换装"图标。您可以上传本地服装图片或使用系统提供的服装素材，AI 会自动识别并完成贴合、光影融合等一系列操作。',
  },
  {
    question: '我的积分如何计算？如果生成失败会扣除积分吗？',
    answer: '每次成功调用 AI 生成能力（如图片生成、换装等）会扣除相应积分。如果因为系统原因导致生成失败，积分会自动退还到您的账户。网络原因或用户主动取消不会扣除积分。',
  },
  {
    question: '免费用户和专业版(Pro)用户有什么区别？',
    answer: '免费用户每日享有基础生成次数，适合轻量级设计需求。专业版用户则享有优先生成队列、更多单日生成次数、无损放大以及专属的高级 AI 模型权限，极大地提升商用设计效率。',
  },
]

const GUIDES = [
  {
    title: '快速入门指南',
    desc: '5分钟了解 Joii 的核心功能与画布操作基础。',
    icon: <PlayCircle className="w-5 h-5" />,
    href: '#',
  },
  {
    title: '电商爆款图设计',
    desc: '学习如何使用 AI 结合排版生成高转化率商品主图。',
    icon: <Book className="w-5 h-5" />,
    href: '#',
  },
  {
    title: '高级提示词(Prompt)技巧',
    desc: '掌握与 AI 沟通的语言，生成精准符合预期的素材。',
    icon: <MessageCircle className="w-5 h-5" />,
    href: '#',
  },
]

const SIDEBAR_NAV = [
  {
    title: '入门指南',
    icon: <PlayCircle className="w-4 h-4" />,
    items: ['快速开始', '界面概览', '快捷键大全', '账号与订阅']
  },
  {
    title: '核心功能',
    icon: <LayoutDashboard className="w-4 h-4" />,
    items: ['无限画布', '图层管理', '素材库', '导出与分享']
  },
  {
    title: 'AI 魔法工具',
    icon: <Wand2 className="w-4 h-4" />,
    items: ['AI 一键换装', '智能消除与修复', '背景生成', '高清无损放大']
  },
  {
    title: '常见问题',
    icon: <HelpCircle className="w-4 h-4" />,
    items: ['计费与退款', '生成失败排查', '版权说明', '隐私政策']
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex">
      <LeftSidebar />
      <main className="flex-1 w-full flex flex-col md:pl-20">
        {/* Header */}
        <header className="w-full h-14 shrink-0 flex items-center justify-between px-8 sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-200/50">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="flex items-center">
                  <img src="/joii_logo_fa.svg" alt="LOGO" className="h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>帮助中心</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索帮助文档..." 
                className="w-64 h-9 pl-9 pr-4 bg-white border border-neutral-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-neutral-900/5 transition-all focus:w-80"
              />
            </div>
          </div>
        </header>

        {/* Layout Wrapper */}
        <div className="flex-1 flex w-full">
          
          {/* Documentation Tree (Left) */}
          <aside className="w-64 shrink-0 border-r border-neutral-200/50 bg-neutral-50/50 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14 hidden md:block">
            <div className="p-6 space-y-8">
              {SIDEBAR_NAV.map((section, idx) => (
                <div key={idx}>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 mb-3 px-2">
                    {section.icon}
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <a 
                          href="#" 
                          className="flex items-center text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 px-2 py-1.5 rounded-md transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto h-[calc(100vh-3.5rem)]">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row w-full">
              {/* Documentation Content (Center) */}
              <div className="flex-1 p-8 lg:p-12">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-sm font-medium mb-6">
                  <FileText className="w-4 h-4" />
                  常见问题
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">
                  常见问题解答
                </h1>
                <p className="text-lg text-neutral-500">
                  了解关于计费、导出、AI生成等常见问题的解答。
                </p>
              </div>

              <div className="space-y-8">
                {FAQ_ITEMS.map((item, idx) => (
                  <article key={idx} className="group">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 flex items-start gap-3">
                      <span className="text-neutral-300 mt-1">Q.</span>
                      {item.question}
                    </h3>
                    <div className="pl-8">
                      <p className="text-neutral-600 leading-relaxed text-base">
                        {item.answer}
                      </p>
                    </div>
                    {idx < FAQ_ITEMS.length - 1 && (
                      <div className="h-px w-full bg-neutral-100 mt-8" />
                    )}
                  </article>
                ))}
              </div>
            </div>

            {/* Widgets Sidebar (Right) */}
            <aside className="w-full lg:w-80 shrink-0 lg:border-l border-neutral-200/50 p-8 lg:p-12">
              <div className="space-y-10">
                {/* Guides */}
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-5">
                    热门教程
                  </h3>
                  <div className="space-y-5">
                    {GUIDES.map((guide, idx) => (
                      <a key={idx} href={guide.href} className="group block">
                        <div className="flex gap-4">
                          <div className="shrink-0 p-2.5 bg-neutral-50 rounded-xl text-neutral-400 group-hover:text-neutral-900 group-hover:bg-neutral-100 transition-colors">
                            {guide.icon}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors mb-1">
                              {guide.title}
                            </h4>
                            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                              {guide.desc}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-neutral-900 p-6 rounded-2xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <h3 className="text-lg font-semibold mb-2 relative z-10">
                    需要人工帮助？
                  </h3>
                  <p className="text-sm text-neutral-400 mb-6 relative z-10">
                    如果您无法在帮助中心找到答案，请随时联系我们的技术支持团队。
                  </p>
                  <a href="mailto:support@joii.ai" className="relative z-10 inline-flex items-center justify-between w-full px-4 py-3 bg-white text-neutral-900 rounded-xl text-sm font-semibold hover:bg-neutral-100 transition-colors">
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      联系客服
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </a>
                </div>
              </div>
            </aside>
            
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}