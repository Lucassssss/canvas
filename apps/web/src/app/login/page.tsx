'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/useAuth'
import { LoginForm } from '@/features/auth/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="w-full h-16 md:h-20 sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
          </Link>
          <Link href="/" className="font-sans-zh text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
            返回首页
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-16">
            {/* <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <img src="/joii_logo_fa.svg" alt="Joii" className="w-8 h-8" />
            </div> */}
            <h1 className="font-serif-display text-3xl md:text-4xl tracking-tight text-neutral-950 mb-3">
              欢迎来到 Joii<span className="font-sans-zh font-extralight italic text-neutral-400">.</span>
            </h1>
            <p className="font-sans-zh text-sm md:text-base text-neutral-500 leading-relaxed">
              使用手机号快速登录或注册，开启无限创作
            </p>
          </div>

          <div className="bg-white border border-neutral-200 p-8">
            <LoginForm onSuccess={() => router.push('/')} />
          </div>

          <p className="font-sans-zh text-xs text-neutral-400 text-center mt-6">
            登录即代表同意并接受 Joii 用户服务协议
          </p>
        </div>
      </main>
    </div>
  )
}
