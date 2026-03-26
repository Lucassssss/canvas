import { create, StoreApi, UseBoundStore } from 'zustand'
import { EditorState, ShapeProps, ViewportState, StateChangeListener, ShapesChangeListener, SelectionChangeListener, ViewportChangeListener } from './types'
import { generateId } from '../utils/id'

interface StoreActions {
  addShape: (shape: Omit<ShapeProps, 'id'>) => ShapeProps
  updateShape: (id: string, props: Partial<ShapeProps>) => void
  deleteShape: (id: string) => void
  setShapes: (shapes: ShapeProps[]) => void
  
  setSelectedIds: (ids: string[]) => void
  addToSelection: (id: string) => void
  removeFromSelection: (id: string) => void
  clearSelection: () => void
  
  setViewport: (viewport: Partial<ViewportState>) => void
  
  batch: (fn: () => void) => void
  
  getShape: (id: string) => ShapeProps | undefined
  getShapesByType: (type: string) => ShapeProps[]
}

type StoreState = EditorState & StoreActions

const DEFAULT_VIEWPORT: ViewportState = {
  x: 0,
  y: 0,
  zoom: 1
}

export class Store {
  private store: UseBoundStore<StoreApi<StoreState>>
  private batchDepth: number = 0
  private pendingNotifications: Set<'shapes' | 'selection' | 'viewport' | 'state'> = new Set()

  constructor(initialState?: Partial<EditorState>) {
    const initialShapes = initialState?.shapes ?? []
    const initialSelectedIds = initialState?.selectedIds ?? []
    const initialViewport = initialState?.viewport ?? DEFAULT_VIEWPORT

    this.store = create<StoreState>((set, get) => ({
      shapes: initialShapes,
      selectedIds: initialSelectedIds,
      viewport: initialViewport,

      addShape: (shape: Omit<ShapeProps, 'id'>) => {
        const newShape: ShapeProps = {
          ...shape,
          id: generateId('shape')
        }
        set((state) => ({
          shapes: [...state.shapes, newShape]
        }))
        return newShape
      },

      updateShape: (id: string, props: Partial<ShapeProps>) => {
        set((state) => ({
          shapes: state.shapes.map((shape) =>
            shape.id === id ? { ...shape, ...props } : shape
          )
        }))
      },

      deleteShape: (id: string) => {
        set((state) => ({
          shapes: state.shapes.filter((shape) => shape.id !== id),
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id)
        }))
      },

      setShapes: (shapes: ShapeProps[]) => {
        set({ shapes })
      },

      setSelectedIds: (ids: string[]) => {
        set({ selectedIds: ids })
      },

      addToSelection: (id: string) => {
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds
            : [...state.selectedIds, id]
        }))
      },

      removeFromSelection: (id: string) => {
        set((state) => ({
          selectedIds: state.selectedIds.filter((selectedId) => selectedId !== id)
        }))
      },

      clearSelection: () => {
        set({ selectedIds: [] })
      },

      setViewport: (viewport: Partial<ViewportState>) => {
        set((state) => ({
          viewport: { ...state.viewport, ...viewport }
        }))
      },

      batch: (fn: () => void) => {
        this.batchDepth++
        try {
          fn()
        } finally {
          this.batchDepth--
          if (this.batchDepth === 0) {
            this.flushNotifications()
          }
        }
      },

      getShape: (id: string) => {
        return get().shapes.find((shape) => shape.id === id)
      },

      getShapesByType: (type: string) => {
        return get().shapes.filter((shape) => shape.type === type)
      }
    }))

    this.store.subscribe((state, prevState) => {
      if (this.batchDepth > 0) {
        if (state.shapes !== prevState.shapes) {
          this.pendingNotifications.add('shapes')
        }
        if (state.selectedIds !== prevState.selectedIds) {
          this.pendingNotifications.add('selection')
        }
        if (state.viewport !== prevState.viewport) {
          this.pendingNotifications.add('viewport')
        }
        this.pendingNotifications.add('state')
      }
    })
  }

  private flushNotifications(): void {
    const pending = [...this.pendingNotifications]
    this.pendingNotifications.clear()
    
    if (pending.length === 0) {
      const state = this.store.getState()
      const prevState = state
      if (state.shapes !== prevState.shapes) {
        this.pendingNotifications.add('shapes')
      }
      if (state.selectedIds !== prevState.selectedIds) {
        this.pendingNotifications.add('selection')
      }
      if (state.viewport !== prevState.viewport) {
        this.pendingNotifications.add('viewport')
      }
    }
  }

  getState(): EditorState {
    const { shapes, selectedIds, viewport } = this.store.getState()
    return { shapes, selectedIds, viewport }
  }

  getShapes(): ShapeProps[] {
    return this.store.getState().shapes
  }

  getShape(id: string): ShapeProps | undefined {
    return this.store.getState().getShape(id)
  }

  getSelectedIds(): string[] {
    return this.store.getState().selectedIds
  }

  getViewport(): ViewportState {
    return this.store.getState().viewport
  }

  subscribe(listener: StateChangeListener): () => void {
    return this.store.subscribe((state) => {
      listener(this.getState())
    })
  }

  subscribeShapes(listener: ShapesChangeListener): () => void {
    let prevShapes = this.store.getState().shapes
    return this.store.subscribe((state) => {
      if (state.shapes !== prevShapes) {
        prevShapes = state.shapes
        listener(state.shapes)
      }
    })
  }

  subscribeSelection(listener: SelectionChangeListener): () => void {
    let prevSelectedIds = this.store.getState().selectedIds
    return this.store.subscribe((state) => {
      if (state.selectedIds !== prevSelectedIds) {
        prevSelectedIds = state.selectedIds
        listener(state.selectedIds)
      }
    })
  }

  subscribeViewport(listener: ViewportChangeListener): () => void {
    let prevViewport = this.store.getState().viewport
    return this.store.subscribe((state) => {
      if (state.viewport !== prevViewport) {
        prevViewport = state.viewport
        listener(state.viewport)
      }
    })
  }

  addShape(shape: Omit<ShapeProps, 'id'>): ShapeProps {
    return this.store.getState().addShape(shape)
  }

  updateShape(id: string, props: Partial<ShapeProps>): void {
    this.store.getState().updateShape(id, props)
  }

  deleteShape(id: string): void {
    this.store.getState().deleteShape(id)
  }

  setShapes(shapes: ShapeProps[]): void {
    this.store.getState().setShapes(shapes)
  }

  setSelectedIds(ids: string[]): void {
    this.store.getState().setSelectedIds(ids)
  }

  addToSelection(id: string): void {
    this.store.getState().addToSelection(id)
  }

  removeFromSelection(id: string): void {
    this.store.getState().removeFromSelection(id)
  }

  clearSelection(): void {
    this.store.getState().clearSelection()
  }

  setViewport(viewport: Partial<ViewportState>): void {
    this.store.getState().setViewport(viewport)
  }

  batch(fn: () => void): void {
    this.store.getState().batch(fn)
  }

  useStore(): StoreState {
    return this.store()
  }

  useShapes(): ShapeProps[] {
    return this.store((state) => state.shapes)
  }

  useSelectedIds(): string[] {
    return this.store((state) => state.selectedIds)
  }

  useViewport(): ViewportState {
    return this.store((state) => state.viewport)
  }
}
