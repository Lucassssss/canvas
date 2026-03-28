/**
 * 保存状态指示器
 *
 * 保存成功后显示 "已保存" 提示，1秒后自动隐藏
 * 位置：左下角，缩放控制器右侧
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useCanvasStore } from '../store'

export const SaveIndicator: React.FC = () => {
  const { projectId, saveTrigger } = useCanvasStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const prevSaveTriggerRef = React.useRef(0)

  useEffect(() => {
    if (!projectId) return

    if (saveTrigger !== prevSaveTriggerRef.current) {
      prevSaveTriggerRef.current = saveTrigger
      setShowSuccess(true)

      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [saveTrigger, projectId])

  if (!projectId || !showSuccess) {
    return null
  }

  return (
    <div className="fixed bottom-[28px] left-[200px] z-50 flex items-center gap-2 px-2 py-2 bg-white border border-neutral-200 rounded-full shadow-lg text-xs animate-in fade-in duration-200">
      <Check size={14} className="text-green-500" />
      {/* <span className="text-neutral-600">已保存</span> */}
    </div>
  )
}
