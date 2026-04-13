'use client'

import React, { useEffect, useState, useRef } from 'react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import { useAuth } from '@/features/auth/useAuth'
import { useCredits } from '@/features/credits/useCredits'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Zap, CreditCard, PenLine, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Transaction {
  id: string
  userId: string
  type: 'purchase' | 'consume' | 'refund' | 'gift' | 'admin' | 'signup'
  amount: number
  balanceBefore: number
  balanceAfter: number
  description?: string
  createdAt: number
}

const ACTION_LABELS: Record<string, string> = {
  image_generate: '图片生成',
  video_generate: '视频生成',
  chat: 'AI 对话',
  tryon: '试衣功能',
  signup: '注册赠送',
  purchase: '积分购买',
  gift: '积分赠送',
  admin: '管理员操作',
  refund: '退款',
}

export default function ProfilePage() {
  const { user, fetchUser } = useAuth()
  const { openInsufficientModal } = useCredits()
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const hasFetched = useRef(false)

  // 同步昵称输入框
  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
    }
  }, [user])

  // 只在组件挂载时拉取一次交易记录
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/transactions`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    load()
  }, [])

  const handleSaveNickname = async () => {
    if (!nickname.trim()) return

    setIsSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim() }),
      })

      if (res.ok) {
        setIsEditing(false)
        fetchUser()
      }
    } catch (error) {
      console.error('Failed to save nickname:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return null

  const initials = user.nickname ? user.nickname.slice(0, 2).toUpperCase() : user.phone.slice(-4)

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
                          disabled={isSaving}
                        />
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={handleSaveNickname} 
                          className="font-sans-zh"
                          disabled={isSaving}
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '保存'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => setIsEditing(false)} 
                          className="font-sans-zh"
                          disabled={isSaving}
                        >
                          取消
                        </Button>
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
                    <Button 
                      onClick={openInsufficientModal}
                      className="h-10 px-5 bg-neutral-950 hover:bg-neutral-800 text-white gap-2 font-sans-zh text-sm"
                    >
                      <Zap className="w-4 h-4" />
                      充值积分
                    </Button>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-4 h-4 text-neutral-400" />
                  <h2 className="font-sans-zh text-sm font-medium text-neutral-700">积分明细</h2>
                  {isLoadingData && <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />}
                </div>
                <div className="border border-neutral-200">
                  {transactions.length === 0 && !isLoadingData ? (
                    <div className="p-8 text-center text-neutral-400 text-sm">
                      暂无积分记录
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                      {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-sans-zh text-sm text-neutral-800">
                              {tx.description || ACTION_LABELS[tx.type] || tx.type}
                            </span>
                            <span className="font-sans-zh text-xs text-neutral-400">{formatDate(tx.createdAt)}</span>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className={`font-sans-zh text-sm font-medium ${tx.amount > 0 ? 'text-emerald-600' : 'text-neutral-900'}`}>
                              {tx.amount > 0 ? '+' : ''}{tx.amount}
                            </span>
                            <span className="font-sans-zh text-xs text-neutral-400">余额: {tx.balanceAfter}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
