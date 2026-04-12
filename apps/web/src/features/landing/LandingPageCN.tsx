import React, { Suspense } from 'react'
import Link from 'next/link'
import { NavbarCN } from './components/NavbarCN'
import { HeroSectionCN } from './components/HeroSectionCN'
import { FeatureSectionCN } from './components/FeatureSectionCN'
import { ShowcaseSectionCN } from './components/ShowcaseSectionCN'
import { NewsSectionCN } from './components/NewsSectionCN'
import { FooterCN } from './components/FooterCN'
import { ArrowRight } from 'lucide-react'

const NavbarFallback: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
    <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center">
          <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link href="/login" className="font-sans-zh text-sm text-neutral-500 hover:text-neutral-950 transition-colors hidden md:block">
          登录 / 注册
        </Link>
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 text-white font-sans-zh text-sm hover:bg-neutral-800 transition-colors">
          <span>领 1000 积分</span>
        </Link>
      </div>
    </div>
  </header>
)

export function LandingPageCN() {
  return (
    <div className="min-h-screen w-full bg-white text-neutral-950 font-sans overflow-x-hidden">
      <Suspense fallback={<NavbarFallback />}>
        <NavbarCN />
      </Suspense>

      <main className="w-full">
        <HeroSectionCN />
        <FeatureSectionCN />
        <ShowcaseSectionCN />
        <NewsSectionCN />

        <section className="py-24 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-7xl tracking-tight mb-8">
              引爆<br />
              <span className="font-sans-zh font-extralight text-neutral-500">利润</span><br />
              增长
            </h2>
            <p className="font-sans-zh text-neutral-500 mb-12 max-w-md mx-auto">
              加入 500+ 出海与内销头部卖家的行列，彻底告别高昂场地模特费，将商品视觉转化为销冠引擎。
            </p>
            <Link 
              href="/dashboard" 
              className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-neutral-950 font-sans-zh font-medium text-sm hover:bg-neutral-100 transition-colors"
            >
              <span>立即注册 · 领 1000 积分</span>
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
