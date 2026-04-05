'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCredits } from './useCredits'
import { useAuth } from '@/features/auth/useAuth'

export function CreditsInsufficientModal() {
  const { user } = useAuth()
  const { isInsufficientModalOpen, closeInsufficientModal } = useCredits()

  return (
    <Dialog open={isInsufficientModalOpen} onOpenChange={(open) => !open && closeInsufficientModal()}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-semibold text-red-600">
            积分不足
          </DialogTitle>
          <DialogDescription className="text-neutral-500 mt-2">
            当前余额: {user?.credits} 积分
            <br />
            请先升级套餐获取更多积分
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          <Button 
            variant="outline" 
            onClick={closeInsufficientModal}
            className="flex-1"
          >
            取消
          </Button>
          <Link href="/packages" className="flex-1">
            <Button 
              onClick={closeInsufficientModal}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white"
            >
              升级套餐
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
