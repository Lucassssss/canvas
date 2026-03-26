export interface ShapeProps {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked?: boolean
  meta?: Record<string, unknown>
}

export interface ViewportState {
  x: number
  y: number
  zoom: number
}

export interface EditorState {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: ViewportState
}

export type StateChangeListener = (state: EditorState) => void
export type ShapesChangeListener = (shapes: ShapeProps[]) => void
export type SelectionChangeListener = (selectedIds: string[]) => void
export type ViewportChangeListener = (viewport: ViewportState) => void

export interface HistoryEntry {
  shapes: ShapeProps[]
  selectedIds: string[]
}

export interface HistoryOptions {
  maxHistory?: number
}

export interface EditorOptions {
  initialState?: Partial<EditorState>
  historyOptions?: HistoryOptions
}

export interface EditorEvents {
  'shape:create': (shape: ShapeProps) => void
  'shape:update': (shape: ShapeProps, prevProps: Partial<ShapeProps>) => void
  'shape:delete': (shape: ShapeProps) => void
  'selection:change': (selectedIds: string[]) => void
  'viewport:change': (viewport: ViewportState) => void
  'viewport:zoom': (zoom: number) => void
  'viewport:pan': (x: number, y: number) => void
  'history:undo': () => void
  'history:redo': () => void
  'history:push': () => void
}
