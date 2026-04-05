import React from 'react'
import Link from 'next/link'
import { NavbarCN } from './components/NavbarCN'
import { HeroSectionCN } from './components/HeroSectionCN'
import { FeatureSectionCN } from './components/FeatureSectionCN'
import { ShowcaseSectionCN } from './components/ShowcaseSectionCN'
import { NewsSectionCN } from './components/NewsSectionCN'
import { FooterCN } from './components/FooterCN'
import { ArrowRight } from 'lucide-react'

export function LandingPageCN() {
  return (
    <div className="min-h-screen w-full bg-white text-neutral-950 font-sans overflow-x-hidden">
      <NavbarCN />

      <main className="w-full">
        <HeroSectionCN />
        <FeatureSectionCN />
        <ShowcaseSectionCN />
        <NewsSectionCN />

        <section className="py-24 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-7xl tracking-tight mb-8">
              开始<br />
              <span className="font-sans-zh font-extralight text-neutral-400">创作</span><br />
              今日
            </h2>
            <p className="font-sans-zh text-neutral-400 mb-12 max-w-md mx-auto">
              体验 Joii 带来的电商视觉革命，让每一帧都成为可能
            </p>
            <Link 
              href="/dashboard" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-neutral-950 font-sans-zh font-medium text-sm hover:bg-neutral-100 transition-colors"
            >
              <span>启动 Joii</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />
        </section>
      </main>

      <FooterCN />
    </div>
  )
}
