'use client'

import { LeftSidebar } from '@/components/LeftSidebar'

export default function HelpPage() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <LeftSidebar />
      <main className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-neutral-900">帮助中心</h1>
          <p className="text-neutral-500 mt-2">帮助页面开发中...</p>
        </div>
      </main>
    </div>
  )
}
