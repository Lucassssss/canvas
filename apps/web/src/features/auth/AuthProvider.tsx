'use client'

import React from 'react'
import { LoginModal } from './LoginModal'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LoginModal />
    </>
  )
}
