import { Metadata } from 'next'
import { AuthGuard } from '@/features/auth/AuthGuard'

export const metadata: Metadata = {
  title: '充值记录',
  description: 'Joii 充值记录 - 查看您的所有充值订单记录。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard>{children}</AuthGuard>
}
