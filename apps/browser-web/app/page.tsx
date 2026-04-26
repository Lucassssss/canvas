"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      router.replace("/environments")
    } else {
      router.replace("/login")
    }
  }, [router])

  return null
}
