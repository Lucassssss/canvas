'use client'

import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://sdk.51.la/js-sdk-pro.min.js'
    script.charset = 'UTF-8'
    script.id = 'LA_COLLECT'
    script.onload = () => {
      if (window.LA) {
        window.LA.init({
          id: '3PYx1i4s1cVhLJE7',
          ck: '3PYx1i4s1cVhLJE7',
          autoTrack: true,
          hashMode: true,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('LA_COLLECT')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return null
}
