'use client'

import React, { useEffect, useRef } from 'react'
import { useAuth } from './useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser } = useAuth()
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchUser()
  }, [fetchUser])

  return <>{children}</>
}
