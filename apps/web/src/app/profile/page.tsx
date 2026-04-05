'use client'

import React, { useEffect, useState } from 'react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/features/auth/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Zap, Clock, CreditCard, PenLine } from 'lucide-react'
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
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="w-full pb-20 lg:pl-20">
        <PageHeader 
          breadcrumbs={[
            { label: '个人中心', href: '/profile' }
          ]}
        />

        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-16">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8">
              <section className="flex items-center gap-6 mb-12">
                <Avatar className="w-20 h-20 border border-neutral-200">
                  <AvatarImage src={user.avatarUrl} alt={user.nickname || user.phone} />
                  <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xl font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="h-9 w-48 font-sans-zh text-base"
                          autoFocus
                        />
                        <Button size="sm" variant="secondary" onClick={() => setIsEditing(false)} className="font-sans-zh">保存</Button>
                      </div>
                    ) : (
                      <>
                        <h1 className="font-serif-display text-2xl text-neutral-950">
                          {user.nickname || 'Joii 用户'}
                        </h1>
                        <button onClick={() => setIsEditing(true)} className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors hover:bg-neutral-100 rounded">
                          <PenLine className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="font-sans-zh text-sm text-neutral-500">
                    {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <div className="relative p-6 border border-neutral-200 bg-neutral-50">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-4 h-4 text-neutral-400" />
                    <h2 className="font-sans-zh text-sm font-medium text-neutral-700">我的积分</h2>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif-display text-4xl tracking-tight text-neutral-950">{user.credits}</span>
                      <span className="font-sans-zh text-sm text-neutral-500">积分</span>
                    </div>
                    <Button className="h-10 px-5 bg-neutral-950 hover:bg-neutral-800 text-white gap-2 font-sans-zh text-sm">
                      <Zap className="w-4 h-4" />
                      升级套餐
                    </Button>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-4 h-4 text-neutral-400" />
                    <h2 className="font-sans-zh text-sm font-medium text-neutral-700">积分明细</h2>
                  </div>
                  <div className="border border-neutral-200">
                    <div className="divide-y divide-neutral-100">
                      {MOCK_CREDIT_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans-zh text-sm text-neutral-800">{tx.action}</span>
                            <span className="font-sans-zh text-xs text-neutral-400">{tx.date}</span>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className={`font-sans-zh text-sm font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount}
                            </span>
                            <span className="font-sans-zh text-xs text-neutral-400">余额: {tx.balance}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <h2 className="font-sans-zh text-sm font-medium text-neutral-700">消费记录</h2>
                  </div>
                  <div className="border border-neutral-200">
                    <div className="divide-y divide-neutral-100">
                      {MOCK_USAGE_LOGS.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-sans-zh text-sm text-neutral-800">{log.action}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">{log.details}</span>
                            </div>
                            <span className="font-sans-zh text-xs text-neutral-400">{log.date}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-sans-zh text-sm font-medium text-neutral-900">{log.amount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
