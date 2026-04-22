"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import logoRound from "@/images/joii_berry_logo_round.svg"
import logoWithText from "@/images/joii_berry_logo_withtext.svg"

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
  RiRobot2Line,
  RiFileList3Line,
  RiPlug2Line,
  RiWallet3Line,
  RiShieldUserLine,
  RiSettings4Line,
  RiAddBoxLine
} from "@remixicon/react"

const flatNavItems = [
  { title: "环境管理", shortTitle: "环境", url: "/environments", icon: RiLayout4Line },
  { title: "分组管理", shortTitle: "分组", url: "/groups", icon: RiFolder2Line },
  { title: "代理管理", shortTitle: "代理", url: "/proxies", icon: RiMapPinLine },
  { title: "应用中心", shortTitle: "应用", url: "/apps", icon: RiPuzzleLine },
  { title: "回收站", shortTitle: "回收", url: "/trash", icon: RiDeleteBinLine },
  { title: "云号码", shortTitle: "号码", url: "/cloud-numbers", icon: RiCloudLine },
]

const automationNavItems = [
  { title: "窗口同步", shortTitle: "同步", url: "/automation/sync", icon: RiLayout4Line },
  { title: "RPA Plus", shortTitle: "RPA", url: "/automation/rpa", icon: RiRobot2Line },
  { title: "API & MCP", shortTitle: "API", url: "/automation/api", icon: RiPlug2Line },
]

const teamNavItems = [
  { title: "费用中心", shortTitle: "费用", url: "/team/billing", icon: RiWallet3Line },
  { title: "成员管理", shortTitle: "成员", url: "/team/members", icon: RiShieldUserLine },
  { title: "操作日志", shortTitle: "日志", url: "/team/logs", icon: RiFileList3Line },
  { title: "全局设置", shortTitle: "设置", url: "/settings", icon: RiSettings4Line },
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
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pt-4">
        {/* Logo Container */}
        <div className="flex items-center justify-center mb-4 h-8 overflow-hidden">
          <Image src={logoRound} alt="Joii Berry" className="hidden group-data-[collapsible=icon]:block h-8 w-auto object-contain" />
          <Image src={logoWithText} alt="Joii Berry" className="block group-data-[collapsible=icon]:hidden h-8 w-auto object-contain pl-2" />
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
        <Button className="hidden group-data-[collapsible=icon]:flex size-10 p-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 mb-2 shrink-0 self-center">
          <RiAddBoxLine className="h-5 w-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        {/* Flat Primary Nav */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarMenu>
            {flatNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url || (pathname === '/' && item.url === '/environments')}
                  className="h-9 text-sm group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                  tooltip={item.title}
                >
                  <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                    <item.icon className="!size-5 shrink-0" />
                    <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                    <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Automation Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1 group-data-[collapsible=icon]:hidden">
                自动化
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent className="group-data-[collapsible=icon]:!hidden">
              <SidebarMenu>
                {automationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm" tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
            {/* Fallback for icon mode (Automation items shown as flat in icon mode) */}
            <div className="hidden group-data-[collapsible=icon]:block group-data-[collapsible=icon]:mt-2">
              <SidebarMenu>
                {automationNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="h-9 text-sm mb-1 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </Collapsible>
        </SidebarGroup>

        {/* Team Group */}
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <Collapsible defaultOpen className="group/collapsible">
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sm font-normal text-muted-foreground hover:bg-muted cursor-pointer flex items-center justify-between mb-1 group-data-[collapsible=icon]:hidden">
                团队
                <RiArrowDownSLine className="size-4 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent className="group-data-[collapsible=icon]:!hidden">
              <SidebarMenu>
                {teamNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} className="h-9 text-sm" tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
            {/* Fallback for icon mode (Team items shown as flat in icon mode) */}
            <div className="hidden group-data-[collapsible=icon]:block group-data-[collapsible=icon]:mt-2">
              <SidebarMenu>
                {teamNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="h-9 text-sm mb-1 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!p-1 group-data-[collapsible=icon]:mb-0 group-data-[collapsible=icon]:justify-center"
                      tooltip={item.title}
                    >
                      <Link href={item.url} className="flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-1">
                        <item.icon className="!size-5 shrink-0" />
                        <span className="ml-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
                        <span className="hidden group-data-[collapsible=icon]:block text-[10px] leading-none text-neutral-500 font-normal">{item.shortTitle}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </Collapsible>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
