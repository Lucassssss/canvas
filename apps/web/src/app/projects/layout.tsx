import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的项目',
  description: 'Joii 项目管理 - 查看和管理您的所有AI设计项目。',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
