'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroCanvas } from './HeroCanvas'
import { useAuth } from '@/features/auth/useAuth'

export function HeroSectionCN() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <section className="relative overflow-hidden text-neutral-950 mt-20">
      <div className="absolute top-0 right-0 w-1/2 bottom-0 bg-neutral-100/50" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative">
        <div className="grid grid-cols-12 gap-6 lg:gap-12 items-stretch">
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-between min-h-[auto] lg:min-h-[800px] pt-12 lg:pt-0">
            <div className="pt-12 md:pt-32">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-8">
                电商视觉 AI 革命
              </div>

              <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight mb-6">
                <span className="block">真实</span>
                <span className="block font-sans-zh font-extralight text-neutral-500">质感</span>
                <span className="block">极速测款</span>
              </h1>

              <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-md leading-relaxed">
                告别“一眼假”的 AI 塑料感。100% 保留衣物真实面料与垂坠感，拒绝退货纠纷。零成本极速测款，帮助店铺抢占流量先机。
              </p>

              <div className="flex items-center gap-4 mt-8">
                {mounted && isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-950 text-white font-sans-zh font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors"
                  >
                    <span>进入工作台</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-950 text-white font-sans-zh font-medium text-sm tracking-wide hover:bg-neutral-800 transition-colors"
                  >
                    <span>免费注册 · 领 1000 积分</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <div className="flex flex-col gap-1">
                  {/* <span className="text-xs font-sans-zh text-neutral-400 tracking-wider">
                    v1.1.0 现已发布
                  </span> */}
                  {/* <span className="text-[10px] font-sans-zh text-neutral-400/80 tracking-wider">
                    已支持微信 / 支付宝
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 h-[500px] lg:min-h-[800px] relative mt-12 lg:mt-0">
            <HeroCanvas className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-12 items-stretch border-t border-neutral-200">
          <div className="col-span-12 lg:col-span-6 py-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-sans-zh font-medium text-xl md:text-2xl text-neutral-950 mb-2">面料级保真</div>
                <div className="font-sans-zh text-xs text-neutral-500 tracking-wide leading-relaxed">精准锁定原图服饰纹理与光影，解决AI换模导致的退货差异。</div>
              </div>
              <div>
                <div className="font-sans-zh font-medium text-xl md:text-2xl text-neutral-950 mb-2">跨模全肤色</div>
                <div className="font-sans-zh text-xs text-neutral-500 tracking-wide leading-relaxed">提供欧美、日韩等多地模特骨架，无缝适配跨境出海需求。</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 py-12">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="font-sans-zh font-medium text-xl md:text-2xl text-neutral-950 mb-2">极速秒测款</div>
                <div className="font-sans-zh text-xs text-neutral-500 tracking-wide leading-relaxed">告别模特排期限制。仅需平铺图，几分钟完成全店上新视觉铺货。</div>
              </div>
              <div>
                <div className="font-sans-zh font-medium text-xl md:text-2xl text-neutral-950 mb-2">4K 商业直出</div>
                <div className="font-sans-zh text-xs text-neutral-500 tracking-wide leading-relaxed">满足严苛电商的高清画质要求，直接可用作淘宝、小红书主图。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
