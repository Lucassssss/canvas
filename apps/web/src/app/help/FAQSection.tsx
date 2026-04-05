'use client'

import { useState } from 'react'
import { ChevronDown, Minus } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  items: FAQItem[]
  title: string
}

export function FAQSection({ items, title }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mb-16">
      <h2 className="font-serif-display text-2xl md:text-3xl text-neutral-950 mb-8 tracking-tight">
        {title}
      </h2>
      <div className="space-y-0 border-t border-neutral-200">
        {items.map((item, index) => (
          <div key={index} className="border-b border-neutral-200">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between py-6 text-left group"
            >
              <span className="font-sans-zh text-base md:text-lg text-neutral-900 group-hover:text-neutral-600 transition-colors pr-8">
                {item.question}
              </span>
              <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 group-hover:border-neutral-400 transition-all ${openIndex === index ? 'bg-neutral-950 text-white border-neutral-950 rotate-180' : 'text-neutral-400'}`}>
                <ChevronDown className="w-4 h-4" />
              </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 pb-6' : 'max-h-0'}`}>
              <div className="pl-4 border-l-2 border-neutral-200">
                <p className="font-sans-zh text-sm md:text-base text-neutral-500 leading-loose">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface GuideCardProps {
  title: string
  desc: string
  index: string
  href: string
}

export function GuideCard({ title, desc, index, href }: GuideCardProps) {
  return (
    <a href={href} className="group block p-6 bg-white border border-neutral-200 hover:border-neutral-400 transition-colors relative">
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neutral-200 group-hover:border-neutral-400 transition-colors" />
      <div className="font-mono text-xs text-neutral-300 mb-4">{index}</div>
      <h3 className="font-serif-zh text-lg font-medium text-neutral-950 mb-2 group-hover:text-neutral-600 transition-colors">
        {title}
      </h3>
      <p className="font-sans-zh text-sm text-neutral-500 leading-relaxed line-clamp-2">
        {desc}
      </p>
      <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <span className="font-sans-zh text-xs text-neutral-400">阅读更多</span>
        <span className="font-sans-zh text-xs text-neutral-400 group-hover:text-neutral-900 transition-colors">→</span>
      </div>
    </a>
  )
}
