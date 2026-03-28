import React from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { SearchSection } from './components/SearchSection'
import { QuickTags } from './components/QuickTags'
import { RecentProjects } from './components/RecentProjects'
import { InspirationGallery } from './components/InspirationGallery'
import { FeaturesSection } from './components/FeaturesSection'
import { StatsSection } from './components/StatsSection'
import { Footer } from './components/Footer'

interface HomePageProps {
  onEnterCanvas?: () => void
}

export const HomePage: React.FC<HomePageProps> = ({ onEnterCanvas }) => {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-neutral-900">
      <Header onEnterCanvas={onEnterCanvas} />
      
      <main className="w-full">
        <div className="w-full px-8">
          <div className="max-w-4xl mx-auto min-h-[600px] flex flex-col justify-center ">
            <Hero />
            
            <div className="mt-8">
              <SearchSection />
            </div>
          </div>
        </div>
        
        <div className="w-full px-8 py-10 container mx-auto px-6">
          <QuickTags />
          
          <div className="mt-10">
            <RecentProjects onEnterCanvas={onEnterCanvas} />
          </div>

          <div className="mt-10">
            <InspirationGallery />
          </div>

          <div className="mt-10">
            <FeaturesSection />
          </div>

          <div className="mt-10">
            <StatsSection />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
