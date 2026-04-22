"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

// Icons
import { 
  RiLayout4Line, 
  RiFolder2Line, 
  RiMapPinLine, 
  RiPuzzleLine, 
  RiDeleteBinLine, 
  RiCloudLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiRobot2Line,
  RiFileList3Line,
  RiPlug2Line,
  RiWallet3Line,
  RiShieldUserLine,
  RiSettings4Line,
  RiAddBoxLine
} from "@remixicon/react"

const flatNavItems = [
  { title: "环境管理", url: "/environments", icon: RiLayout4Line },
  { title: "分组管理", url: "/groups", icon: RiFolder2Line },
  { title: "代理管理", url: "/proxies", icon: RiMapPinLine },
  { title: "应用中心", url: "/apps", icon: RiPuzzleLine },
  { title: "回收站", url: "/trash", icon: RiDeleteBinLine },
  { title: "云号码", url: "/cloud-numbers", icon: RiCloudLine },
]

const automationNavItems = [
  { title: "窗口同步", url: "/automation/sync", icon: RiLayout4Line },
  { title: "RPA Plus", url: "/automation/rpa", icon: RiRobot2Line },
  { title: "API & MCP", url: "/automation/api", icon: RiPlug2Line },
]

const teamNavItems = [
  { title: "费用中心", url: "/team/billing", icon: RiWallet3Line },
  { title: "成员管理", url: "/team/members", icon: RiShieldUserLine },
  { title: "操作日志", url: "/team/logs", icon: RiFileList3Line },
  { title: "全局设置", url: "/settings", icon: RiSettings4Line },
]

const user = {
  name: "Admin Boss",
  email: "admin@joiiberry.com",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="p-4 pt-6 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4">
        <div className="flex items-center gap-2 mb-6 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shrink-0">
            JB
          </div>
          <span className="text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">Joii Berry</span>
        </div>
        
        {/* 新建浏览器 Button matching AdsPower */}
        <div className="flex gap-0 w-full mb-2 group-data-[collapsible=icon]:hidden">
          <Button className="flex-1 rounded-r-none bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 text-sm h-10 font-normal">
            新建浏览器
          </Button>
          <Button className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white border-l border-blue-500/50 shadow-md shadow-blue-600/20 px-3 h-10">
            <RiAddBoxLine className="h-5 w-5" />
          </Button>
        </div>
        {/* Icon mode New Browser Button */}
        <Button className="hidden group-data-[collapsible=icon]:flex size-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 mx-auto mb-2 shrink-0">
          <RiAddBoxLine className="h-5 w-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Flat Primary Nav */}
        <SidebarGroup>
          <SidebarMenu>
            {flatNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.url || (pathname === '/' && item.url === '/environments')}
                  className="h-9 text-sm mb-1"
                >
                  <Link href={item.url}>
                    <item.icon className="!size-5" />
                    <span className="ml-1">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Automation Group */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1">
                自动化
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu>
                {automationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm mb-1">
                      <Link href={item.url}>
                        <item.icon className="!size-5" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        {/* Team Group */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1">
                团队
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenu>
                {teamNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm mb-1">
                      <Link href={item.url}>
                        <item.icon className="!size-5" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
