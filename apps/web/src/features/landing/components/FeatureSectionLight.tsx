import { Layout, ZoomIn, Image as ImageIcon, Users, Layers, Zap } from 'lucide-react'

export function FeatureSectionLight() {
  return (
    <section id="features" className="py-32 px-6 bg-neutral-50 text-neutral-950 selection:bg-indigo-500 selection:text-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 md:text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 mb-8">
            <Zap className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1]">
            Redefining the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Creative Workflow.</span>
          </h2>
          <p className="text-xl text-neutral-500 font-medium tracking-tight">
            专为电商视觉打造的 AI 能力矩阵，将繁琐的修图工作交给大模型，让创意无限延伸。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-200 p-8 md:p-12 group hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="w-14 h-14 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-700 backdrop-blur-md">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-widest">Core Feature</div>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">智能换装 2.0</h3>
              <p className="text-neutral-500 max-w-md mb-12 text-lg leading-relaxed">
                物理级贴合，精准识别衣服材质（丝绸、针织等），自动计算自然光影与褶皱，告别生硬贴图感。
              </p>
              
              <div className="mt-auto w-full h-56 md:h-72 rounded-[1.5rem] border border-neutral-200 bg-neutral-100 shadow-inner flex overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex-1 border-r border-neutral-200 flex flex-col items-center justify-center bg-white relative">
                  <span className="text-neutral-400 font-mono text-xs uppercase tracking-widest absolute top-6 left-6">Input</span>
                  <div className="w-20 h-20 rounded-full bg-neutral-200 border border-neutral-300" />
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-indigo-50 relative">
                  <span className="text-indigo-600 font-mono text-xs uppercase tracking-widest absolute top-6 left-6">Output</span>
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 border border-indigo-300 backdrop-blur-xl" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-950 p-8 md:p-12 group shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay" />
            <div className="relative z-10 flex flex-col h-full text-white">
              <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mb-12 backdrop-blur-md">
                <ZoomIn className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">4K 无损放大</h3>
              <p className="text-neutral-300 leading-relaxed mb-8">
                AI 智能补充纹理细节，放大后布料与五官依然清晰锐利。
              </p>
              <div className="mt-auto w-full h-32 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md overflow-hidden">
                 <div className="text-white/50 font-mono text-xs tracking-widest uppercase">Resolution Enhancement</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-200 p-8 md:p-12 group hover:border-neutral-300 hover:shadow-xl transition-all duration-300">
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-neutral-100 rounded-2xl border border-neutral-200 flex items-center justify-center mb-12 text-neutral-700">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">无限画布</h3>
              <p className="text-neutral-500 leading-relaxed">
                自由拖拽排版，支持海量图层同时编辑与处理，告别拥挤的工作区。
              </p>
            </div>
          </div>

          <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-neutral-950 border border-neutral-800 p-8 md:p-12 group">
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 h-full text-white">
              <div className="flex-1">
                <div className="w-14 h-14 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mb-12 text-white">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">云端协作资产</h3>
                <p className="text-neutral-300 text-lg leading-relaxed">
                  企业级资产库，团队共享设计规范与灵感，一键分发复用，构建高效视觉生产流水线。
                </p>
              </div>
              <div className="flex-1 w-full h-56 md:h-full min-h-[240px] rounded-[1.5rem] border border-white/10 bg-black shadow-inner flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />
                <div className="relative flex flex-col gap-4 w-full px-8">
                  <div className="h-8 w-full bg-white/5 rounded-lg border border-white/10 flex items-center px-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                    <div className="h-2 w-24 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-8 w-3/4 bg-white/5 rounded-lg border border-white/10 flex items-center px-4 ml-auto">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                    <div className="h-2 w-16 bg-white/10 rounded-full" />
                  </div>
                  <div className="h-8 w-5/6 bg-white/5 rounded-lg border border-white/10 flex items-center px-4">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                    <div className="h-2 w-32 bg-white/10 rounded-full" />
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
