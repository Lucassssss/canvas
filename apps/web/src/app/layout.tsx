import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Draw - 智能图片生成',
  description: '使用 AI 技术快速生成高质量图片，支持多种换装模式',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
