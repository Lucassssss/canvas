import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center">
            <img src="/joii_logo_fa.svg" alt="Joii" className="h-6 invert" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-neutral-400">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#showcase" className="hover:text-white transition-colors">Showcase</Link>
            <Link href="/news" className="hover:text-white transition-colors">Updates</Link>
            <Link href="/help" className="hover:text-white transition-colors">Support</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-950 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors">
            Start Free
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </header>
  )
}
