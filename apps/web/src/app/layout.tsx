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

export const metadata: Metadata = {
  title: 'Joii - 无限画布智能设计平台',
  description: 'Joii电商AI神器，让爆单轻松发生',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable, notoSerif.variable, notoSans.variable)}>
      <body>
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
