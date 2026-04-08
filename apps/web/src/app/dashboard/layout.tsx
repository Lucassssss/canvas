import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '工作台',
  description: 'Joii 工作台 - 管理您的AI设计项目，快速访问智能换装、无限画布等功能。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
