import { Metadata } from 'next'
import { BrowserLandingPage } from '@/features/landing/browser/BrowserLandingPage'

export const metadata: Metadata = {
  title: '浆果浏览器 - 跨境电商防关联指纹浏览器 | 物理级多开隔离安全方案',
  description: '基于大厂级底层架构的指纹浏览器，专为跨境电商打造。提供100%物理级防关联、多账号环境安全隔离、纯净IP直连。适用于亚马逊、TikTok、Facebook等平台多开防封，支持团队协作与免密共享。',
  keywords: [
    '浆果浏览器', '跨境电商指纹浏览器', '亚马逊防关联多开', 'TikTok多账号运营',
    '跨境多账号管理工具', '独立站防封号浏览器', 'Facebook投流多开',
    '物理级防关联浏览器', '团队协作免密指纹浏览器', '安全指纹浏览器'
  ]
}

export default function BrowserPage() {
  return <BrowserLandingPage />
}
