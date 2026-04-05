import { ArrowRight } from 'lucide-react'

export function ShowcaseSectionLight() {
  const cases = [
    { title: '女装主图生成', type: '电商海报', img: 'bg-neutral-200' },
    { title: '模特图批量替换', type: '详情页', img: 'bg-neutral-300' },
    { title: '背景光影重构', type: '商品展示', img: 'bg-neutral-200' },
    { title: '4K超分放大', type: '细节图', img: 'bg-neutral-300' },
  ]

  return (
    <section id="showcase" className="py-32 px-6 bg-white text-neutral-950 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6">
              赋能商业视觉
            </h2>
            <p className="text-xl text-neutral-500 font-medium">
              探索顶尖商家如何利用 Joii 突破内容产出瓶颈，实现点击转化与生产效率的双重飞跃。
            </p>
          </div>
          <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 text-white font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg">
            查看更多案例
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className={`w-full aspect-[3/4] ${item.img} rounded-[2rem] mb-6 relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-neutral-300`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-bold text-2xl mix-blend-overlay">
                  Placeholder
                </div>
              </div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
              <p className="text-sm font-medium text-neutral-400">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
