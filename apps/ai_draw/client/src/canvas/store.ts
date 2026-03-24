import { create } from 'zustand'
import { ShapeProps, ViewportState, ToolType, HistoryEntry } from './shapes/types'
import { generateId } from '@/lib/utils'

interface CanvasStore {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: ViewportState
  activeTool: ToolType
  history: HistoryEntry[]
  historyIndex: number
  isDragging: boolean
  isResizing: boolean
  isRotating: boolean

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

  setActiveTool: (tool: ToolType) => void

  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
  setIsRotating: (isRotating: boolean) => void

  undo: () => void
  redo: () => void
  saveHistory: () => void

  screenToCanvas: (screenX: number, screenY: number) => { x: number; y: number }
  canvasToScreen: (canvasX: number, canvasY: number) => { x: number; y: number }
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  shapes: [],
  selectedIds: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  activeTool: 'select',
  history: [],
  historyIndex: -1,
  isDragging: false,
  isResizing: false,
  isRotating: false,

  setShapes: (shapes) => set({ shapes }),

  addShape: (shape) => {
    const newShape: ShapeProps = {
      ...shape,
      id: generateId(),
    }
    set((state) => ({ shapes: [...state.shapes, newShape] }))
    get().saveHistory()
    return newShape
  },

  updateShape: (id, props) => {
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...props } : s
      ),
    }))
  },

  deleteShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }))
    get().saveHistory()
  },

  deleteSelectedShapes: () => {
    set((state) => ({
      shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
      selectedIds: [],
    }))
    get().saveHistory()
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

  setActiveTool: (tool) => set({ activeTool: tool }),

  setIsDragging: (isDragging) => set({ isDragging }),
  setIsResizing: (isResizing) => set({ isResizing }),
  setIsRotating: (isRotating) => set({ isRotating }),

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

  saveHistory: () => {
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
}))
