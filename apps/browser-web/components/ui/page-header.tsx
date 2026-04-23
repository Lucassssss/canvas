import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface PageHeaderProps {
  breadcrumb: Array<{ label: string; href?: string }>;
}

export function PageHeader({ breadcrumb }: PageHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 [-webkit-app-region:drag]">
      <div className="flex items-center gap-2 [-webkit-app-region:no-drag]">
        <SidebarTrigger className="-ml-1 text-muted-foreground" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumb.length - 1 ? (
                    <BreadcrumbPage className="text-foreground">{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink href={item.href} className="text-muted-foreground hover:text-foreground">{item.label}</BreadcrumbLink>
                  ) : (
                    <span className="text-muted-foreground">{item.label}</span>
                  )}
                </BreadcrumbItem>
                {index < breadcrumb.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block text-muted-foreground" />
                )}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
