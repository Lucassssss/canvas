import React from 'react'
import Link from 'next/link'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { FeatureSection } from './components/FeatureSection'
import { ShowcaseSection } from './components/ShowcaseSection'
import { NewsSection } from './components/NewsSection'
import { Footer } from './components/Footer'
import { ArrowRight } from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="w-full">
        <HeroSection />
        <FeatureSection />
        <ShowcaseSection />
        <NewsSection />

        {/* Call to Action Section - Brutalist / Minimalist */}
        <section className="py-40 px-6 bg-black relative overflow-hidden border-t border-white/5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-12 leading-[0.9]">
              START <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">CREATING</span><br />
              <span className="font-serif italic font-light text-neutral-400">today.</span>
            </h2>
            <Link 
              href="/dashboard" 
              className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-neutral-950 rounded-full text-xl font-black uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Launch Joii</span>
              <ArrowRight className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
