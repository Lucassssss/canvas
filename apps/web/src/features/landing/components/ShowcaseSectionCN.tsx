import { ArrowRight } from 'lucide-react'

const cases = [
  { 
    title: 'TikTok / Shein 风格女装', 
    type: '跨境出海', 
    number: '01',
    img: 'bg-gradient-to-br from-neutral-200 to-neutral-300',
    url: 'https://d-assets-cn.joii.cc/canvas-uploads/01051de7-a0f8-490a-9422-2f7f1e936af9.png?fmt=webp&w=1200',
  },
  { 
    title: '淘宝爆款：平铺白底秒变街拍', 
    type: '国内淘系', 
    number: '02',
    img: 'bg-gradient-to-br from-neutral-300 to-neutral-400',
    url: 'https://d-assets-cn.joii.cc/ai-generated/40ccc917-129e-4f27-bb80-d1903b7496f0.png?fmt=webp&w=1200',
  },
  { 
    title: '小红书 / 得物：种草级质感氛围', 
    type: '社交种草', 
    number: '03',
    img: 'bg-gradient-to-br from-neutral-200 to-neutral-300',
    url: 'https://d-assets-cn.joii.cc/ai-generated/02942663-124a-44a9-ab10-60da0fe661d4.png?fmt=webp&w=1200',
  },
  { 
    title: 'Amazon / Shopify 高客单展示', 
    type: '独立站 / 平台', 
    number: '04',
    img: 'bg-gradient-to-br from-neutral-300 to-neutral-400',
    url: 'https://d-assets-cn.joii.cc/ai-generated/5e3e910c-9543-4a2d-9232-40424c4b8bed.png?fmt=webp&w=1200',
  },
]

export function ShowcaseSectionCN() {
  return (
    <section id="showcase" className="py-24 md:py-32 bg-white text-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-16 md:mb-24">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 md:col-span-6">
              <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
                商业案例
              </div>
              <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
                实战<br />
                <span className="font-sans-zh font-extralight text-neutral-400">商业案例</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:text-right">
              <p className="font-sans-zh text-neutral-500 text-sm md:text-base leading-relaxed max-w-md ml-auto">
                探索头部商家如何彻底打破全域多平台（TikTok、Amazon、淘宝等）的内容产出瓶颈，实现利润双重飞跃。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {cases.map((item) => (
            <div key={item.number} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 md:mb-6">
                <div className="w-full aspect-[3/4] relative bg-neutral-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 w-8 h-8 border border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center font-mono text-[10px] text-white">
                    {item.number}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <h3 className="font-serif-zh text-base md:text-lg font-medium mb-1 group-hover:text-neutral-600 transition-colors">
                {item.title}
              </h3>
              <p className="font-sans-zh text-xs text-neutral-400 tracking-wider">{item.type}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 pt-12 border-t border-neutral-200 flex items-center flex-wrap gap-4 justify-between">
          <p className="font-sans-zh text-sm text-neutral-500">
            已助力 <span className="font-medium text-neutral-950">500+</span> 出海与内销头部卖家实现视觉降本
          </p>
          <button className="group inline-flex items-center gap-2 font-sans-zh text-sm font-medium text-neutral-950 hover:text-neutral-600 transition-colors">
            <span>查看更多案例</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
