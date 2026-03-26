import { Store } from './Store'
import { HistoryManager } from './History'
import { EditorOptions, EditorState, ShapeProps, ViewportState } from './types'
import { Vec } from '../primitives'
import { EventEmitter } from '../events/EventEmitter'
import type { EditorEvents } from '../events/types'
import { ShapeRegistry } from '../shapes/ShapeRegistry'
import type { IShapeUtil } from '../shapes/ShapeUtil'

const ZOOM_FACTOR = 1.2
const MIN_ZOOM = 0.1
const MAX_ZOOM = 10

const DEFAULT_SHAPE_PROPS: Omit<ShapeProps, 'id' | 'type'> = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  opacity: 1
}

export class Editor {
  private store: Store
  private history: HistoryManager
  private container: HTMLElement | null = null
  private events: EventEmitter<EditorEvents>
  private shapeRegistry: ShapeRegistry

  constructor(options?: EditorOptions) {
    this.store = new Store(options?.initialState)
    this.history = new HistoryManager(options?.historyOptions)
    this.events = new EventEmitter<EditorEvents>()
    this.shapeRegistry = new ShapeRegistry()

    const initialState = this.store.getState()
    if (initialState.shapes.length > 0 || initialState.selectedIds.length > 0) {
      this.history.push(initialState)
    }
  }

  mount(container: HTMLElement): void {
    this.container = container
  }

  unmount(): void {
    this.container = null
  }

  createShape<T extends ShapeProps>(type: string, props: Partial<T>): ShapeProps {
    const mergedProps = {
      ...DEFAULT_SHAPE_PROPS,
      ...props,
      type
    }

    const shape = this.store.addShape(mergedProps)
    this.events.emit('shape:create', { shape })
    this.saveHistory()
    return shape
  }

  updateShape(id: string, props: Partial<ShapeProps>): void {
    const shape = this.store.getShape(id)
    if (!shape) return

    const prevProps = { ...props }
    this.store.updateShape(id, props)
    const updatedShape = this.store.getShape(id)
    if (updatedShape) {
      this.events.emit('shape:update', { shape: updatedShape, prevProps })
    }
    this.saveHistory()
  }

  deleteShape(id: string): void {
    const shape = this.store.getShape(id)
    if (!shape) return

    this.events.emit('shape:delete', { shape })
    this.store.deleteShape(id)
    this.saveHistory()
  }

  getShape(id: string): ShapeProps | undefined {
    return this.store.getShape(id)
  }

  getShapes(): ShapeProps[] {
    return this.store.getShapes()
  }

  getShapesByType(type: string): ShapeProps[] {
    return this.store.getState().shapes.filter(shape => shape.type === type)
  }

  select(ids: string | string[]): void {
    const idArray = Array.isArray(ids) ? ids : [ids]
    this.store.setSelectedIds(idArray)
    this.events.emit('selection:change', { selectedIds: idArray })
  }

  deselect(ids?: string | string[]): void {
    if (!ids) {
      this.store.clearSelection()
      this.events.emit('selection:change', { selectedIds: [] })
      return
    }

    const idArray = Array.isArray(ids) ? ids : [ids]
    const currentSelectedIds = this.store.getSelectedIds()
    const newSelectedIds = currentSelectedIds.filter(id => !idArray.includes(id))
    this.store.setSelectedIds(newSelectedIds)
    this.events.emit('selection:change', { selectedIds: newSelectedIds })
  }

  getSelectedShapes(): ShapeProps[] {
    const selectedIds = this.store.getSelectedIds()
    const shapes = this.store.getShapes()
    return shapes.filter(shape => selectedIds.includes(shape.id))
  }

  getSelectedIds(): string[] {
    return this.store.getSelectedIds()
  }

  getViewport(): ViewportState {
    return this.store.getViewport()
  }

  setViewport(viewport: Partial<ViewportState>): void {
    this.store.setViewport(viewport)
    const newViewport = this.store.getViewport()
    this.events.emit('viewport:change', { viewport: newViewport })
    if (viewport.zoom !== undefined) {
      this.events.emit('viewport:zoom', { zoom: newViewport.zoom })
    }
    if (viewport.x !== undefined || viewport.y !== undefined) {
      this.events.emit('viewport:pan', { x: newViewport.x, y: newViewport.y })
    }
  }

  zoomIn(): void {
    const viewport = this.store.getViewport()
    const newZoom = Math.min(viewport.zoom * ZOOM_FACTOR, MAX_ZOOM)
    this.setViewport({ zoom: newZoom })
  }

  zoomOut(): void {
    const viewport = this.store.getViewport()
    const newZoom = Math.max(viewport.zoom / ZOOM_FACTOR, MIN_ZOOM)
    this.setViewport({ zoom: newZoom })
  }

  zoomToFit(): void {
    const shapes = this.store.getShapes()
    if (shapes.length === 0) return

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (const shape of shapes) {
      const left = shape.x
      const top = shape.y
      const right = shape.x + shape.width
      const bottom = shape.y + shape.height

      minX = Math.min(minX, left)
      minY = Math.min(minY, top)
      maxX = Math.max(maxX, right)
      maxY = Math.max(maxY, bottom)
    }

    const containerSize = this.getContainerSize()
    if (containerSize.width === 0 || containerSize.height === 0) return

    const shapesWidth = maxX - minX
    const shapesHeight = maxY - minY

    const padding = 50
    const availableWidth = containerSize.width - padding * 2
    const availableHeight = containerSize.height - padding * 2

    const zoomX = availableWidth / shapesWidth
    const zoomY = availableHeight / shapesHeight
    const newZoom = Math.min(zoomX, zoomY, MAX_ZOOM)
    const clampedZoom = Math.max(newZoom, MIN_ZOOM)

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const viewportX = containerSize.width / 2 - centerX * clampedZoom
    const viewportY = containerSize.height / 2 - centerY * clampedZoom

    this.setViewport({
      x: viewportX,
      y: viewportY,
      zoom: clampedZoom
    })
  }

  zoomToShape(id: string): void {
    const shape = this.store.getShape(id)
    if (!shape) return

    const containerSize = this.getContainerSize()
    if (containerSize.width === 0 || containerSize.height === 0) return

    const padding = 50
    const availableWidth = containerSize.width - padding * 2
    const availableHeight = containerSize.height - padding * 2

    const zoomX = availableWidth / shape.width
    const zoomY = availableHeight / shape.height
    const newZoom = Math.min(zoomX, zoomY, MAX_ZOOM)
    const clampedZoom = Math.max(newZoom, MIN_ZOOM)

    const centerX = shape.x + shape.width / 2
    const centerY = shape.y + shape.height / 2

    const viewportX = containerSize.width / 2 - centerX * clampedZoom
    const viewportY = containerSize.height / 2 - centerY * clampedZoom

    this.setViewport({
      x: viewportX,
      y: viewportY,
      zoom: clampedZoom
    })
  }

  panTo(x: number, y: number): void {
    this.setViewport({ x, y })
  }

  undo(): void {
    const entry = this.history.undo()
    if (!entry) return

    this.store.setShapes(entry.shapes)
    this.store.setSelectedIds(entry.selectedIds)
    this.events.emit('history:undo', {})
  }

  redo(): void {
    const entry = this.history.redo()
    if (!entry) return

    this.store.setShapes(entry.shapes)
    this.store.setSelectedIds(entry.selectedIds)
    this.events.emit('history:redo', {})
  }

  canUndo(): boolean {
    return this.history.canUndo()
  }

  canRedo(): boolean {
    return this.history.canRedo()
  }

  clearHistory(): void {
    this.history.clear()
  }

  saveHistory(): void {
    this.history.push(this.store.getState())
    this.events.emit('history:push', {})
  }

  screenToCanvas(x: number, y: number): Vec {
    const viewport = this.store.getViewport()
    const canvasX = (x - viewport.x) / viewport.zoom
    const canvasY = (y - viewport.y) / viewport.zoom
    return new Vec(canvasX, canvasY)
  }

  canvasToScreen(x: number, y: number): Vec {
    const viewport = this.store.getViewport()
    const screenX = x * viewport.zoom + viewport.x
    const screenY = y * viewport.zoom + viewport.y
    return new Vec(screenX, screenY)
  }

  exportToJSON(): string {
    const state = this.store.getState()
    return JSON.stringify(state, null, 2)
  }

  importFromJSON(json: string): void {
    try {
      const state = JSON.parse(json) as EditorState
      this.store.setShapes(state.shapes || [])
      this.store.setSelectedIds(state.selectedIds || [])
      if (state.viewport) {
        this.store.setViewport(state.viewport)
      }
      this.saveHistory()
    } catch (error) {
      throw new Error(`Failed to import from JSON: ${error}`)
    }
  }

  getContainerSize(): { width: number; height: number } {
    if (!this.container) {
      return { width: 0, height: 0 }
    }
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
  }

  on<K extends keyof EditorEvents>(event: K, handler: (payload: EditorEvents[K]) => void): () => void {
    return this.events.on(event, handler)
  }

  once<K extends keyof EditorEvents>(event: K, handler: (payload: EditorEvents[K]) => void): () => void {
    return this.events.once(event, handler)
  }

  off<K extends keyof EditorEvents>(event: K, handler: (payload: EditorEvents[K]) => void): void {
    this.events.off(event, handler)
  }

  registerShape(shapeUtil: IShapeUtil): void {
    this.shapeRegistry.register(shapeUtil)
  }

  unregisterShape(type: string): void {
    this.shapeRegistry.unregister(type)
  }

  getShapeUtil(type: string): IShapeUtil | undefined {
    return this.shapeRegistry.getShapeUtil(type)
  }

  getShapeRegistry(): ShapeRegistry {
    return this.shapeRegistry
  }
}
