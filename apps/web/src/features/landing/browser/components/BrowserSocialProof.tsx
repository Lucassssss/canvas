import React from 'react'

export function BrowserSocialProof() {
  return (
    <section className="py-24 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2B7FFF]/5 border-l border-[#2B7FFF]/10 skew-x-12 translate-x-20"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-center">
          <div className="col-span-12 lg:col-span-4 mb-12 lg:mb-0">
            <h2 className="font-serif-display text-4xl md:text-5xl leading-tight mb-6">
              被聪明的<br />
              <span className="text-[#2B7FFF]">大卖</span><br />
              所信赖
            </h2>
            <p className="font-sans-zh text-neutral-400 text-sm leading-relaxed max-w-sm">
              我们相信基础设施应该是免费的。把省下来的工具月租费，投入到更关键的选品和流量获取中去。
            </p>
          </div>
          
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors group">
                <div className="text-4xl font-serif-display text-neutral-600 mb-4 group-hover:text-[#2B7FFF] transition-colors">"</div>
                <p className="font-sans-zh text-neutral-300 text-sm leading-relaxed mb-8">
                  以前用的某鸟浏览器，多开限制极严，自己配的IP还要单独交一笔“设备添加费”。换到浆果之后，不限多开，不收设备费，每年硬生生省下了大几千的冤枉钱。
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-serif-display font-bold text-neutral-400">王</div>
                  <div>
                    <div className="font-sans-zh font-bold text-sm">王先生</div>
                    <div className="font-sans-zh text-xs text-neutral-500">深圳资深亚马逊精品大卖</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors group mt-0 md:mt-12">
                <div className="text-4xl font-serif-display text-neutral-600 mb-4 group-hover:text-[#2B7FFF] transition-colors">"</div>
                <p className="font-sans-zh text-neutral-300 text-sm leading-relaxed mb-8">
                  防关联效果确实能打，矩阵号存活率很高。最关键的是，它是用来给 Joii 导流的基础工具，所以对我们跨境电商卖家来说几乎就是全免费的福利，良心产品。
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-serif-display font-bold text-neutral-400">L</div>
                  <div>
                    <div className="font-sans-zh font-bold text-sm">Liya</div>
                    <div className="font-sans-zh text-xs text-neutral-500">TikTok 独立站站群操盘手</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
