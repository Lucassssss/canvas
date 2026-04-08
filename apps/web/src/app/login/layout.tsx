import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登录',
  description: '登录 Joii - 开始您的AI电商设计之旅。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
