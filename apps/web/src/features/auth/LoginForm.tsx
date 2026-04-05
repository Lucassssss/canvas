'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from './useAuth'
import { Loader2 } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login, sendCode, isLoading } = useAuth()
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入有效的手机号')
      return
    }
    setError('')
    const result = await sendCode(phone)
    if (result.success) {
      setCountdown(60)
    } else {
      setError(result.message || '发送验证码失败')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setError('请先阅读并同意用户协议')
      return
    }
    if (!phone || !code) {
      setError('请填写手机号和验证码')
      return
    }

    setError('')
    try {
      await login(phone, code)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5 w-full">
      <div className="space-y-4">
        <div>
          <div className="flex relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-neutral-500 text-sm">+86</span>
            </div>
            <Input
              type="tel"
              placeholder="请输入手机号"
              className="pl-12 h-11 text-base bg-neutral-50 border-transparent focus-visible:bg-white transition-colors rounded-xl"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="请输入6位验证码"
            className="flex-1 h-11 text-base bg-neutral-50 border-transparent focus-visible:bg-white transition-colors rounded-xl"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-4 font-normal rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 min-w-[100px]"
            onClick={handleSendCode}
            disabled={countdown > 0 || isLoading}
          >
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 font-medium px-1">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium transition-all"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '登录 / 注册'}
      </Button>

      <div className="flex items-center space-x-2 pt-2 px-1">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(c) => setAgreed(c as boolean)}
          className="border-neutral-300 data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900 rounded-sm"
        />
        <label
          htmlFor="terms"
          className="text-xs text-neutral-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          我已阅读并同意 <a href="#" className="text-neutral-900 hover:underline">《用户服务协议》</a> 和 <a href="#" className="text-neutral-900 hover:underline">《隐私政策》</a>
        </label>
      </div>
    </form>
  )
}
