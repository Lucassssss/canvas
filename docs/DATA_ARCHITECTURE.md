# GKE 画布数据架构方案

## 文档信息

| 项目 | 内容 |
|------|------|
| **产品名称** | GKE - 无限画布智能设计平台 |
| **版本** | v1.0.0 |
| **状态** | 设计阶段 |
| **架构师** | 数据架构设计 |
| **文档日期** | 2026-03-26 |

---

## 一、现有代码分析

### 1.1 前端状态管理 (Zustand)

**文件位置**: `apps/ai_draw/src/canvas/store.ts`

**现有数据结构**:
```typescript
// shapes/types.ts
interface ShapeProps {
  id: string
  type: ShapeType
  x, y, width, height, rotation: number
  fill, stroke: string
  strokeWidth, opacity: number
  // 类型特定字段...
}

interface ViewportState {
  x: number
  y: number
  zoom: number
}

interface HistoryEntry {
  shapes: ShapeProps[]
  selectedIds: string[]
}
```

**现有 Store 结构**:
- `shapes`: ShapeProps[] - 画布上的所有形状
- `selectedIds`: string[] - 当前选中的形状 ID
- `viewport`: ViewportState - 视口状态
- `activeTool`: ToolType - 当前工具
- `history`: HistoryEntry[] - 历史记录栈
- `historyIndex`: number - 当前历史位置
- `clipboard`: ShapeProps[] - 剪贴板
- `logoEditingState`: logo 编辑状态

### 1.2 后端数据存储 (SQLite)

**文件位置**: `apps/api/src/services/database.ts`

**现有表结构**:
```sql
conversations (
  id TEXT PRIMARY KEY,
  title TEXT,
  model TEXT,
  mode TEXT,
  created_at INTEGER,
  updated_at INTEGER
)

messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT,
  created_at INTEGER
)
```

---

## 二、架构设计原则

### 2.1 渐进式增强

```
┌─────────────────────────────────────────────────────────────┐
│                      完整架构（第三阶段）                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ SQLite  │ │IndexedDB│ │ Content │ │  Cloud  │          │
│  │持久存储  │ │本地缓存  │ │  缓存   │ │  同步   │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│                      MVP架构（第一阶段）                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ Zustand │ │localSt. │ │ Shape   │                       │
│  │ 状态管理  │ │持久化   │ │ History │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            ▲
┌─────────────────────────────────────────────────────────────┐
│                      适配层（当前代码）                        │
│  ┌─────────────────────────────────────────────────┐        │
│  │ 现有 store.ts + shapes/types.ts 保持兼容         │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 适配策略

1. **最小改动**: 不修改现有 `ShapeProps` 和 `store.ts` 结构
2. **扩展接口**: 通过 TypeScript interface 扩展兼容新字段
3. **分层存储**: Zustand(热数据) → localStorage(持久化) → SQLite(云端)
4. **向后兼容**: 新增字段全部为可选，核心逻辑保持不变

---

## 三、数据类型定义

### 3.1 MVP 阶段类型（第一阶段）

```typescript
// types/canvas/mvp.ts

import type { ShapeProps, ViewportState, ToolType, HistoryEntry } from '../canvas/shapes/types'

export interface CanvasState {
  shapes: ShapeProps[]
  selectedIds: string[]
  viewport: ViewportState
  activeTool: ToolType
}

export interface CanvasViewport extends ViewportState {
  minZoom: number
  maxZoom: number
}

export interface CanvasHistoryEntry extends HistoryEntry {
  id: string
  timestamp: number
  operationType: OperationType
  description: string
}

export type OperationType =
  | 'create'
  | 'delete'
  | 'transform'
  | 'style'
  | 'content'
  | 'zorder'
  | 'batch'

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
```

### 3.2 完整阶段类型（第三阶段）

```typescript
// types/canvas/full.ts

import type { ShapeType, SlotContent, ClothingColors, LogoArea } from '../canvas/shapes/types'

// ========== Shape 扩展 ==========

export interface TransformConfig {
  draggable: boolean
  resizable: boolean
  rotatable: boolean
  scalableX: boolean
  scalableY: boolean
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
  aspectRatioLock?: boolean
}

export interface StyleConfig {
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  strokeDasharray?: string
}

export interface ShapePersistence {
  version: number
  createdAt: number
  updatedAt: number
  createdBy?: string
}

export interface ShapePropsFull {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  rotation: number

  transform: TransformConfig
  style: StyleConfig
  persistence: ShapePersistence

  content?: {
    type: 'none' | 'text' | 'image' | 'svg' | 'ai-result'
    data: string | null
    metadata?: {
      originalSize?: { width: number; height: number }
      mimeType?: string
      hash?: string
      source?: 'upload' | 'canvas' | 'ai' | 'clipboard'
    }
  }

  typeSpecificData?: TextShapeData | ImageShapeData | ClothingShapeData | AICombinationShapeData
}

export interface TextShapeData {
  text: string
  fontSize: number
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  textAlign: 'left' | 'center' | 'right'
  lineHeight: number
}

export interface ImageShapeData {
  imageUrl: string
  objectFit: 'fill' | 'contain' | 'cover'
  crop?: { x: number; y: number; width: number; height: number }
  filter?: 'none' | 'grayscale' | 'sepia'
  filterIntensity?: number
}

export interface ClothingShapeData {
  view: 'front' | 'back' | 'side'
  colors: ClothingColors
  logoAreas: LogoArea[]
  activeLogoId?: string
  logoContent: Record<string, string>
}

export interface AICombinationShapeData {
  combinationTypeId: string
  slotContents: Record<string, SlotContent>
  settings: {
    prompt: string
    resolution: { width: number; height: number }
    model?: string
  }
  status: 'idle' | 'generating' | 'completed' | 'error'
  results: AIResult[]
  error?: string
}

export interface AIResult {
  id: string
  imageUrl: string
  thumbnailUrl?: string
  metadata: {
    prompt: string
    model: string
    seed?: number
    createdAt: number
    duration?: number
  }
}

// ========== History 扩展 ==========

export type HistoryLevel = 'shape' | 'operation' | 'project'

export interface HistorySession {
  id: string
  name: string
  startTime: number
  endTime?: number
  entryIds: string[]
}

export interface HistoryEntryFull {
  id: string
  level: HistoryLevel
  operation: {
    type: OperationType
    timestamp: number
    source: 'user' | 'ai' | 'system'
    description: string
  }
  changes: Array<{
    shapeId: string
    before: Partial<ShapeProps>
    after: Partial<ShapeProps>
  }>
  snapshot?: {
    shapes: ShapeProps[]
    selectedIds: string[]
  }
}

// ========== Project 扩展 ==========

export interface Project {
  id: string
  name: string
  version: string
  metadata: ProjectMetadata
  canvas: CanvasStateFull
  settings: ProjectSettings
}

export interface ProjectMetadata {
  createdAt: number
  updatedAt: number
  createdBy?: string
  thumbnail?: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
}

export interface CanvasStateFull {
  viewport: ViewportState
  shapes: ShapePropsFull[]
  selectedIds: string[]
  clipboard: ShapeProps[]
  historySummary: {
    totalEntries: number
    lastEntryId: string
    lastUpdatedAt: number
  }
  layers: Layer[]
}

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  children: string[]
}

export interface ProjectSettings {
  canvas: {
    width: number
    height: number
    backgroundColor: string
    gridEnabled: boolean
    gridSize?: number
    snapEnabled: boolean
  }
  autoSave: {
    enabled: boolean
    intervalMs: number
    maxVersions: number
  }
}

// ========== Content Storage ==========

export type ContentType = 'image' | 'video' | 'audio' | 'svg' | 'blob' | 'data-url'

export interface CachedContent {
  id: string
  type: ContentType
  data: string | Blob | ArrayBuffer
  metadata: ContentMetadata
  createdAt: number
  lastAccessedAt: number
  status: 'loading' | 'ready' | 'error' | 'disposed'
}

export interface ContentMetadata {
  width?: number
  height?: number
  mimeType: string
  size: number
  hash?: string
  source: 'upload' | 'canvas' | 'ai' | 'clipboard' | 'url'
}
```

---

## 四、存储层设计

### 4.1 存储层次

```
┌─────────────────────────────────────────────────────────────────┐
│                        存储层次架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Zustand Store (热数据层)                      │   │
│   │   - shapes, viewport, selection, history                 │   │
│   │   - 内存状态，高频读写                                   │   │
│   │   - 订阅机制，响应式更新                                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              localStorage (温数据层)                      │   │
│   │   - 项目快照，撤销历史                                   │   │
│   │   - 用户偏好设置                                         │   │
│   │   - 自动保存点                                           │   │
│   │   - 5MB 限制，适合小数据                                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              IndexedDB (冷数据层)                        │   │
│   │   - 大型项目数据                                         │   │
│   │   - 图片 Blob 缓存                                       │   │
│   │   - 历史记录完整存储                                      │   │
│   │   - 支持大容量存储                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              SQLite via API (持久化层)                   │   │
│   │   - 项目元数据                                          │   │
│   │   - 用户数据                                            │   │
│   │   - 云端同步基础                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 localStorage 存储结构

```typescript
// lib/storage/local.ts

const STORAGE_KEYS = {
  PROJECT_META: 'gke_project_meta',
  PROJECT_SNAPSHOT: 'gke_project_snapshot',
  HISTORY: 'gke_history',
  USER_PREFERENCES: 'gke_user_prefs',
  CLIPBOARD: 'gke_clipboard',
} as const

interface ProjectSnapshot {
  id: string
  name: string
  shapes: ShapeProps[]
  viewport: ViewportState
  selectedIds: string[]
  updatedAt: number
  version: string
}

interface HistorySnapshot {
  entries: HistoryEntry[]
  currentIndex: number
  maxEntries: number
}

interface UserPreferences {
  theme: 'light' | 'dark'
  gridEnabled: boolean
  snapEnabled: boolean
  autoSaveEnabled: boolean
  autoSaveInterval: number
}

class LocalStorageManager {
  // 保存项目快照
  saveProjectSnapshot(project: ProjectSnapshot): void {
    try {
      const data = JSON.stringify(project)
      if (data.length > 4.5 * 1024 * 1024) {
        console.warn('Project snapshot too large for localStorage')
        return
      }
      localStorage.setItem(STORAGE_KEYS.PROJECT_SNAPSHOT, data)
    } catch (e) {
      console.error('Failed to save project snapshot:', e)
    }
  }

  // 加载项目快照
  loadProjectSnapshot(): ProjectSnapshot | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECT_SNAPSHOT)
      return data ? JSON.parse(data) : null
    } catch (e) {
      console.error('Failed to load project snapshot:', e)
      return null
    }
  }

  // 保存历史记录
  saveHistory(entries: HistoryEntry[], currentIndex: number): void {
    const snapshot: HistorySnapshot = {
      entries: entries.slice(-50),
      currentIndex: Math.min(currentIndex, entries.length - 1),
      maxEntries: 50
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(snapshot))
  }

  // 加载历史记录
  loadHistory(): HistorySnapshot | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  // 保存用户偏好
  saveUserPreferences(prefs: UserPreferences): void {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs))
  }

  // 清除所有数据
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }
}

export const localStorageManager = new LocalStorageManager()
```

### 4.3 IndexedDB 存储结构

```typescript
// lib/storage/indexed-db.ts

const DB_NAME = 'gke_canvas'
const DB_VERSION = 1

interface CanvasDB {
  projects: {
    key: string
    value: {
      id: string
      name: string
      data: string  // JSON.stringify(Project)
      thumbnail?: string
      createdAt: number
      updatedAt: number
    }
  }
  content: {
    key: string
    value: {
      id: string
      type: string
      blob: Blob
      metadata: ContentMetadata
      createdAt: number
    }
  }
  history: {
    key: string
    value: {
      projectId: string
      entries: HistoryEntry[]
      updatedAt: number
    }
  }
}

class IndexedDBManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('content')) {
          db.createObjectStore('content', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'projectId' })
        }
      }
    })
  }

  async saveProject(project: Project): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('projects', 'readwrite')
      const store = tx.objectStore('projects')
      const request = store.put({
        id: project.id,
        name: project.name,
        data: JSON.stringify(project),
        thumbnail: project.metadata.thumbnail,
        createdAt: project.metadata.createdAt,
        updatedAt: project.metadata.updatedAt
      })
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async loadProject(id: string): Promise<Project | null> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('projects', 'readonly')
      const store = tx.objectStore('projects')
      const request = store.get(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const result = request.result
        resolve(result ? JSON.parse(result.data) : null)
      }
    })
  }

  async listProjects(): Promise<Array<{ id: string; name: string; thumbnail?: string; updatedAt: number }>> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('projects', 'readonly')
      const store = tx.objectStore('projects')
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        resolve(request.result.map(r => ({
          id: r.id,
          name: r.name,
          thumbnail: r.thumbnail,
          updatedAt: r.updatedAt
        })))
      }
    })
  }

  async saveContent(id: string, blob: Blob, metadata: ContentMetadata): Promise<void> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('content', 'readwrite')
      const store = tx.objectStore('content')
      const request = store.put({ id, type: metadata.mimeType, blob, metadata, createdAt: Date.now() })
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getContent(id: string): Promise<Blob | null> {
    if (!this.db) await this.init()
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('content', 'readonly')
      const store = tx.objectStore('content')
      const request = store.get(id)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result?.blob || null)
    })
  }
}

export const indexedDBManager = new IndexedDBManager()
```

### 4.4 SQLite 数据库结构 (后端)

```sql
-- 扩展现有的 conversations.db

-- 项目表
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Untitled Project',
  version TEXT NOT NULL DEFAULT '1.0.0',
  data TEXT NOT NULL,  -- JSON.stringify(Project)
  thumbnail TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
);

-- 项目历史记录表
CREATE TABLE IF NOT EXISTS project_history (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  entry_data TEXT NOT NULL,  -- JSON.stringify(HistoryEntry)
  operation_type TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_project_history_project_id ON project_history(project_id);

-- 资源表（用于存储图片等大文件）
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data BLOB NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  hash TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resources_project_id ON resources(project_id);
CREATE INDEX IF NOT EXISTS idx_resources_hash ON resources(hash);
```

---

## 五、Zustand Store 重构

### 5.1 MVP 阶段：最小侵入式增强

```typescript
// store/canvas-store-mvp.ts
// 保持现有结构，增强历史和持久化能力

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ShapeProps, ViewportState, ToolType, HistoryEntry } from './shapes/types'
import { generateId } from '@/lib/utils'

interface CanvasStore {
  // 现有字段保持不变
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
  logoEditingState: LogoEditingState

  // MVP 新增：项目状态
  projectId: string | null
  projectName: string
  isDirty: boolean
  lastSavedAt: number | null

  // ========== 现有方法（保持不变）==========

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
  setActiveAICategory: (categoryId: string | null) => void

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

  // ========== MVP 新增方法==========

  setProjectId: (id: string | null) => void
  setProjectName: (name: string) => void
  markDirty: () => void
  markSaved: () => void
  resetCanvas: () => void
  loadFromSnapshot: (snapshot: { shapes: ShapeProps[]; viewport: ViewportState }) => void
}

interface LogoEditingState {
  isEditing: boolean
  previousViewport: ViewportState | null
  targetShapeId: string | null
  targetLogoId: string | null
}

const initialState = {
  shapes: [],
  selectedIds: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  activeTool: 'select' as ToolType,
  activeAICategory: null,
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
  projectId: null,
  projectName: 'Untitled Project',
  isDirty: false,
  lastSavedAt: null,
}

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========== 现有方法保持不变 ==========

      setShapes: (shapes) => set({ shapes, isDirty: true }),

      addShape: (shape) => {
        const newShape: ShapeProps = { ...shape, id: generateId() }
        set((state) => ({ shapes: [...state.shapes, newShape], isDirty: true }))
        get().saveHistory()
        return newShape
      },

      updateShape: (id, props) => {
        set((state) => ({
          shapes: state.shapes.map((s) => s.id === id ? { ...s, ...props } : s),
          isDirty: true
        }))
      },

      deleteShape: (id) => {
        set((state) => ({
          shapes: state.shapes.filter((s) => s.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
          isDirty: true
        }))
        get().saveHistory()
      },

      deleteSelectedShapes: () => {
        set((state) => ({
          shapes: state.shapes.filter((s) => !state.selectedIds.includes(s.id)),
          selectedIds: [],
          isDirty: true
        }))
        get().saveHistory()
      },

      // ... 其他现有方法保持不变 ...

      // ========== MVP 新增方法==========

      setProjectId: (id) => set({ projectId: id }),
      setProjectName: (name) => set({ projectName: name }),
      markDirty: () => set({ isDirty: true }),
      markSaved: () => set({ isDirty: false, lastSavedAt: Date.now() }),

      resetCanvas: () => set({
        ...initialState,
        viewport: { x: 0, y: 0, zoom: 1 },
        projectId: get().projectId,
        projectName: get().projectName,
      }),

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
    }),
    {
      name: 'gke-canvas-state',
      partialize: (state) => ({
        shapes: state.shapes,
        viewport: state.viewport,
        projectId: state.projectId,
        projectName: state.projectName,
      }),
    }
  )
)
```

### 5.2 Store 拆分方案（完整阶段）

```typescript
// store/slices/canvas-slice.ts

import { StateCreator } from 'zustand'

export interface CanvasSlice {
  shapes: ShapeProps[]
  viewport: ViewportState
  setShapes: (shapes: ShapeProps[]) => void
  addShape: (shape: Omit<ShapeProps, 'id'>) => ShapeProps
  updateShape: (id: string, props: Partial<ShapeProps>) => void
  deleteShape: (id: string) => void
  setViewport: (viewport: Partial<ViewportState>) => void
}

export const createCanvasSlice: StateCreator<CanvasSlice> = (set, get) => ({
  shapes: [],
  viewport: { x: 0, y: 0, zoom: 1 },

  setShapes: (shapes) => set({ shapes }),
  addShape: (shape) => {
    const newShape = { ...shape, id: generateId() }
    set((state) => ({ shapes: [...state.shapes, newShape] }))
    return newShape
  },
  updateShape: (id, props) => {
    set((state) => ({
      shapes: state.shapes.map((s) => s.id === id ? { ...s, ...props } : s)
    }))
  },
  deleteShape: (id) => {
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id)
    }))
  },
  setViewport: (viewport) => {
    set((state) => ({ viewport: { ...state.viewport, ...viewport } }))
  },
})

// store/slices/history-slice.ts

export interface HistorySlice {
  history: HistoryEntry[]
  historyIndex: number
  pushHistory: (entry: HistoryEntry) => void
  undo: () => HistoryEntry | null
  redo: () => HistoryEntry | null
  canUndo: () => boolean
  canRedo: () => boolean
}

export const createHistorySlice: StateCreator<HistorySlice> = (set, get) => ({
  history: [],
  historyIndex: -1,

  pushHistory: (entry) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(entry)
      if (newHistory.length > 50) newHistory.shift()
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1
      }
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      set({ historyIndex: historyIndex - 1 })
      return history[historyIndex - 1]
    }
    return null
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      set({ historyIndex: historyIndex + 1 })
      return history[historyIndex + 1]
    }
    return null
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
})

// store/index.ts - 组合 slices

import { create } from 'zustand'
import { createCanvasSlice, type CanvasSlice } from './slices/canvas-slice'
import { createHistorySlice, type HistorySlice } from './slices/history-slice'

interface AppState extends CanvasSlice, HistorySlice {
  // 组合所有 slice
}

export const useStore = create<AppState>()((...a) => ({
  ...createCanvasSlice(...a),
  ...createHistorySlice(...a),
}))
```

---

## 六、导入导出设计

### 6.1 MVP 阶段：JSON 格式

```typescript
// lib/import-export/json.ts

export interface ProjectExportV1 {
  version: '1.0'
  type: 'gke-project'
  metadata: {
    name: string
    exportedAt: number
    exportedBy: string
  }
  canvas: {
    viewport: ViewportState
    shapes: ShapeProps[]
  }
}

export interface ImportResult {
  success: boolean
  project?: ProjectExportV1
  error?: string
  warnings?: string[]
}

class JSONProjectExporter {
  export(state: { shapes: ShapeProps[]; viewport: ViewportState }, name: string): ProjectExportV1 {
    return {
      version: '1.0',
      type: 'gke-project',
      metadata: {
        name,
        exportedAt: Date.now(),
        exportedBy: 'GKE Canvas'
      },
      canvas: {
        viewport: state.viewport,
        shapes: state.shapes
      }
    }
  }

  exportToString(state: { shapes: ShapeProps[]; viewport: ViewportState }, name: string): string {
    return JSON.stringify(this.export(state, name), null, 2)
  }
}

class JSONProjectImporter {
  validate(data: unknown): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data || typeof data !== 'object') {
      return { valid: false, errors: ['Invalid JSON structure'] }
    }

    const obj = data as Record<string, unknown>

    if (obj.version !== '1.0' || obj.type !== 'gke-project') {
      errors.push('Invalid project format')
    }

    if (!obj.canvas || typeof obj.canvas !== 'object') {
      errors.push('Missing canvas data')
    }

    return { valid: errors.length === 0, errors }
  }

  import(jsonString: string): ImportResult {
    try {
      const data = JSON.parse(jsonString)
      const validation = this.validate(data)

      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        }
      }

      return { success: true, project: data as ProjectExportV1 }
    } catch (e) {
      return {
        success: false,
        error: e instanceof Error ? e.message : 'Failed to parse JSON'
      }
    }
  }
}

export const jsonExporter = new JSONProjectExporter()
export const jsonImporter = new JSONProjectImporter()
```

### 6.2 完整阶段：GKE 包格式

```typescript
// lib/import-export/gke.ts

export interface GKEPackage {
  header: {
    version: string
    createdAt: number
    exportedBy: string
    application: string
  }
  project: {
    id: string
    name: string
    version: string
    canvas: {
      viewport: ViewportState
      shapes: ShapeProps[]
      layers?: Layer[]
    }
    settings: ProjectSettings
  }
  resources: Array<{
    id: string
    type: string
    data: string  // base64
    hash: string
  }>
  history?: HistoryEntry[]
  thumbnail?: string
  checksum: string
}

class GKEExporter {
  async export(project: Project, options: { includeHistory?: boolean; includeResources?: boolean }): Promise<Blob> {
    const resources = options.includeResources ? await this.collectResources(project) : []

    const pkg: GKEPackage = {
      header: {
        version: '1.0',
        createdAt: Date.now(),
        exportedBy: 'GKE Canvas',
        application: 'GKE'
      },
      project: {
        id: project.id,
        name: project.name,
        version: project.version,
        canvas: project.canvas,
        settings: project.settings
      },
      resources,
      history: options.includeHistory ? project.history : undefined,
      checksum: ''
    }

    pkg.checksum = await this.computeChecksum(pkg)
    return new Blob([JSON.stringify(pkg, null, 2)], { type: 'application/json' })
  }

  private async collectResources(project: Project): Promise<GKEPackage['resources']> {
    const resources: GKEPackage['resources'] = []
    const imageUrls = new Set<string>()

    for (const shape of project.canvas.shapes) {
      if (shape.imageUrl) imageUrls.add(shape.imageUrl)
      if (shape.combinationResults) {
        shape.combinationResults.forEach(url => imageUrls.add(url))
      }
    }

    for (const url of imageUrls) {
      try {
        const response = await fetch(url)
        const blob = await response.blob()
        const hash = await this.computeBlobHash(blob)
        const base64 = await this.blobToBase64(blob)

        resources.push({
          id: hash,
          type: blob.type,
          data: base64,
          hash
        })
      } catch (e) {
        console.warn(`Failed to collect resource: ${url}`)
      }
    }

    return resources
  }

  private async computeChecksum(pkg: GKEPackage): Promise<string> {
    const data = JSON.stringify({ header: pkg.header, project: pkg.project })
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  private async computeBlobHash(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16)
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

export const gkeExporter = new GKEExporter()
```

---

## 七、实现计划

### 7.1 MVP 阶段（第一阶段）

**目标**: 在不破坏现有代码的情况下，增强持久化和历史能力

| 序号 | 任务 | 优先级 | 改动范围 |
|-----|------|-------|---------|
| 1 | 创建 `types/canvas/mvp.ts` 类型扩展 | P0 | 新增文件 |
| 2 | 增强 `store.ts` 的 persist 中间件 | P0 | 修改 store.ts |
| 3 | 实现 `lib/storage/local.ts` | P0 | 新增文件 |
| 4 | 实现 JSON 导入导出 `lib/import-export/json.ts` | P0 | 新增文件 |
| 5 | 添加 saveHistory 增强（带描述） | P1 | 修改 store.ts |
| 6 | 添加项目元数据字段 | P1 | 修改 store.ts |
| 7 | 编写 MVP 数据层单元测试 | P2 | 新增测试文件 |

**MVP 产出**:
- localStorage 自动保存
- JSON 项目导入/导出
- 增强的历史记录（带操作描述）
- 向后兼容的 Zustand store

### 7.2 进阶阶段（第二阶段）

**目标**: 完善缓存和内容管理

| 序号 | 任务 | 优先级 |
|-----|------|-------|
| 1 | 实现 `lib/storage/indexed-db.ts` |
| 2 | 实现内容缓存管理 `lib/storage/content-cache.ts` |
| 3 | 添加 Canvas DB 后端接口 |
| 4 | 实现自动保存机制 |
| 5 | 添加撤销/重做的操作类型标注 |

### 7.3 完整阶段（第三阶段）

**目标**: 完整的数据架构

| 序号 | 任务 | 优先级 |
|-----|------|-------|
| 1 | Store 拆分为 slices |
| 2 | 完善 ShapePropsFull 类型 |
| 3 | 实现 GKE 包格式导入导出 |
| 4 | 实现资源去重（基于 hash） |
| 5 | 实现版本迁移机制 |
| 6 | 云端同步基础架构 |

---

## 八、API 设计

### 8.1 后端 API 端点

```typescript
// apps/api/src/routes/canvas.ts

import { Router } from 'express'
import { getDb } from '../services/database.js'

const router = Router()

// 获取所有项目
router.get('/projects', async (req, res) => {
  const db = getDb()
  const projects = db.prepare(`
    SELECT id, name, version, thumbnail, created_at, updated_at
    FROM projects
    ORDER BY updated_at DESC
  `).all()
  res.json(projects)
})

// 获取单个项目
router.get('/projects/:id', async (req, res) => {
  const { id } = req.params
  const db = getDb()
  const project = db.prepare(`
    SELECT * FROM projects WHERE id = ?
  `).get(id)

  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }

  res.json(JSON.parse((project as any).data))
})

// 创建项目
router.post('/projects', async (req, res) => {
  const { name = 'Untitled Project' } = req.body
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  const now = Date.now()

  const db = getDb()
  db.prepare(`
    INSERT INTO projects (id, name, data, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, JSON.stringify({
    id,
    name,
    version: '1.0.0',
    metadata: { createdAt: now, updatedAt: now },
    canvas: { shapes: [], viewport: { x: 0, y: 0, zoom: 1 } }
  }), now, now)

  res.status(201).json({ id })
})

// 更新项目
router.put('/projects/:id', async (req, res) => {
  const { id } = req.params
  const { data } = req.body
  const now = Date.now()

  const db = getDb()
  db.prepare(`
    UPDATE projects SET data = ?, updated_at = ? WHERE id = ?
  `).run(JSON.stringify(data), now, id)

  res.json({ success: true })
})

// 删除项目
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params
  const db = getDb()
  db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  res.json({ success: true })
})

// 获取项目历史
router.get('/projects/:id/history', async (req, res) => {
  const { id } = req.params
  const db = getDb()
  const history = db.prepare(`
    SELECT * FROM project_history
    WHERE project_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).all(id)

  res.json(history.map((h: any) => JSON.parse(h.entry_data)))
})

// 添加历史记录
router.post('/projects/:id/history', async (req, res) => {
  const { id } = req.params
  const { entry, operationType, description } = req.body
  const historyId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const db = getDb()
  db.prepare(`
    INSERT INTO project_history (id, project_id, entry_data, operation_type, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(historyId, id, JSON.stringify(entry), operationType, description, Date.now())

  res.status(201).json({ id: historyId })
})

// 上传资源
router.post('/projects/:id/resources', async (req, res) => {
  const { id } = req.params
  const { type, data, mimeType, hash } = req.body
  const resourceId = hash || `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const db = getDb()
  const buffer = Buffer.from(data, 'base64')

  db.prepare(`
    INSERT OR REPLACE INTO resources (id, project_id, type, data, mime_type, size, hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(resourceId, id, type, buffer, mimeType, buffer.length, hash, Date.now())

  res.status(201).json({ id: resourceId })
})

// 获取资源
router.get('/projects/:id/resources/:resourceId', async (req, res) => {
  const { id, resourceId } = req.params
  const db = getDb()
  const resource = db.prepare(`
    SELECT * FROM resources WHERE id = ? AND project_id = ?
  `).get(resourceId, id) as any

  if (!resource) {
    return res.status(404).json({ error: 'Resource not found' })
  }

  res.set('Content-Type', resource.mime_type)
  res.send(resource.data)
})

export default router
```

---

## 九、目录结构

```
apps/ai_draw/src/
├── types/
│   └── canvas/
│       ├── mvp.ts          # MVP 类型扩展
│       └── full.ts         # 完整类型
├── store/
│   ├── index.ts            # Store 入口
│   ├── canvas-store.ts     # 现有 store（增强）
│   └── slices/             # 完整阶段：store 拆分
│       ├── canvas-slice.ts
│       ├── history-slice.ts
│       ├── selection-slice.ts
│       └── content-slice.ts
└── lib/
    ├── storage/
    │   ├── local.ts        # localStorage 管理
    │   ├── indexed-db.ts   # IndexedDB 管理
    │   └── content-cache.ts # 内容缓存
    └── import-export/
        ├── json.ts          # JSON 导入导出（MVP）
        └── gke.ts           # GKE 包格式（完整）
```

---

## 十、向后兼容策略

### 10.1 现有类型扩展

```typescript
// types/canvas/shapes-extended.ts

import type { ShapeProps as OriginalShapeProps } from './shapes/types'

// 扩展现有类型，添加可选字段
export interface ShapePropsExtended extends OriginalShapeProps {
  // 新增字段全部为可选，不破坏现有代码
  transform?: {
    draggable?: boolean
    resizable?: boolean
    rotatable?: boolean
    minWidth?: number
    minHeight?: number
  }
  persistence?: {
    createdAt?: number
    updatedAt?: number
    version?: number
  }
}

// 类型守卫函数
export function isShapeExtended(shape: ShapeProps): shape is ShapePropsExtended {
  return 'transform' in shape || 'persistence' in shape
}
```

### 10.2 Store 兼容层

```typescript
// store/compat.ts

import { useCanvasStore } from './canvas-store'

// 兼容层：提供向后兼容的接口
export const compat = {
  // 获取 shapes（自动兼容新旧格式）
  getShapes: () => {
    const { shapes } = useCanvasStore.getState()
    return shapes
  },

  // 加载旧版本数据
  loadLegacyData: (data: { shapes: OriginalShapeProps[] }) => {
    const store = useCanvasStore.getState()
    // 转换旧数据格式为新格式
    const convertedShapes = data.shapes.map(shape => ({
      ...shape,
      // 添加默认值
      transform: shape.transform || { draggable: true, resizable: true, rotatable: true },
      persistence: shape.persistence || { createdAt: Date.now(), updatedAt: Date.now() }
    }))
    store.setShapes(convertedShapes)
  }
}
```

---

## 十一、总结

### 11.1 MVP 阶段核心产出

1. **类型扩展**: `types/canvas/mvp.ts` - 向后兼容的类型定义
2. **localStorage 持久化**: `lib/storage/local.ts` - 项目自动保存
3. **JSON 导入导出**: `lib/import-export/json.ts` - 项目文件化
4. **Store 增强**: `persist` 中间件 + 历史增强

### 11.2 后续扩展路径

```
MVP → 进阶 → 完整
 ↓      ↓      ↓
local   IndexedDB  SQLite
Storage  Cache   + Cloud Sync
```

### 11.3 关键设计决策

1. **不破坏现有代码**: 所有增强都是添加可选字段
2. **渐进式增强**: 分三个阶段实现，每阶段都可工作
3. **存储分层**: 热数据(Zustand) → 温数据(localStorage) → 冷数据(IndexedDB/SQLite)
4. **向后兼容**: 类型守卫 + 兼容层确保平滑迁移