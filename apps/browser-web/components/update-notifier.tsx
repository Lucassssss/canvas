'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function UpdateNotifier() {
  const [open, setOpen] = useState(false)
  const [newVersion, setNewVersion] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__electron) {
      ;(window as any).__electron.ipcRenderer.on('update:web-ready', (event: any, version: string) => {
        setNewVersion(version)
        setOpen(true)
      })

      // We can also trigger a manual check on mount if desired
      // (window as any).__electron.ipcRenderer.invoke('update:check-web')
    }
  }, [])

  const handleApply = async () => {
    setOpen(false)
    if (typeof window !== 'undefined' && (window as any).__electron) {
      await (window as any).__electron.ipcRenderer.invoke('update:apply-web')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发现新版本</DialogTitle>
          <DialogDescription>
            界面已静默下载更新 (v{newVersion})，是否立即刷新以应用新版本？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            稍后提醒
          </Button>
          <Button onClick={handleApply}>立即刷新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
