import React from 'react'
import { LeftSidebar } from '../components/LeftSidebar'
import { Header } from '../features/home/components/Header'

export const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-neutral-900">
      <LeftSidebar />
      <Header />
      <main className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-neutral-900">帮助中心</h1>
          <p className="text-neutral-500 mt-2">帮助页面开发中...</p>
        </div>
      </main>
    </div>
  )
}
