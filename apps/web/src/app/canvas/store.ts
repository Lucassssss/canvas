import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ShapeProps, ViewportState, ToolType, HistoryEntry } from './shapes/types'
import { nanoid } from 'nanoid'
import { localStorageManager } from '@/lib/storage/local'
import { jsonExporter, jsonImporter } from '@/lib/import-export/json'
import type { CanvasHistoryEntry, OperationType } from '@/types/canvas/mvp'
import { projectApi } from '@/lib/api/project-api'
import type { CanvasData } from '@/types/project'

const isBrowser = typeof window !== 'undefined'

// 自动保存配置
const AUTO_SAVE_DELAY = 2000 // 2秒防抖

const DECIMALS = 2

function roundValue(value: number): number {
  return Math.round(value * Math.pow(10, DECIMALS)) / Math.pow(10, DECIMALS)
}

function roundProps<T extends Record<string, unknown>>(props: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'number') {
      result[key] = roundValue(value)
    } else {
      result[key] = value
    }
  }
  return result as T
}

interface CanvasStore {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: ViewportState
  activeTool: ToolType
  activeAICategory: string | null
  history: HistoryEntry[]
  historyIndex: number
  isDragging: boolean
  isResizing: boolean
  isRotating: boolean
  clipboard: ShapeProps[]
  logoEditingState: {
    isEditing: boolean
    previousViewport: ViewportState | null
    targetShapeId: string | null
    targetLogoId: string | null
  }

  projectId: string | null
  projectName: string
  isDirty: boolean
  lastSavedAt: number | null
  saveTrigger: number
  autoSaveTimer: NodeJS.Timeout | null
  isSaving: boolean

  setShapes: (shapes: ShapeProps[]) => void
  addShape: (shape: Omit<ShapeProps, 'id'>) => ShapeProps
  updateShape: (id: string, props: Partial<ShapeProps>) => void
  deleteShape: (id: string) => void
  deleteSelectedShapes: () => void

  setSelectedIds: (ids: string[]) => void
  addToSelection: (id: string) => void
  removeFromSelection: (id: string) => void
  clearSelection: () => void

  setViewport: (viewport: Partial<ViewportState>) => void
  zoomIn: () => void
  zoomOut: () => void
  zoomToFit: () => void
  resetZoom: () => void
  zoomToArea: (x: number, y: number, width: number, height: number) => void
  focusOnArea: (x: number, y: number, width: number, height: number, options?: { padding?: number; maxZoom?: number }) => void
  exitLogoEditing: () => void

  setActiveTool: (tool: ToolType) => void
  setActiveAICategory: (categoryId: string | null) => void

  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
  setIsRotating: (isRotating: boolean) => void
  dragData: { shapeId: string; imageUrl: string } | null
  setDragData: (data: { shapeId: string; imageUrl: string } | null) => void

  undo: () => void
  redo: () => void
  saveHistory: (operationType?: OperationType, description?: string) => void

  copySelectedShapes: () => void
  pasteShapes: () => string[]
  duplicateSelectedShapes: () => void
  bringToFront: () => void
  sendToBack: () => void

  screenToCanvas: (screenX: number, screenY: number) => { x: number; y: number }
  canvasToScreen: (canvasX: number, canvasY: number) => { x: number; y: number }

  setProjectId: (id: string | null) => void
  setProjectName: (name: string) => void
  markDirty: () => void
  markSaved: () => void
  resetCanvas: () => void
  loadFromSnapshot: (snapshot: { shapes: ShapeProps[]; viewport: ViewportState }) => void
  loadProject: (projectId: string) => Promise<void>
  exportProject: (name: string) => void
  importProject: (jsonString: string) => { success: boolean; error?: string }
  importFromFile: (file: File) => Promise<{ success: boolean; error?: string }>
  autoSave: () => void
  loadAutoSave: () => boolean
  saveToServer: () => Promise<void>
  scheduleAutoSave: () => void
  cancelAutoSave: () => void
}

const initialState = {
  shapes: [] as ShapeProps[],
  selectedIds: [] as string[],
  viewport: { x: 0, y: 0, zoom: 1 } as ViewportState,
  activeTool: 'select' as ToolType,
  activeAICategory: null as string | null,
  history: [] as HistoryEntry[],
  historyIndex: -1,
  isDragging: false,
  isResizing: false,
  isRotating: false,
  clipboard: [] as ShapeProps[],
  logoEditingState: {
    isEditing: false,
    previousViewport: null,
    targetShapeId: null,
    targetLogoId: null,
  },
  projectId: null as string | null,
  projectName: 'Untitled Project',
  isDirty: false,
  lastSavedAt: null as number | null,
  saveTrigger: 0,
  autoSaveTimer: null as NodeJS.Timeout | null,
  isSaving: false,
  dragData: null as { shapeId: string; imageUrl: string } | null,
}

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setShapes: (shapes) => {
        set({ shapes, isDirty: true })
        get().scheduleAutoSave()
      },

      addShape: (shape) => {
        const newShape: ShapeProps = {
          ...shape,
          id: nanoid(),
        }
        set((state) => ({ shapes: [...state.shapes, newShape], isDirty: true }))
        get().saveHistory('create', `Create ${shape.type}`)
        get().scheduleAutoSave()
        return newShape
      },

      updateShape: (id, props) => {
        const roundedProps = roundProps(props)
        set((state) => ({
          shapes: state.shapes.map((s) =>
            s.id === id ? { ...s, ...roundedProps } : s
          ),
          isDirty: true
        }))
        get().scheduleAutoSave()
      },

      deleteShape: (id) => {
        set((state) => ({
          shapes: state.shapes.filter((s) => s.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
          isDirty: true
        }))
        get().saveHistory('delete', 'Delete shape')
        get().scheduleAutoSave()
      },

      deleteSelectedShapes: () => {
        const { selectedIds } = get()
        set((state) => ({
          shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
          selectedIds: [],
          isDirty: true
        }))
        get().saveHistory('batch', `Delete ${selectedIds.length} shapes`)
        get().scheduleAutoSave()
      },

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  addToSelection: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds
        : [...state.selectedIds, id],
    }))
  },

  removeFromSelection: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }))
  },

  clearSelection: () => set({ selectedIds: [] }),

  setViewport: (viewport) => {
    set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    }))
  },

  zoomIn: () => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.min(state.viewport.zoom * 1.2, 10) },
    }))
  },

  zoomOut: () => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: Math.max(state.viewport.zoom / 1.2, 0.1) },
    }))
  },

  zoomToFit: () => {
    const { shapes } = get()
    if (shapes.length === 0) {
      set({ viewport: { x: 0, y: 0, zoom: 1 } })
      return
    }

    const minX = Math.min(...shapes.map((s) => s.x))
    const minY = Math.min(...shapes.map((s) => s.y))
    const maxX = Math.max(...shapes.map((s) => s.x + s.width))
    const maxY = Math.max(...shapes.map((s) => s.y + s.height))

    const padding = 50
    const contentWidth = maxX - minX + padding * 2
    const contentHeight = maxY - minY + padding * 2

    const viewportWidth = window.innerWidth - 64 - 320
    const viewportHeight = window.innerHeight - 56 - 80

    const zoom = Math.min(
      viewportWidth / contentWidth,
      viewportHeight / contentHeight,
      1
    )

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    set({
      viewport: {
        x: viewportWidth / 2 / zoom - centerX,
        y: viewportHeight / 2 / zoom - centerY,
        zoom,
      },
    })
  },

  resetZoom: () => {
    set((state) => ({
      viewport: { ...state.viewport, zoom: 1 },
    }))
  },

  zoomToArea: (x, y, width, height) => {
    const { viewport } = get()
    const padding = 20
    const sidebarWidth = 320
    const topOffset = 56
    const bottomOffset = 80

    const containerWidth = window.innerWidth - sidebarWidth
    const containerHeight = window.innerHeight - topOffset - bottomOffset

    const scaleX = containerWidth / (width + padding * 2)
    const scaleY = containerHeight / (height + padding * 2)
    const zoom = Math.min(scaleX, scaleY, 10)

    const centerX = x + width / 2
    const centerY = y + height / 2

    const newViewport = {
      x: containerWidth / 2 - centerX * zoom,
      y: containerHeight / 2 - centerY * zoom + topOffset,
      zoom,
    }

    set({
      viewport: newViewport,
      logoEditingState: {
        isEditing: true,
        previousViewport: { x: viewport.x, y: viewport.y, zoom: viewport.zoom },
        targetShapeId: null,
        targetLogoId: null,
      },
    })
  },

  focusOnArea: (x, y, width, height, options) => {
    const padding = options?.padding ?? 40
    const maxZoom = options?.maxZoom ?? 1
    const sidebarWidth = 320
    const topOffset = 56
    const bottomOffset = 80

    const containerWidth = window.innerWidth - sidebarWidth
    const containerHeight = window.innerHeight - topOffset - bottomOffset

    const scaleX = containerWidth / (width + padding * 2)
    const scaleY = containerHeight / (height + padding * 2)
    const zoom = Math.min(scaleX, scaleY, maxZoom)

    const centerX = x + width / 2
    const centerY = y + height / 2

    const newViewport = {
      x: containerWidth / 2 - centerX * zoom,
      y: containerHeight / 2 - centerY * zoom + topOffset,
      zoom,
    }

    set({ viewport: newViewport })
  },

  exitLogoEditing: () => {
    const { logoEditingState, shapes, selectedIds } = get()
    if (logoEditingState.previousViewport) {
      set({
        viewport: logoEditingState.previousViewport,
      })
    }

    const selectedClothing = shapes.find(
      (s) => s.type === 'clothing' && selectedIds.includes(s.id) && s.activeLogoId
    )
    if (selectedClothing) {
      useCanvasStore.getState().updateShape(selectedClothing.id, { activeLogoId: undefined })
    }

    set({
      logoEditingState: {
        isEditing: false,
        previousViewport: null,
        targetShapeId: null,
        targetLogoId: null,
      },
    })
  },

  setActiveTool: (tool) => set({ activeTool: tool }),
  setActiveAICategory: (categoryId) => set({ activeAICategory: categoryId }),

  setIsDragging: (isDragging) => set({ isDragging }),
  setIsResizing: (isResizing) => set({ isResizing }),
  setIsRotating: (isRotating) => set({ isRotating }),
  setDragData: (data) => set({ dragData: data }),

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1]
      set({
        shapes: prevEntry.shapes,
        selectedIds: prevEntry.selectedIds,
        historyIndex: historyIndex - 1,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const nextEntry = history[historyIndex + 1]
      set({
        shapes: nextEntry.shapes,
        selectedIds: nextEntry.selectedIds,
        historyIndex: historyIndex + 1,
      })
    }
  },

  saveHistory: (operationType?: OperationType, description?: string) => {
        const { shapes, selectedIds, history, historyIndex } = get()
        const newEntry: HistoryEntry = {
          shapes: JSON.parse(JSON.stringify(shapes)),
          selectedIds: [...selectedIds],
        }
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push(newEntry)
        if (newHistory.length > 50) {
          newHistory.shift()
        }
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        })

        localStorageManager.saveHistory(
          newHistory.map((e) => ({
            ...e,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            timestamp: Date.now(),
            operationType: operationType || 'batch',
            description: description || 'Operation',
          })) as CanvasHistoryEntry[],
          newHistory.length - 1
        )
      },

      copySelectedShapes: () => {
        const { shapes, selectedIds } = get()
        const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
        set({ clipboard: JSON.parse(JSON.stringify(selectedShapes)) })
        localStorageManager.saveClipboard(selectedShapes)
      },

      pasteShapes: () => {
        const { shapes, clipboard } = get()
        if (clipboard.length === 0) return []

        const PASTE_OFFSET = 20
        const newIds: string[] = []

        const newShapes = clipboard.map((shape) => {
          const newId = nanoid()
          newIds.push(newId)
          return {
            ...shape,
            id: newId,
            x: shape.x + PASTE_OFFSET,
            y: shape.y + PASTE_OFFSET,
          }
        })

        set({ shapes: [...shapes, ...newShapes], isDirty: true })
        get().saveHistory('batch', `Paste ${newShapes.length} shapes`)
        get().scheduleAutoSave()
        return newIds
      },

      duplicateSelectedShapes: () => {
        const { shapes, selectedIds } = get()
        const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))

        const DUPLICATE_OFFSET = 20
        const newIds: string[] = []

        const newShapes = selectedShapes.map((shape) => {
          const newId = nanoid()
          newIds.push(newId)
          return {
            ...shape,
            id: newId,
            x: shape.x + DUPLICATE_OFFSET,
            y: shape.y + DUPLICATE_OFFSET,
          }
        })

        set({
          shapes: [...shapes, ...newShapes],
          selectedIds: newIds,
          isDirty: true,
        })
        get().saveHistory('batch', `Duplicate ${newShapes.length} shapes`)
        get().scheduleAutoSave()
      },

      bringToFront: () => {
        const { shapes, selectedIds } = get()
        if (selectedIds.length === 0) return

        const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
        const remainingShapes = shapes.filter((s) => !selectedIds.includes(s.id))
        const newShapes = [...remainingShapes, ...selectedShapes]

        set({ shapes: newShapes, isDirty: true })
        get().saveHistory('batch', 'Bring to front')
        get().scheduleAutoSave()
      },

      sendToBack: () => {
        const { shapes, selectedIds } = get()
        if (selectedIds.length === 0) return

        const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
        const remainingShapes = shapes.filter((s) => !selectedIds.includes(s.id))
        const newShapes = [...selectedShapes, ...remainingShapes]

        set({ shapes: newShapes, isDirty: true })
        get().saveHistory('batch', 'Send to back')
        get().scheduleAutoSave()
      },

      screenToCanvas: (screenX, screenY) => {
        const { viewport } = get()
        return {
          x: (screenX - viewport.x) / viewport.zoom,
          y: (screenY - viewport.y) / viewport.zoom,
        }
      },

      canvasToScreen: (canvasX, canvasY) => {
        const { viewport } = get()
        return {
          x: canvasX * viewport.zoom + viewport.x,
          y: canvasY * viewport.zoom + viewport.y,
        }
      },

      setProjectId: (id) => set({ projectId: id }),
      setProjectName: (name) => set({ projectName: name, isDirty: true }),
      markDirty: () => set({ isDirty: true }),
      markSaved: () => set((state) => ({ isDirty: false, lastSavedAt: Date.now(), saveTrigger: state.saveTrigger + 1 })),

      resetCanvas: () => {
        const { projectId, projectName } = get()
        set({
          ...initialState,
          projectId,
          projectName,
        })
      },

      loadFromSnapshot: (snapshot) => {
        set({
          shapes: snapshot.shapes,
          viewport: snapshot.viewport,
          selectedIds: [],
          history: [],
          historyIndex: -1,
          isDirty: false,
        })
      },

      /**
       * 加载项目数据
       * 从服务器加载项目的画布数据
       */
      loadProject: async (projectId: string) => {
        console.log(`[Canvas Store] Loading project: ${projectId}`)
        
        try {
          const project = await projectApi.getProject(projectId)
          
          if (project && project.canvasData) {
            console.log(`[Canvas Store] Project loaded: ${project.name}`)
            
            set({
              projectId: project.id,
              projectName: project.name,
              shapes: project.canvasData.shapes || [],
              viewport: project.canvasData.viewport || { x: 0, y: 0, zoom: 1 },
              selectedIds: [], // 重置选中状态
              history: [],
              historyIndex: -1,
              isDirty: false,
              lastSavedAt: project.updatedAt,
            })
            
            // 初始化历史记录
            get().saveHistory('batch', 'Load project')
          }
        } catch (error) {
          console.error('[Canvas Store] Failed to load project:', error)
          
          // 尝试从本地备份恢复
          const backup = localStorage.getItem(`canvas-backup-${projectId}`)
          if (backup) {
            console.log('[Canvas Store] Restoring from local backup')
            const data = JSON.parse(backup)
            set({
              projectId,
              shapes: data.shapes || [],
              viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
              selectedIds: [],
            })
          }
          
          throw error
        }
      },

      /**
       * 保存到服务器
       * 将当前画布数据保存到后端
       */
      saveToServer: async () => {
        const { projectId, shapes, viewport, isSaving } = get()
        
        // 没有项目ID或正在保存中，跳过
        if (!projectId || isSaving) {
          return
        }
        
        console.log(`[Canvas Store] Saving to server: ${projectId}`)
        set({ isSaving: true })
        
        try {
          const canvasData: CanvasData = {
            shapes,
            viewport,
            selectedIds: [], // 不保存选中状态
          }
          
          await projectApi.saveCanvasData(projectId, canvasData)
          
          set((state) => ({
            isDirty: false,
            lastSavedAt: Date.now(),
            saveTrigger: state.saveTrigger + 1
          }))
          
          console.log('[Canvas Store] Saved successfully')
          
          // 清除本地备份
          localStorage.removeItem(`canvas-backup-${projectId}`)
        } catch (error) {
          console.error('[Canvas Store] Save failed:', error)
          
          // 保存到本地作为备份
          const { shapes, viewport } = get()
          localStorage.setItem(
            `canvas-backup-${projectId}`, 
            JSON.stringify({ shapes, viewport, timestamp: Date.now() })
          )
          
          console.log('[Canvas Store] Saved to local backup')
        } finally {
          set({ isSaving: false })
        }
      },

      /**
       * 调度自动保存
       * 使用防抖机制，避免频繁保存
       */
      scheduleAutoSave: () => {
        const { autoSaveTimer, projectId } = get()
        
        // 如果没有项目ID，不保存
        if (!projectId) {
          return
        }
        
        // 清除之前的定时器
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer)
        }
        
        // 设置新的定时器
        const timer = setTimeout(() => {
          get().saveToServer()
        }, AUTO_SAVE_DELAY)
        
        set({ autoSaveTimer: timer, isDirty: true })
      },

      /**
       * 取消自动保存
       */
      cancelAutoSave: () => {
        const { autoSaveTimer } = get()
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer)
          set({ autoSaveTimer: null })
        }
      },

      exportProject: (name) => {
        const { shapes, viewport } = get()
        jsonExporter.downloadAsFile({ shapes, viewport }, name)
      },

      importProject: (jsonString) => {
        const result = jsonImporter.import(jsonString)
        if (result.success && result.project) {
          const canvasState = jsonImporter.extractCanvasState(result.project)
          get().loadFromSnapshot(canvasState)
          const meta = result.project.metadata
          set({
            projectName: meta.name,
            isDirty: false,
          })
          return { success: true }
        }
        return { success: false, error: result.error }
      },

      importFromFile: async (file) => {
        const result = await jsonImporter.importFromFile(file)
        if (result.success && result.project) {
          const canvasState = jsonImporter.extractCanvasState(result.project)
          get().loadFromSnapshot(canvasState)
          const meta = result.project.metadata
          set({
            projectName: meta.name,
            isDirty: false,
          })
          return { success: true }
        }
        return { success: false, error: result.error }
      },

      autoSave: () => {
        const { shapes, viewport, projectId, projectName } = get()
        localStorageManager.saveProjectSnapshot({
          id: projectId || `local-${Date.now()}`,
          name: projectName,
          shapes,
          viewport,
          selectedIds: [],
          updatedAt: Date.now(),
          version: '1.0',
        })
        set((state) => ({ isDirty: false, lastSavedAt: Date.now(), saveTrigger: state.saveTrigger + 1 }))
      },

      loadAutoSave: () => {
        const snapshot = localStorageManager.loadProjectSnapshot()
        if (snapshot) {
          get().loadFromSnapshot({
            shapes: snapshot.shapes,
            viewport: snapshot.viewport,
          })
          set({
            projectName: snapshot.name,
            isDirty: false,
          })
          return true
        }
        return false
      },
    }),
    {
      name: 'joii-canvas-state',
      partialize: (state) => ({
        shapes: state.shapes,
        viewport: state.viewport,
        projectId: state.projectId,
        projectName: state.projectName,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
)
