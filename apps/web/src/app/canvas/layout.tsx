import { Metadata } from 'next'
import { AuthGuard } from '@/features/auth/AuthGuard'

export const metadata: Metadata = {
  title: '画布',
  description: 'Joii 无限画布 - AI驱动的电商视觉创作工具，支持智能换装、批量生成、4K无损输出。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CanvasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
