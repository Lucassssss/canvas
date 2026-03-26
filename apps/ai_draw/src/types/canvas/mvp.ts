import type { ShapeProps, ViewportState, ToolType, HistoryEntry } from '../../canvas/shapes/types'

export type OperationType =
  | 'create'
  | 'delete'
  | 'transform'
  | 'style'
  | 'content'
  | 'zorder'
  | 'batch'

export interface CanvasHistoryEntry {
  id: string
  shapes: ShapeProps[]
  selectedIds: string[]
  timestamp: number
  operationType: OperationType
  description: string
}

export interface CanvasViewport extends ViewportState {
  minZoom: number
  maxZoom: number
}

export interface CanvasClipboard {
  shapes: ShapeProps[]
  timestamp: number
}

export interface ProjectMeta {
  id: string
  name: string
  thumbnail?: string
  createdAt: number
  updatedAt: number
  version: string
}

export interface ProjectSnapshot {
  id: string
  name: string
  shapes: ShapeProps[]
  viewport: ViewportState
  selectedIds: string[]
  updatedAt: number
  version: string
}

export interface HistorySnapshot {
  entries: CanvasHistoryEntry[]
  currentIndex: number
  maxEntries: number
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  gridEnabled: boolean
  snapEnabled: boolean
  autoSaveEnabled: boolean
  autoSaveInterval: number
}

export interface CanvasStateMVP {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: ViewportState
  activeTool: ToolType
  projectId: string | null
  projectName: string
  isDirty: boolean
  lastSavedAt: number | null
}

export function createDefaultHistoryEntry(
  shapes: ShapeProps[],
  selectedIds: string[],
  operationType: OperationType,
  description: string
): CanvasHistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    shapes: JSON.parse(JSON.stringify(shapes)),
    selectedIds: [...selectedIds],
    timestamp: Date.now(),
    operationType,
    description,
  }
}

export function isCanvasHistoryEntry(entry: HistoryEntry): entry is CanvasHistoryEntry {
  return 'id' in entry && 'timestamp' in entry && 'operationType' in entry
}