"use client"

import React, { useState } from 'react'
import { ArrowRight, ShieldCheck, CheckCircle2, Loader2, ChevronDown } from 'lucide-react'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function BrowserContact() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    teamSize: '',
    needs: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') setStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.contact || !formData.teamSize) {
      setErrorMessage('请填写完整的必填信息')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setStatus('success')
        setFormData({ name: '', contact: '', teamSize: '', needs: '' })

        // Reset success state after 3 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 3000)
      } else {
        setStatus('error')
        setErrorMessage(data.error || '提交失败，请重试')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('网络异常，请重试')
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24 lg:py-32 bg-white text-neutral-950 border-t border-neutral-200">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* 左侧文字区：编辑排版风格 */}
          <div className="col-span-12 lg:col-span-6">
            <div className="text-xs font-sans-zh font-medium text-neutral-400 tracking-[0.3em] uppercase mb-8">
              专属咨询服务
            </div>

            <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 md:mb-8 tracking-tight leading-[1.1]">
              定制您的<br className="hidden md:block" />
              <span className="font-sans-zh font-extralight text-neutral-400">专属</span><br className="hidden md:block" />
              防关联方案
            </h2>

            <p className="font-sans-zh text-base md:text-lg text-neutral-500 max-w-md leading-relaxed mb-8 md:mb-12">
              不要让一次环境风控，毁掉半年的运营心血。留下联系方式，我们的安全出海专家将在 24 小时内为您提供 1对1 架构指导。
            </p>

            {/* 信任状数据统计 */}
            <div className="grid grid-cols-2 gap-6 pt-8 md:pt-10 border-t border-neutral-200">
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">100%</div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">物理级环境隔离</div>
              </div>
              <div>
                <div className="font-serif-display text-3xl md:text-4xl text-neutral-950 mb-2">24<span className="text-2xl">h</span></div>
                <div className="font-sans-zh text-xs text-neutral-400 tracking-wider">专家专属响应</div>
              </div>
            </div>
          </div>

          {/* 右侧表单区：极简框线风格 */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-12 w-full">
            <div className="lg:bg-neutral-50 lg:p-12 lg:border lg:border-neutral-200">
              <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="font-sans-zh text-xs font-medium text-neutral-500 uppercase tracking-widest">称呼<span className="text-red-500 ml-1">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="如何称呼您"
                      className="w-full h-10 bg-transparent border-b border-neutral-300 focus:border-neutral-950 outline-none transition-colors font-sans-zh text-sm text-neutral-900 px-0 rounded-none placeholder:text-neutral-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans-zh text-xs font-medium text-neutral-500 uppercase tracking-widest">联系方式<span className="text-red-500 ml-1">*</span></label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="微信号或手机号"
                      className="w-full h-10 bg-transparent border-b border-neutral-300 focus:border-neutral-950 outline-none transition-colors font-sans-zh text-sm text-neutral-900 px-0 rounded-none placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans-zh text-xs font-medium text-neutral-500 uppercase tracking-widest">团队规模<span className="text-red-500 ml-1">*</span></label>
                  <div className="relative">
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full h-10 bg-transparent border-b border-neutral-300 focus:border-neutral-950 outline-none transition-colors font-sans-zh text-sm text-neutral-900 px-0 rounded-none appearance-none cursor-pointer relative z-10"
                    >
                      <option value="" disabled hidden>请选择</option>
                      <option value="1-10">1-10人团队</option>
                      <option value="11-50">11-50人团队</option>
                      <option value="50+">50人以上大卖团队</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-0" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans-zh text-xs font-medium text-neutral-500 uppercase tracking-widest">需求简述</label>
                  <input
                    type="text"
                    name="needs"
                    value={formData.needs}
                    onChange={handleChange}
                    placeholder="您目前遇到的环境风控痛点 (选填)"
                    className="w-full h-10 bg-transparent border-b border-neutral-300 focus:border-neutral-950 outline-none transition-colors font-sans-zh text-sm text-neutral-900 px-0 rounded-none placeholder:text-neutral-300"
                  />
                </div>

                {status === 'error' && (
                  <div className="text-red-500 text-xs font-sans-zh font-medium">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`group w-full h-16 text-white font-sans-zh font-medium transition-colors flex items-center justify-center gap-3 rounded-none ${status === 'success'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-neutral-950 hover:bg-neutral-800 disabled:opacity-70'
                      }`}
                  >
                    {status === 'loading' && (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        提交中...
                      </>
                    )}
                    {status === 'success' && (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        提交成功
                      </>
                    )}
                    {status !== 'loading' && status !== 'success' && (
                      <>
                        提交咨询需求
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-neutral-400 font-sans-zh text-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>信息已采取端到端加密，我们将严格保密您的团队数据</span>
                  </div>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

