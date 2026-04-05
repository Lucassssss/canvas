import { ArrowRight } from 'lucide-react'

const cases = [
  { 
    title: '女装主图生成', 
    type: '电商海报', 
    number: '01',
    img: 'bg-gradient-to-br from-neutral-200 to-neutral-300'
  },
  { 
    title: '模特图批量替换', 
    type: '详情页', 
    number: '02',
    img: 'bg-gradient-to-br from-neutral-300 to-neutral-400'
  },
  { 
    title: '背景光影重构', 
    type: '商品展示', 
    number: '03',
    img: 'bg-gradient-to-br from-neutral-200 to-neutral-300'
  },
  { 
    title: '4K 超分放大', 
    type: '细节图', 
    number: '04',
    img: 'bg-gradient-to-br from-neutral-300 to-neutral-400'
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
                赋能<br />
                <span className="font-sans-zh font-extralight text-neutral-400">商业视觉</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:text-right">
              <p className="font-sans-zh text-neutral-500 text-sm md:text-base leading-relaxed max-w-md ml-auto">
                探索顶尖商家如何利用 Joii 突破内容产出瓶颈，实现点击转化与生产效率的双重飞跃。
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {cases.map((item) => (
            <div key={item.number} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 md:mb-6">
                <div className={`w-full aspect-[3/4] ${item.img} relative`}>
                  <div className="absolute top-4 left-4 w-8 h-8 border border-neutral-400/30 flex items-center justify-center font-mono text-[10px] text-neutral-400">
                    {item.number}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
              <h3 className="font-serif-zh text-base md:text-lg font-medium mb-1 group-hover:text-neutral-600 transition-colors">
                {item.title}
              </h3>
              <p className="font-sans-zh text-xs text-neutral-400 tracking-wider">{item.type}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 pt-12 border-t border-neutral-200 flex items-center justify-between">
          <p className="font-sans-zh text-sm text-neutral-500">
            已为 <span className="font-medium text-neutral-950">500+</span> 电商商家提供服务
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
