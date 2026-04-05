'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { useAuth } from './useAuth'

export function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth()

  return (
    <Dialog open={isLoginModalOpen} onOpenChange={(open) => !open && closeLoginModal()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-[24px] border-neutral-100 shadow-2xl">
        <div className="px-8 pt-10 pb-8 flex flex-col items-center bg-white">
          <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <img src="/joii_logo_fa.svg" alt="Joii" className="w-6 h-6 invert" />
          </div>
          <DialogHeader className="w-full text-center sm:text-center mb-8">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-neutral-900">
              欢迎来到 Joii
            </DialogTitle>
            <DialogDescription className="text-neutral-500 text-sm mt-2 font-normal">
              使用手机号快速登录或注册，开启无限创作
            </DialogDescription>
          </DialogHeader>

          <LoginForm onSuccess={() => closeLoginModal()} />
        </div>
        <div className="px-8 py-4 bg-neutral-50/50 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-400">
            登录即代表同意并接受 Joii 用户服务协议
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
