'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from './useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const hasFetched = useRef(false)

  useEffect(() => {
    setMounted(true)
    if (hasFetched.current) return
    hasFetched.current = true
    fetchUser()
  }, [fetchUser])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
