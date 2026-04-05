'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/useAuth'
import { LoginForm } from '@/features/auth/LoginForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function LoginPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen w-full bg-white flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-neutral-50/80 to-transparent pointer-events-none" />

      <header className="w-full px-8 py-6 flex items-center justify-between z-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center">
                <img src="/joii_logo_fa.svg" alt="LOGO" className="h-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>登录</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          <img src="/joii_logo_fa.svg" alt="Joii" className="h-6" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center z-10 px-6">
        <div className="w-full max-w-[400px] bg-white rounded-[24px] border border-neutral-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-8 pt-10 pb-8 flex flex-col items-center">
            <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <img src="/joii_logo_fa.svg" alt="Joii" className="w-6 h-6 invert" />
            </div>
            <div className="w-full text-center mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                欢迎来到 Joii
              </h1>
              <p className="text-neutral-500 text-sm mt-2 font-normal">
                使用手机号快速登录或注册，开启无限创作
              </p>
            </div>

            <LoginForm onSuccess={() => router.push('/')} />
          </div>
          <div className="px-8 py-4 bg-neutral-50/50 border-t border-neutral-100 text-center">
            <p className="text-xs text-neutral-400">
              登录即代表同意并接受 Joii 用户服务协议
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
