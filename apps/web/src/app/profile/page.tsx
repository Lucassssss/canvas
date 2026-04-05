'use client'

import React, { useEffect, useState } from 'react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { useAuth } from '@/features/auth/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Sparkles, Zap, Clock, CreditCard, PenLine } from 'lucide-react'
import Link from 'next/link'

const MOCK_CREDIT_TRANSACTIONS = [
  { id: '1', date: '2026-04-05', action: '图片生成', amount: -1, balance: 1017 },
  { id: '2', date: '2026-04-05', action: '注册赠送', amount: 100, balance: 1018 },
  { id: '3', date: '2026-04-04', action: '图片生成', amount: -1, balance: 918 },
]

const MOCK_USAGE_LOGS = [
  { id: '1', date: '2026-04-05 02:30', action: '图片生成', details: '768x1024', amount: -1 },
  { id: '2', date: '2026-04-04 15:22', action: '视频生成', details: '30s', amount: -5 },
]

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
    }
  }, [user])

  if (!isAuthenticated || !user) return null

  const initials = user.nickname ? user.nickname.slice(0, 2).toUpperCase() : user.phone.slice(-4)

  return (
    <div className="min-h-screen w-full bg-neutral-50 flex">
      <LeftSidebar />
      <main className="flex-1 w-full pb-20 md:pl-20">
        <header className="w-full h-14 flex items-center justify-between px-8 sticky top-0 z-10 bg-neutral-50/80 backdrop-blur-md">
          <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">简体中文</span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto mt-8 px-8 space-y-12">
          {/* User Profile Section */}
          <section className="flex items-start gap-8">
            <Avatar className="w-24 h-24 border border-neutral-200 shadow-sm ring-4 ring-white">
              <AvatarImage src={user.avatarUrl} alt={user.nickname || user.phone} />
              <AvatarFallback className="bg-neutral-200 text-neutral-600 text-2xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-3 mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input 
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-48 h-9 text-lg font-semibold"
                      autoFocus
                    />
                    <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)}>保存</Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-semibold text-neutral-900">
                      {user.nickname || 'Joii 用户'}
                    </h1>
                    <button onClick={() => setIsEditing(true)} className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded-md hover:bg-neutral-200">
                      <PenLine className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-neutral-500 text-base tracking-wide">
                {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
              </p>
            </div>
          </section>

          {/* Credits Section */}
          <section>
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                <h2 className="text-lg font-semibold text-neutral-900">我的积分</h2>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold tracking-tighter text-neutral-900">{user.credits}</span>
                  <span className="text-neutral-500 font-medium pb-1.5">积分</span>
                </div>
                <Button className="h-11 px-6 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white gap-2 transition-all">
                  <Sparkles className="w-4 h-4" />
                  升级套餐
                </Button>
              </div>
            </div>
          </section>

          {/* Transactions & Logs Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Credit Transactions */}
            <section>
              <div className="flex items-center gap-2 mb-6 px-1">
                <CreditCard className="w-4 h-4 text-neutral-400" />
                <h2 className="text-base font-semibold text-neutral-900">积分明细</h2>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {MOCK_CREDIT_TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-neutral-900">{tx.action}</span>
                        <span className="text-xs text-neutral-400">{tx.date}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-500' : 'text-neutral-900'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </span>
                        <span className="text-xs text-neutral-400">余额: {tx.balance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Usage Logs */}
            <section>
              <div className="flex items-center gap-2 mb-6 px-1">
                <Clock className="w-4 h-4 text-neutral-400" />
                <h2 className="text-base font-semibold text-neutral-900">消费记录</h2>
              </div>
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {MOCK_USAGE_LOGS.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 hover:bg-neutral-50/50 transition-colors">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">{log.action}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-md font-medium">{log.details}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{log.date}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-neutral-900">{log.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
