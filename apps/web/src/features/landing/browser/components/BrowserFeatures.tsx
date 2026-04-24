import React from 'react'
import { Fingerprint, Network, Shield, Workflow, Gift } from 'lucide-react'

export function BrowserFeatures() {
  const features = [
    {
      title: '打破隐形消费，核心防关联永久免费',
      description: '彻底告别行业乱收费。无多开窗口数量限制，免收自有设备添加费。让每一位跨境创业者都能零负担起步。',
      icon: <Gift className="w-8 h-8 text-[#2B7FFF]" />,
      colSpan: 'md:col-span-12 lg:col-span-4',
      bgClass: 'bg-white',
      theme: 'light'
    },
    {
      title: '深度定制 Chromium 内核，物理级防关联',
      description: '抛弃容易被识别的浅层修改方案，从底层重构浏览器内核。为每个店铺分配真实且独立的 Canvas、WebGL、Audio 等硬件指纹，并强制隔离本地数据目录（--user-data-dir）。从根本上斩断平台风控探针，彻底告别连坐封禁。',
      icon: <Fingerprint className="w-8 h-8 text-white" />,
      colSpan: 'md:col-span-12 lg:col-span-8',
      bgClass: 'bg-neutral-950 text-white',
      theme: 'dark'
    },
    {
      title: '全球纯净 IP 直连，告别网络卡顿',
      description: '优选全球骨干网络节点，拒绝“万人骑”脏 IP。提供纯净、稳定、低延迟的访问体验，全面保障店铺健康度。',
      icon: <Network className="w-6 h-6 text-neutral-950" />,
      colSpan: 'md:col-span-6 lg:col-span-4',
      bgClass: 'bg-white',
      theme: 'light'
    },
    {
      title: '精细化团队协作，核心资产不外泄',
      description: '灵活的多级权限与分组管理，支持账号一键免密共享。员工离职一键交接，密码数据永远掌握在您手中。',
      icon: <Shield className="w-6 h-6 text-neutral-950" />,
      colSpan: 'md:col-span-6 lg:col-span-4',
      bgClass: 'bg-white',
      theme: 'light'
    },
    {
      title: '内置 RPA 引擎，一个人抵一个团队 (PRO)',
      description: '零代码自动化执行批量养号、浏览、点赞、留评等机械动作。全天候静默运行，深度集成 AI 提效。',
      icon: <Workflow className="w-6 h-6 text-neutral-950" />,
      colSpan: 'md:col-span-12 lg:col-span-4',
      bgClass: 'bg-white',
      theme: 'light'
    }
  ]

  return (
    <section id="features" className="py-24 md:py-32 bg-neutral-100 text-neutral-950">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="mb-20 md:mb-32">
          <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-4">
            核心能力
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight">
            告别风险<br />
            <span className="font-sans-zh font-extralight text-neutral-400">护航</span><br />
            您的每一笔跨境资产
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className={`col-span-12 ${feature.colSpan} ${feature.bgClass} p-8 md:p-12 relative overflow-hidden group border ${feature.theme === 'light' ? 'border-neutral-200 hover:border-neutral-300' : 'border-transparent'} transition-colors`}
            >
              <div className="text-xs tracking-[0.2em] font-sans-zh uppercase mb-8 opacity-50 font-bold font-mono">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className={`font-serif-display text-3xl mb-4 ${feature.theme === 'dark' ? 'text-white' : 'text-neutral-950'}`}>
                {feature.title}
              </h3>
              <p className={`font-sans-zh leading-relaxed ${feature.theme === 'dark' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {feature.description}
              </p>
              
              {/* 装点元素 */}
              {feature.theme === 'dark' && (
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#2B7FFF]/30 to-transparent blur-3xl rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
