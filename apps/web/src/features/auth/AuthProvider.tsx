'use client'

import React, { useEffect, useState } from 'react'
import { LoginModal } from './LoginModal'
import { useAuth } from './useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, token } = useAuth()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    if (token) {
      fetchUser()
    }
  }, [token, fetchUser])

  return (
    <>
      {children}
      {isHydrated && <LoginModal />}
    </>
  )
}
