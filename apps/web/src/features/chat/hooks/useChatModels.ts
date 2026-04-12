import { useState, useEffect } from 'react'

export interface ChatModel {
  id: string
  name: string
  provider: string
  credits: number
  category: 'chat'
  description?: string
  icon?: string
}

export function useChatModels() {
  const [models, setModels] = useState<ChatModel[]>([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/credits/pricing`)
      .then(res => res.json())
      .then(data => {
        if (data.models) {
          setModels(data.models.filter((m: any) => m.category === 'chat'))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { models, loading }
}
