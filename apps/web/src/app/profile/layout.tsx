import { Metadata } from 'next'
import { AuthGuard } from '@/features/auth/AuthGuard'

export const metadata: Metadata = {
  title: '个人中心',
  description: 'Joii 个人中心 - 管理您的账户信息、订阅和偏好设置。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
