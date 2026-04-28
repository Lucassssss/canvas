'use client'

import React from 'react'

const features = [
  {
    id: '01',
    tag: 'Environment Isolation',
    title: '物理级防关联，\n海量环境聚合管理',
    desc: '基于先进的指纹伪装与纯净代理技术，单台设备即可同时运行成百上千个原生级别的独立浏览器环境。完美适配亚马逊、TikTok矩阵运营。',
    image: '/browser-preview/detail_env_dark.png'
  },
  {
    id: '02',
    tag: 'Zero-code RPA',
    title: '无人值守，\n24小时全自动养号',
    desc: '内置强大的可视化零码脚本编辑器，支持自动化浏览、点赞、加购。',
    image: '/browser-preview/detail_rpa.png'
  },
  {
    id: '03',
    tag: 'Asset Center',
    title: '跨环境协同，\n资产流转中枢',
    desc: '内置高效的云端素材库与数据同步体系，支持团队共享与实时同步。',
    image: '/browser-preview/assets.png'
  },
  {
    id: '04',
    tag: 'Access Control',
    title: '资产不外泄，细粒度团队协作',
    desc: '支持自定义员工角色与操作边界，实现环境免密分享。员工离职时，所有店铺资产一键回收，保障数据安全。',
    image: '/browser-preview/roles.png'
  },
  {
    id: '05',
    tag: 'Audit Logs',
    title: '全量云端留痕，风险防患于未然',
    desc: '每一次环境开启、每一条数据变动都被完整记录。可视化追踪异常操作轨迹，确保大规模矩阵化运营合规。',
    image: '/browser-preview/logs.png'
  }
]

export function BrowserShowcase() {
  return (
    <section id="showcase" className="py-24 md:py-32 bg-white text-neutral-950 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-20 md:mb-32 max-w-3xl">
          <div className="text-xs font-sans-zh font-medium text-[#2B7FFF] tracking-[0.3em] uppercase mb-6">
            实战架构与场景
          </div>
          <h2 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.15]">
            以大厂级底层，<br />
            <span className="font-sans-zh font-extralight text-neutral-400">重塑出海运营工作流</span>
          </h2>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 auto-rows-[380px] md:auto-rows-[340px] lg:auto-rows-[400px]">

          {/* Card 01: 环境管理 (Large Dark Anchor) */}
          <div className="col-span-12 lg:col-span-6 row-span-1 lg:row-span-2 bg-neutral-950 text-white rounded-none p-8 md:p-12 pb-0 relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10 max-w-xl mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono text-neutral-400">{features[0].id}</span>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">{features[0].tag}</span>
              </div>
              <h3 className="font-serif-display text-3xl md:text-5xl mb-6 leading-tight whitespace-pre-line">
                {features[0].title}
              </h3>
              <p className="font-sans-zh text-neutral-400 text-base md:text-lg leading-relaxed max-w-md">
                {features[0].desc}
              </p>
            </div>

            {/* Deep glow effect */}
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Image pushed to bottom right */}
            <div className="relative w-[95%] md:w-[85%] self-end translate-x-4 md:translate-x-8 mt-auto">
              <img src={features[0].image} alt="Environment" className="w-full h-auto drop-shadow-2xl" />
            </div>
          </div>

          {/* Card 02: RPA */}
          <div className="col-span-12 md:col-span-6 lg:col-span-6 row-span-1 bg-neutral-50 rounded-none p-8 md:p-10 pb-0 relative overflow-hidden border border-neutral-200 flex flex-col justify-between">
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-neutral-400">{features[1].id}</span>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">{features[1].tag}</span>
              </div>
              <h3 className="font-serif-zh font-bold text-xl md:text-2xl mb-3 whitespace-pre-line text-neutral-900">
                {features[1].title}
              </h3>
              <p className="font-sans-zh text-sm text-neutral-500 leading-relaxed max-w-[90%]">
                {features[1].desc}
              </p>
            </div>
            <div className="relative w-[95%] md:w-[80%] self-end translate-x-4 md:translate-x-6 mt-auto">
              <img src={features[1].image} alt="RPA" className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl" />
            </div>
          </div>

          {/* Card 03: Assets */}
          <div className="col-span-12 md:col-span-6 lg:col-span-6 row-span-1 bg-neutral-50 rounded-none p-8 md:p-10 pb-0 relative overflow-hidden border border-neutral-200 flex flex-col justify-between">
            <div className="relative z-10 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-neutral-400">{features[2].id}</span>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">{features[2].tag}</span>
              </div>
              <h3 className="font-serif-zh font-bold text-xl md:text-2xl mb-3 whitespace-pre-line text-neutral-900">
                {features[2].title}
              </h3>
              <p className="font-sans-zh text-sm text-neutral-500 leading-relaxed max-w-[90%]">
                {features[2].desc}
              </p>
            </div>
            <div className="relative w-[95%] md:w-[80%] self-end translate-x-4 md:translate-x-6 mt-auto">
              <img src={features[2].image} alt="Assets" className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded" />
            </div>
          </div>

          {/* Card 04: Roles (Symmetric bottom left) */}
          <div className="col-span-12 lg:col-span-6 row-span-1 bg-white rounded-none p-8 md:p-12 pb-0 relative overflow-hidden border border-neutral-200 flex flex-col justify-between">
            <div className="relative z-10 max-w-md mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono text-neutral-400">{features[3].id}</span>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">{features[3].tag}</span>
              </div>
              <h3 className="font-serif-display text-2xl md:text-3xl mb-4 text-neutral-900">
                {features[3].title}
              </h3>
              <p className="font-sans-zh text-sm md:text-base text-neutral-500 leading-relaxed">
                {features[3].desc}
              </p>
            </div>
            <div className="relative w-[85%] md:w-[75%] self-end translate-x-4 md:translate-x-8 mt-auto">
              <img src={features[3].image} alt="Roles" className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded border border-neutral-100" />
            </div>
          </div>

          {/* Card 05: Logs (Symmetric bottom right) */}
          <div className="col-span-12 lg:col-span-6 row-span-1 bg-white rounded-none p-8 md:p-12 pb-0 relative overflow-hidden border border-neutral-200 flex flex-col justify-between">
            <div className="relative z-10 max-w-md mb-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-mono text-neutral-400">{features[4].id}</span>
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">{features[4].tag}</span>
              </div>
              <h3 className="font-serif-display text-2xl md:text-3xl mb-4 text-neutral-900">
                {features[4].title}
              </h3>
              <p className="font-sans-zh text-sm md:text-base text-neutral-500 leading-relaxed">
                {features[4].desc}
              </p>
            </div>
            <div className="relative w-[85%] md:w-[75%] self-end translate-x-4 md:translate-x-8 mt-auto">
              <img src={features[4].image} alt="Logs" className="w-full h-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded border border-neutral-100" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
