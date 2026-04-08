import type { Metadata } from 'next'
import './globals.css'
import { Geist, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const notoSerif = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-serif-zh',
});
const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans-zh',
});

import { AuthProvider } from '@/features/auth/AuthProvider';
import { BaiduSEO } from '@/components/BaiduSEO';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL('https://joii.cc'),
  title: {
    default: 'Joii - 无限画布智能设计平台 | AI电商设计工具',
    template: '%s | Joii',
  },
  description: 'Joii电商AI神器，让爆单轻松发生。基于AI的无限画布设计工具，专为电商场景打造，支持智能换装、批量生成、4K无损输出。一键生成电商主图、详情页、营销海报。',
  keywords: ['AI设计', '电商设计', '无限画布', '智能设计', 'Joii', 'AI画布', '电商作图', '设计工具', '批量生成', 'AI绘图', '电商主图设计', '详情页设计', 'AI换装', '电商AI工具', '智能作图'],
  authors: [{ name: 'Joii Team' }],
  creator: 'Joii',
  publisher: 'Joii',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://joii.cc',
    siteName: 'Joii',
    title: 'Joii - 无限画布智能设计平台 | AI电商设计工具',
    description: 'Joii电商AI神器，让爆单轻松发生。基于AI的无限画布设计工具，专为电商场景打造。',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Joii - 无限画布智能设计平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joii - 无限画布智能设计平台',
    description: 'Joii电商AI神器，让爆单轻松发生。基于AI的无限画布设计工具。',
    images: ['/opengraph-image.png'],
    creator: '@joii_design',
  },
  alternates: {
    canonical: 'https://joii.cc',
    languages: {
      'zh-CN': 'https://joii.cc',
      'en-US': 'https://joii.cc/en',
    },
  },
  category: 'Design Tools',
  other: {
    'baidu-site-verification': 'codeva-ULkpJAO80W',
    'applicable-device': 'pc,mobile',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://joii.cc/#organization',
      name: 'Joii',
      url: 'https://joii.cc',
      logo: {
        '@type': 'ImageObject',
        url: 'https://joii.cc/logo.png',
      },
      description: 'Joii电商AI神器，让爆单轻松发生。基于AI的无限画布设计工具，专为电商场景打造。',
      sameAs: [
        'https://twitter.com/joii_design',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://joii.cc/#website',
      url: 'https://joii.cc',
      name: 'Joii - 无限画布智能设计平台',
      description: 'Joii电商AI神器，让爆单轻松发生。基于AI的无限画布设计工具，专为电商场景打造。',
      publisher: {
        '@id': 'https://joii.cc/#organization',
      },
      inLanguage: 'zh-CN',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Joii',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1000',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable, notoSerif.variable, notoSans.variable)}>
      <body>
        <BaiduSEO />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="zh-CN">
//       <body>{children}</body>
//     </html>
//   );
// }