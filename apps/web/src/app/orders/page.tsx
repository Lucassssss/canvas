'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { getUserOrders, type Order } from '@/lib/api/payment-api'
import { Check, Clock, XCircle, Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const statusConfig = {
  pending: { label: '待支付', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  paid: { label: '已支付', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Check },
  expired: { label: '已过期', color: 'text-neutral-500', bg: 'bg-neutral-100', icon: XCircle },
  cancelled: { label: '已取消', color: 'text-neutral-500', bg: 'bg-neutral-100', icon: XCircle },
  refunded: { label: '已退款', color: 'text-blue-600', bg: 'bg-blue-50', icon: XCircle },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user, page])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const result = await getUserOrders(page, 10)
      if (result.success && result.data) {
        setOrders(result.data.orders)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('Load orders error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 font-sans-zh text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回个人中心
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="font-serif-zh text-2xl font-medium text-neutral-950 tracking-tight">
            充值记录
          </h1>
          <p className="font-sans-zh text-sm text-neutral-500 mt-1">
            查看您的所有充值订单
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="font-sans-zh text-neutral-500">暂无充值记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                        <span className="font-sans-zh text-xs text-neutral-400">
                          订单号：{order.orderNo}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="font-serif-zh text-xl font-medium text-neutral-950">
                          {order.credits}
                        </span>
                        <span className="font-sans-zh text-sm text-neutral-500">积分</span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-neutral-400">
                        <span className="font-sans-zh">
                          创建时间：{new Date(order.createdAt).toLocaleString('zh-CN')}
                        </span>
                        {order.paidAt && (
                          <span className="font-sans-zh">
                            支付时间：{new Date(order.paidAt).toLocaleString('zh-CN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif-zh text-xl font-medium text-neutral-950">
                        ¥{(order.amount / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {total > 10 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-sans-zh text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <span className="font-sans-zh text-sm text-neutral-500">
              第 {page} 页，共 {Math.ceil(total / 10)} 页
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 10 >= total}
              className="px-4 py-2 text-sm font-sans-zh text-neutral-600 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
