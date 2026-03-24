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
  clipboard: ShapeProps[]
  logoEditingState: {
    isEditing: boolean
    previousViewport: ViewportState | null
    targetShapeId: string | null
    targetLogoId: string | null
  }

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
  exitLogoEditing: () => void

  setActiveTool: (tool: ToolType) => void

  setIsDragging: (isDragging: boolean) => void
  setIsResizing: (isResizing: boolean) => void
  setIsRotating: (isRotating: boolean) => void

  undo: () => void
  redo: () => void
  saveHistory: () => void

  copySelectedShapes: () => void
  pasteShapes: () => string[]
  duplicateSelectedShapes: () => void

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
  clipboard: [],
  logoEditingState: {
    isEditing: false,
    previousViewport: null,
    targetShapeId: null,
    targetLogoId: null,
  },

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

  copySelectedShapes: () => {
    const { shapes, selectedIds } = get()
    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
    set({ clipboard: JSON.parse(JSON.stringify(selectedShapes)) })
  },

  pasteShapes: () => {
    const { shapes, clipboard } = get()
    if (clipboard.length === 0) return []

    const PASTE_OFFSET = 20
    const newIds: string[] = []

    const newShapes = clipboard.map((shape) => {
      const newId = generateId()
      newIds.push(newId)
      return {
        ...shape,
        id: newId,
        x: shape.x + PASTE_OFFSET,
        y: shape.y + PASTE_OFFSET,
      }
    })

    set({ shapes: [...shapes, ...newShapes] })
    get().saveHistory()
    return newIds
  },

  duplicateSelectedShapes: () => {
    const { shapes, selectedIds } = get()
    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))

    const DUPLICATE_OFFSET = 20
    const newIds: string[] = []

    const newShapes = selectedShapes.map((shape) => {
      const newId = generateId()
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
    })
    get().saveHistory()
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
