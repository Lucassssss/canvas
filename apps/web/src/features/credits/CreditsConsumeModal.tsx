'use client'

import React from 'react'
import { Zap, Loader2 } from 'lucide-react'
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

interface CreditsConsumeModalProps {
  onSuccess?: () => void
  onInsufficient?: () => void
}

export function CreditsConsumeModal({ onSuccess, onInsufficient }: CreditsConsumeModalProps) {
  const { user } = useAuth()
  const { 
    isModalOpen, 
    closeConsumeModal, 
    consumeCredits, 
    isConsuming, 
    pendingConsume 
  } = useCredits()

  const handleConfirm = async () => {
    const result = await consumeCredits()
    
    if (result.success) {
      onSuccess?.()
    } else if (result.error === '积分不足') {
      closeConsumeModal()
      onInsufficient?.()
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeConsumeModal()}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            即将消耗 {pendingConsume?.amount} 积分
          </DialogTitle>
          <DialogDescription className="text-neutral-500 mt-2">
            {pendingConsume?.description}，当前余额 {user?.credits} 积分
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          <Button 
            variant="outline" 
            onClick={closeConsumeModal}
            disabled={isConsuming}
            className="flex-1"
          >
            取消
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isConsuming}
            className="flex-1 bg-neutral-900 hover:bg-neutral-800"
          >
            {isConsuming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              '确认生成'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
