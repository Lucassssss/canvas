'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'

import { authApi } from '@/lib/api/auth-api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, logout } = useAuth()
  const hasFetched = useRef(false)
  const router = useRouter()

  // 初始化时拉取用户信息
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    
    const urlParams = new URLSearchParams(window.location.search);
    const ssoToken = urlParams.get('sso_token');
    
    if (ssoToken) {
      authApi.ssoLogin(ssoToken)
        .then(data => {
          if (data.success) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('sso_token');
            window.history.replaceState({}, document.title, newUrl.pathname + newUrl.search);
          } else {
            console.error("SSO Login failed:", data.error);
          }
        })
        .catch(err => {
          console.error("SSO Login fetch error:", err);
        })
        .finally(() => {
          fetchUser();
        });
    } else {
      fetchUser()
    }
  }, [fetchUser])

  // 监听 API 客户端派发的 401 事件，自动清除状态并跳转登录
  useEffect(() => {
    const handleUnauthorized = () => {
      logout().then(() => {
        router.replace('/login')
      })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [logout, router])

  return <>{children}</>
}
