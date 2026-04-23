"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PageHeader } from "@/components/ui/page-header"

export default function AccessControlLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { name: "登录控制", path: "/team/access-control/login" },
    { name: "访问策略", path: "/team/access-control/policies" },
    { name: "访问日志", path: "/team/access-control/logs" },
  ]

  const currentTabName = tabs.find(t => pathname.includes(t.path))?.name || "访问控制"

  return (
    <>
      <PageHeader breadcrumb={[{ label: "团队管理" }, { label: "访问控制" }, { label: currentTabName }]} />
      <div className="flex flex-1 overflow-hidden bg-background">
        
        {/* Access Control Sidebar */}
        <div className="w-48 border-r border-border bg-muted/10 p-4 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname.includes(tab.path)
            return (
              <Link key={tab.path} href={tab.path}>
                <div className={`px-3 py-2 text-sm rounded-md cursor-pointer font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/50'}`}>
                  {tab.name}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {children}
        </div>

      </div>
    </>
  )
}
