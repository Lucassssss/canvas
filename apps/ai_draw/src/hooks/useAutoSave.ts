/**
 * 自动保存 Hook
 * 
 * 功能：
 * 1. 监听画布变化，自动标记为脏数据
 * 2. 定时自动保存（防抖）
 * 3. 页面卸载前保存
 * 
 * 使用方式：
 * ```tsx
 * function Canvas() {
 *   useAutoSave({ intervalMs: 30000 }) // 30秒自动保存
 *   // ...
 * }
 * ```
 */

import { useEffect, useRef } from 'react'
import { useProjectStore } from '../store/project-store'
import { useCanvasStore } from '../canvas/store'

interface UseAutoSaveOptions {
  /** 自动保存间隔（毫秒），默认 30 秒 */
  intervalMs?: number
  /** 是否启用自动保存，默认 true */
  enabled?: boolean
  /** 保存成功回调 */
  onSaveSuccess?: () => void
  /** 保存失败回调 */
  onSaveError?: (error: Error) => void
}

/**
 * 自动保存 Hook
 */
export function useAutoSave(options: UseAutoSaveOptions = {}) {
  const {
    intervalMs = 30000, // 默认 30 秒
    enabled = true,
    onSaveSuccess,
    onSaveError,
  } = options

  const timerRef = useRef<NodeJS.Timeout>()
  const saveInProgressRef = useRef(false)

  // Project Store
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const isDirty = useProjectStore((state) => state.isDirty)
  const saveProject = useProjectStore((state) => state.saveProject)
  const markDirty = useProjectStore((state) => state.markDirty)

  // Canvas Store
  const shapes = useCanvasStore((state) => state.shapes)
  const viewport = useCanvasStore((state) => state.viewport)
  const selectedIds = useCanvasStore((state) => state.selectedIds)

  /**
   * 执行保存
   */
  const performSave = async () => {
    if (!currentProjectId || !isDirty || saveInProgressRef.current) {
      return
    }

    console.log('[Auto Save] Saving project...')
    saveInProgressRef.current = true

    try {
      const canvasData = {
        shapes,
        viewport,
        selectedIds,
      }

      await saveProject(canvasData)
      console.log('[Auto Save] Project saved successfully')
      onSaveSuccess?.()
    } catch (error) {
      console.error('[Auto Save] Failed to save project:', error)
      onSaveError?.(error as Error)
    } finally {
      saveInProgressRef.current = false
    }
  }

  /**
   * 监听画布变化，标记为脏数据
   */
  useEffect(() => {
    if (!enabled || !currentProjectId) {
      return
    }

    console.log('[Auto Save] Canvas changed, marking as dirty')
    markDirty()
  }, [shapes, viewport, enabled, currentProjectId, markDirty])

  /**
   * 定时自动保存
   */
  useEffect(() => {
    if (!enabled || !currentProjectId || !isDirty) {
      return
    }

    console.log(`[Auto Save] Scheduling auto-save in ${intervalMs}ms`)
    
    timerRef.current = setTimeout(() => {
      performSave()
    }, intervalMs)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isDirty, intervalMs, enabled, currentProjectId])

  /**
   * 页面卸载前保存
   */
  useEffect(() => {
    if (!enabled || !currentProjectId) {
      return
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // 提示用户有未保存的更改
        e.preventDefault()
        e.returnValue = ''
        
        // 尝试同步保存（可能不会成功）
        performSave()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isDirty, enabled, currentProjectId])

  /**
   * 手动触发保存
   */
  const triggerSave = () => {
    console.log('[Auto Save] Manual save triggered')
    performSave()
  }

  return {
    /** 是否有未保存的更改 */
    isDirty,
    /** 是否正在保存 */
    isSaving: saveInProgressRef.current,
    /** 手动触发保存 */
    save: triggerSave,
  }
}
