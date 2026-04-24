import React from 'react'

export function BrowserShowcase() {
  const cases = [
    { number: '01', title: '物理防关联：独立 Canvas/WebGL 硬件指纹', type: '底层环境隔离' },
    { number: '02', title: '纯净专线：避免环境污染，精准引流', type: '网络代理' },
    { number: '03', title: '协同管理：分级授权，日志全景追溯', type: '团队协同' },
    { number: '04', title: '自动化引擎：告别手动点击，自动养号', type: '效率提升' }
  ]

  return (
    <section id="showcase" className="py-24 md:py-32 bg-white text-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-6">
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl">
              让运营<br />
              <span className="font-sans-zh font-extralight text-neutral-400">专注增长</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:text-right">
            <p className="font-sans-zh text-neutral-500 max-w-md ml-auto">
              不再为封号提心吊胆，不再被繁琐的配置拖累。现代化的极简控制台，让团队把精力花在能带来利润的地方。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {cases.map((item) => (
            <div key={item.number} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 md:mb-6 bg-neutral-50 border border-neutral-100 overflow-hidden flex flex-col">
                <div className="absolute top-4 left-4 w-8 h-8 border border-neutral-200 flex items-center justify-center font-mono text-[10px] text-[#2B7FFF] bg-white font-bold z-10">
                  {item.number}
                </div>
                
                {/* 抽象 UI 骨架图 */}
                <div className="mt-16 mx-4 flex-1 border border-neutral-200 border-b-0 bg-white rounded-t-lg p-3 flex flex-col gap-2 relative">
                  <div className="h-4 w-1/3 bg-neutral-100 rounded"></div>
                  <div className="h-2 w-full bg-neutral-100 rounded mt-2"></div>
                  <div className="h-2 w-5/6 bg-neutral-100 rounded"></div>
                  <div className="h-2 w-4/6 bg-neutral-100 rounded"></div>
                  
                  {item.number === '01' && (
                    <div className="absolute inset-x-3 bottom-0 h-1/2 bg-gradient-to-t from-neutral-100 to-transparent"></div>
                  )}
                  {item.number === '02' && (
                    <div className="absolute inset-x-3 bottom-4 h-1/3 border-t-2 border-[#2B7FFF]/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-[#2B7FFF]/30 flex items-center justify-center">
                         <div className="w-2 h-2 rounded-full bg-[#2B7FFF] animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="font-serif-zh text-base md:text-lg font-medium mb-1">{item.title}</h3>
              <p className="font-sans-zh text-xs text-neutral-400 tracking-wider">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
