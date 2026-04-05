import { Metadata } from 'next'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import { Search } from 'lucide-react'
import { HelpContent } from './HelpContent'

export const metadata: Metadata = {
  title: '帮助中心 - Joii 无限画布智能设计平台',
  description: 'Joii 帮助中心为您提供电商AI设计工具的使用教程、常见问题解答(FAQ)以及设计技巧，助您快速上手无限画布，提升设计效率。',
  keywords: 'Joii帮助中心, AI设计教程, 无限画布使用指南, 电商设计FAQ, Joii客服, 智能设计工具',
}

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pl-20">
        <PageHeader 
          breadcrumbs={[{ label: '帮助中心' }]}
          rightContent={
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="搜索帮助文档..." 
                className="w-64 h-10 pl-10 pr-4 bg-neutral-100 border-0 rounded-full font-sans-zh text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all focus:bg-white focus:w-80"
              />
            </div>
          }
        />

        <HelpContent />
      </main>
    </div>
  )
}
