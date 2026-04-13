'use client'

import { FAQSection, GuideCard } from './FAQSection'
import { Mail, Search } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'Joii 支持哪些格式的图片导出？',
    answer: 'Joii 目前支持导出 PNG、JPEG 和 WebP 格式的高清图片。在设计完成后，点击右上角的导出按钮即可选择您需要的格式和分辨率。对于付费用户，还支持无损放大导出。',
  },
  {
    question: '如何使用 AI 一键换装功能？',
    answer: '在画布中选中任意包含人物的图层，点击右侧属性栏的"智能换装"图标。您可以上传本地服装图片或使用系统提供的服装素材，AI 会自动识别并完成贴合，光影融合等一系列操作。',
  },
  {
    question: '我的积分如何计算？如果生成失败会扣除积分吗？',
    answer: '每次成功调用 AI 生成能力（如图片生成、换装等）会扣除相应积分。如果因为系统原因导致生成失败，积分会自动退还到您的账户。网络原因或用户主动取消不会扣除积分。',
  },
  {
    question: '免费用户和专业版(Pro)用户有什么区别？',
    answer: '免费用户每日享有基础生成次数，适合轻量级设计需求。专业版用户则享有优先生成队列、更多单日生成次数、无损放大以及专属的高级 AI 模型权限，极大地提升商用设计效率。',
  },
  {
    question: '如何联系客服获取帮助？',
    answer: '您可以通过发送邮件至 hi@joii.cc 获取人工客服支持，也可以在产品内提交工单。我们的技术支持团队工作时间为工作日 9:00-18:00，承诺 24 小时内回复。',
  },
]

const GUIDES = [
  {
    title: '快速入门指南',
    desc: '5分钟了解 Joii 的核心功能与画布操作基础。',
    index: '01',
    href: '#quickstart',
  },
  {
    title: '电商爆款图设计',
    desc: '学习如何使用 AI 结合排版生成高转化率商品主图。',
    index: '02',
    href: '#ecommerce',
  },
  {
    title: '高级提示词技巧',
    desc: '掌握与 AI 沟通的语言，生成精准符合预期的素材。',
    index: '03',
    href: '#prompt',
  },
]

export function HelpContent() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-16 md:py-24 lg:py-32">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="mb-16">
            <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-6">
              帮助中心
            </div>
            <h1 className="font-serif-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
              Help<span className="font-sans-zh font-extralight italic text-neutral-400">.</span>
            </h1>
            <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-lg leading-relaxed">
              探索 Joii 的使用指南、常见问题解答与设计技巧，<br className="hidden md:block" />
              助您快速上手，提升设计效率。
            </p>
          </div>

          <FAQSection items={FAQ_ITEMS} title="常见问题" />
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-32 space-y-8">
            <div>
              <h3 className="font-sans-zh text-xs font-medium text-neutral-400 tracking-wider uppercase mb-6">
                热门教程
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {GUIDES.map((guide) => (
                  <GuideCard key={guide.index} {...guide} />
                ))}
              </div>
            </div>

            <div className="relative bg-neutral-950 p-8 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <h3 className="font-serif-display text-xl text-white mb-4">
                  需要更多帮助？
                </h3>
                <p className="font-sans-zh text-sm text-neutral-400 leading-relaxed mb-6">
                  如果您无法在帮助中心找到答案，请随时联系我们的技术支持团队。
                </p>
                <a
                  href="mailto:hi@joii.cc"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white text-neutral-950 font-sans-zh font-medium text-sm hover:bg-neutral-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>联系客服</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
