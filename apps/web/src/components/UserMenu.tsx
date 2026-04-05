'use client'

import React from 'react'
import { LogOut, User as UserIcon, Zap } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  if (!isAuthenticated || !user) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const navigateToProfile = () => {
    router.push('/profile')
  }

  const initials = user.nickname ? user.nickname.slice(0, 2).toUpperCase() : user.phone.slice(-4)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-transparent ring-offset-2 hover:ring-neutral-200 transition-all focus:outline-none focus-visible:ring-neutral-900">
          <Avatar className="w-8 h-8 border border-neutral-200 shadow-sm">
            <AvatarImage src={user.avatarUrl} alt={user.nickname || user.phone} />
            <AvatarFallback className="bg-neutral-100 text-neutral-600 text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-xl p-2 border-neutral-100 shadow-lg" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-2 py-2.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-neutral-900">
              {user.nickname || 'Joii 用户'}
            </p>
            <p className="text-xs leading-none text-neutral-500 mt-1">
              {user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-100" />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem onClick={navigateToProfile} className="gap-2 px-2 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
            <UserIcon className="w-4 h-4 text-neutral-500" />
            <span>个人中心</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={navigateToProfile} className="gap-2 px-2 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer">
            <Zap className="w-4 h-4 text-amber-500" />
            <div className="flex justify-between w-full items-center">
              <span>我的积分</span>
              <span className="font-medium text-amber-600">{user.credits}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neutral-100" />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 px-2 py-2 rounded-lg hover:bg-red-50 text-red-600 focus:text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
