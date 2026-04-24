"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RiSubtractLine, RiCheckboxBlankLine, RiCloseLine, RiBook2Line, RiNotification3Line, RiLogoutBoxRLine } from "@remixicon/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function HeaderActions() {
  const router = useRouter()

  const handleLogout = () => {
    // Perform any clear token logic here in the future
    router.push("/login")
  }

  return (
    <div className="flex items-center gap-0.5">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title="文档"
      >
        <RiBook2Line className="h-4 w-4" />
      </button>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title="通知"
      >
        <RiNotification3Line className="h-4 w-4" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors ml-1 hover:ring-2 hover:ring-primary/20 outline-none"
            title="用户"
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="text-[8px] bg-primary font-bold text-white">王</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 mt-1">
          <DropdownMenuItem className="cursor-pointer">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback className="text-[8px] bg-primary font-bold text-white">王</AvatarFallback>
            </Avatar>
            个人资料
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
            <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
            <span>退出登录</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function WindowControls() {
  const [isElectron, setIsElectron] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'desktopBridge' in window) {
      setIsElectron(true)
    }
  }, [])

  if (!isElectron) {
    return null
  }

  const handleMinimize = () => {
    (window as any).desktopBridge?.window?.minimize()
  }

  const handleMaximize = () => {
    (window as any).desktopBridge?.window?.maximize()
  }

  const handleClose = () => {
    (window as any).desktopBridge?.window?.close()
  }

  return (
    <div className="fixed top-3 right-2 z-[100] flex h-14 items-center justify-end gap-0.5 pr-4 no-drag-region bg-transparent">
      <HeaderActions />

      <div className="w-[1px] h-4 bg-border mx-2" />

      <button
        onClick={handleMinimize}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title="最小化"
      >
        <RiSubtractLine className="h-4 w-4" />
      </button>
      <button
        onClick={handleMaximize}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        title="最大化"
      >
        <RiCheckboxBlankLine className="h-3 w-3" />
      </button>
      <button
        onClick={handleClose}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white transition-colors"
        title="关闭"
      >
        <RiCloseLine className="h-4 w-4" />
      </button>
    </div>
  )
}
