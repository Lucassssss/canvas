'use client'

import React from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  rightContent?: React.ReactNode
}

export function PageHeader({ breadcrumbs, rightContent }: PageHeaderProps) {
  return (
    <header className="w-full h-16 md:h-20 flex items-center justify-between px-6 md:px-12 sticky top-0 z-10 bg-white border-b border-neutral-100">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center">
              <img src="/joii_logo_fa.svg" alt="LOGO" className="h-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href} className="font-sans-zh text-sm text-neutral-500">
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-sans-zh text-sm text-neutral-400">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-4">
        {rightContent || (
          <span className="font-sans-zh text-sm text-neutral-500">简体中文</span>
        )}
      </div>
    </header>
  )
}
