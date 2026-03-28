import React from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SearchSection } from './components/SearchSection'
import { QuickTags } from './components/QuickTags'
import { LeftSidebar } from '@/components/LeftSidebar'
import { EcommerceMaster } from './components/EcommerceMaster'
import { RecentProjects } from './components/RecentProjects'
import { InspirationGallery } from './components/InspirationGallery'

export function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-neutral-900">
      <LeftSidebar />

      <Header />

      <main className="w-full">
        <div className="w-full px-8">
          <div className="max-w-4xl mx-auto min-h-[200px] pt-[150px] flex flex-col justify-center">
            <Hero />

            <div className="mt-8 space-y-4">
              <SearchSection />
              <QuickTags />
            </div>
          </div>
        </div>

        <div className="w-full px-8 py-10">
          <div className="container mx-auto">
            <EcommerceMaster />

            <div id="recent-projects" className="mt-10">
              <RecentProjects />
            </div>

            <div className="mt-10">
              <InspirationGallery />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
