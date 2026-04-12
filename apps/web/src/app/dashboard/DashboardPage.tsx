import React from 'react'
import { Header } from './components/Header'
import { ChatSection } from './components/ChatSection'

import { LeftSidebar } from '@/components/LeftSidebar'
import { EcommerceMaster } from './components/EcommerceMaster'
import { RecentProjects } from './components/RecentProjects'
import { InspirationGallery } from './components/InspirationGallery'

export function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-[#f4f4f5]">
      <LeftSidebar />

      <Header />

      <main className="w-full pb-20 lg:pl-20">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
                Joii AI
              </div>
              <h1 className="font-serif-display text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-3">
                素材无忧，爆单不愁<span className="font-sans-zh font-extralight italic text-neutral-400">.</span>
              </h1>
              <p className="font-sans-zh text-sm md:text-base text-neutral-500 max-w-lg leading-relaxed">
                Joii 电商 AI 神器，让爆单轻松发生
              </p>
            </div>

            <div className="w-full max-w-2xl mb-6">
              <ChatSection />
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pb-12">
          <div className="space-y-12">
            <EcommerceMaster />
            <RecentProjects />
            <InspirationGallery />
          </div>
        </div>
      </main>
    </div>
  )
}
