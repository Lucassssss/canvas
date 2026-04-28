import React from 'react'
import { BrowserNavbar } from './components/BrowserNavbar'
import { BrowserHero } from './components/BrowserHero'
import { BrowserFeatures } from './components/BrowserFeatures'
import { BrowserSocialProof } from './components/BrowserSocialProof'
import { BrowserContact } from './components/BrowserContact'
import { BrowserFooter } from './components/BrowserFooter'

export function BrowserLandingPage() {
  return (
    <div className="min-h-screen w-full bg-white text-neutral-950 font-sans overflow-x-hidden selection:bg-[#2B7FFF]/20 selection:text-[#2B7FFF]">
      <BrowserNavbar />
      
      <main className="w-full pt-16 md:pt-20">
        <BrowserHero />
        <BrowserFeatures />
        <BrowserSocialProof />
        <BrowserContact />
      </main>

      <BrowserFooter />
    </div>
  )
}
