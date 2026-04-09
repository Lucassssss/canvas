'use client'

import React, { useState } from 'react'
import { Check, Shield, TrendingUp, X, QrCode, Headphones } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/components/ui/dialog'
import { useCredits } from './useCredits'

const RECHARGE_OPTIONS = [
  { credits: 50, price: 5, unitPrice: 0.100, savings: 0, popular: false },
  { credits: 200, price: 18, unitPrice: 0.090, savings: 10, popular: false },
  { credits: 500, price: 40, unitPrice: 0.080, savings: 20, popular: true },
  { credits: 1000, price: 70, unitPrice: 0.070, savings: 30, popular: false },
  { credits: 2000, price: 120, unitPrice: 0.060, savings: 40, popular: false },
  { credits: 5000, price: 250, unitPrice: 0.050, savings: 50, popular: false },
]

const BENEFITS = [
  '智能换装、4K放大等全部AI功能',
  '积分永久有效，永不过期',
  '多端同步，随时随地创作',
]

export function CreditsRechargeModal() {
  const { isInsufficientModalOpen, closeInsufficientModal } = useCredits()
  const [selectedOption, setSelectedOption] = useState<number>(500)

  const selectedPrice = RECHARGE_OPTIONS.find(o => o.credits === selectedOption)?.price || 0

  return (
    <Dialog open={isInsufficientModalOpen} onOpenChange={() => {}}>
      <DialogOverlay className="bg-black/40 backdrop-blur-sm z-[9998]" />
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[800px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-2xl p-0 gap-0 z-[9999] bg-white border border-neutral-200 shadow-2xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-950 via-neutral-600 to-neutral-950" />

        <DialogHeader className="space-y-0 p-4 sm:p-6 sm:pb-4 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="font-serif-zh text-lg sm:text-xl font-medium text-neutral-950 tracking-tight">
                  积分不足
                </DialogTitle>
                <p className="font-sans-zh text-xs text-neutral-400 mt-0.5">
                  充值积分，继续创作
                </p>
              </div>
            </div>
            <button
              onClick={closeInsufficientModal}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-4 sm:p-6 sm:border-r border-neutral-100">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-sans-zh text-xs text-neutral-400">选择套餐，充得越多省得越多</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {RECHARGE_OPTIONS.map((option) => {
                const isSelected = selectedOption === option.credits
                const isPopular = option.popular

                return (
                  <button
                    key={option.credits}
                    onClick={() => setSelectedOption(option.credits)}
                    className={`
                      relative p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 cursor-pointer
                      ${isSelected
                        ? 'bg-neutral-950 text-white ring-2 ring-neutral-950 shadow-lg'
                        : isPopular
                          ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-950 ring-1 ring-neutral-200'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-950 ring-1 ring-neutral-100'
                      }
                    `}
                  >
                    {isPopular && (
                      <span className={`
                        absolute -top-2 left-3 px-2 py-0.5 text-[10px] font-medium rounded-full font-sans-zh
                        ${isSelected
                          ? 'bg-white text-neutral-950 border border-neutral-200'
                          : 'bg-neutral-950 text-white'
                        }
                      `}>
                        最受欢迎
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/20">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      </div>
                    )}

                    <div className="flex items-baseline gap-1">
                      <span className="font-serif-zh text-base sm:text-lg font-medium tabular-nums">
                        {option.credits}
                      </span>
                      <span className={`font-sans-zh text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        积分
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-1.5">
                      <span className="font-serif-zh text-sm font-medium tabular-nums">
                        ¥{option.price}
                      </span>
                      {option.savings > 0 && (
                        <span className={`
                          px-1.5 py-0.5 text-[9px] font-medium rounded font-sans-zh
                          ${isSelected
                            ? 'bg-white/15 text-white/80'
                            : 'bg-emerald-50 text-emerald-600'
                          }
                        `}>
                          省{option.savings}%
                        </span>
                      )}
                    </div>

                    <div className={`font-sans-zh text-[10px] mt-0.5 tabular-nums ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>
                      ¥{option.unitPrice.toFixed(3)}/积分
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="hidden sm:block mt-5 pt-4 border-t border-neutral-100">
              <p className="font-sans-zh text-[10px] text-neutral-400 tracking-wider uppercase mb-3">充值权益</p>
              <div className="space-y-2.5">
                {BENEFITS.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="font-sans-zh text-xs text-neutral-500 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full sm:w-[280px] p-4 sm:p-6 bg-neutral-50 flex flex-col border-t sm:border-t-0 border-neutral-100">
            <div className="flex items-center justify-between sm:justify-center mb-4">
              <div className="flex items-center gap-2 sm:gap-0">
                <span className="font-sans-zh text-xs text-neutral-500 sm:hidden">应付</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-sans-zh text-xs text-neutral-400">¥</span>
                  <span className="font-serif-zh text-2xl font-medium text-neutral-950 tabular-nums">
                    {selectedPrice}
                  </span>
                </div>
              </div>
              <div className="sm:hidden">
                <div className="w-24 h-24 bg-white border border-neutral-200 rounded-xl flex items-center justify-center shadow-sm">
                  <div className="w-20 h-20 bg-neutral-50 rounded-lg flex flex-col items-center justify-center gap-1">
                    <QrCode className="w-8 h-8 text-neutral-300" />
                    <span className="font-sans-zh text-[9px] text-neutral-400">扫码支付</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center mb-5">
              <div className="w-36 h-36 bg-white border border-neutral-200 rounded-xl flex items-center justify-center shadow-sm">
                <div className="w-32 h-32 bg-neutral-50 rounded-lg flex flex-col items-center justify-center gap-2">
                  <QrCode className="w-10 h-10 text-neutral-300" />
                  <span className="font-sans-zh text-[10px] text-neutral-400">微信扫码</span>
                </div>
              </div>
            </div>

            <div className="text-center py-2.5 sm:py-3 px-4 rounded-xl bg-white sm:bg-transparent border border-neutral-200 sm:border-0">
              <p className="font-sans-zh text-xs text-neutral-500 leading-relaxed">
                <span className="sm:hidden">微信扫码支付，</span>立即获取 <span className="font-medium text-neutral-950">{selectedOption}</span> 积分
              </p>
            </div>

            <div className="hidden sm:flex items-center justify-center gap-2 mt-auto">
              <span className="flex items-center gap-1 font-sans-zh text-[10px] text-neutral-400">
                <Shield className="w-3 h-3" />
                安全支付
              </span>
              <span className="font-sans-zh text-[10px] text-neutral-300">·</span>
              <span className="font-sans-zh text-[10px] text-neutral-400">即时到账</span>
              <span className="font-sans-zh text-[10px] text-neutral-300">·</span>
              <span className="font-sans-zh text-[10px] text-neutral-400">永久有效</span>
            </div>

            <div className="mt-3 sm:mt-3 pt-3 border-t border-neutral-200">
              <a
                href="#"
                className="group flex items-center justify-center gap-1.5 font-sans-zh text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <Headphones className="w-3.5 h-3.5" />
                联系客服
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
