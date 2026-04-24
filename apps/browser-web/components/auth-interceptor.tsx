"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/useAuthStore"

export function AuthInterceptor() {
  const router = useRouter()
  const { logout } = useAuthStore()
  const [showToast, setShowToast] = React.useState(false)

  React.useEffect(() => {
    const handleUnauthorized = () => {
      logout()
      setShowToast(true)

      // Auto-hide toast after few seconds if user stays
      setTimeout(() => setShowToast(false), 4000)

      // Slight delay before redirect so user sees the message
      setTimeout(() => {
        router.push("/login")
      }, 800)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("auth_unauthorized", handleUnauthorized)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth_unauthorized", handleUnauthorized)
      }
    }
  }, [router, logout])

  if (!showToast) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top-6 fade-in duration-300">
      <div className="bg-gray-50 border border-destructive/20 text-destructive-foreground px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <span>登录过期</span>
      </div>
    </div>
  )
}
