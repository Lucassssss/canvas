# 无限画布 SDK 重构规格

## Why

当前项目 `apps/ai_draw/client` 的画布核心代码与业务逻辑耦合严重，无法作为独立 SDK 复用。需要重构为类似 tldraw 的独立基础包，提供清晰的 Shape 系统、Editor 核心 API、事件系统和扩展机制，使后续项目可以轻松集成无限画布能力，同时支持 AI Agent 调用。

## What Changes

- **新建独立 SDK 包** `packages/canvas-sdk`，包含核心画布能力
- **重构 Editor 核心**，提供统一的 API 接口
- **重构 Shape 系统**，支持自定义形状注册和渲染
- **重构事件系统**，提供完整的事件订阅机制
- **重构状态管理**，分离核心状态与业务状态
- **提供 React 组件** `<Canvas />` 作为开箱即用的入口
- **暴露完整的 TypeScript 类型定义**

## Impact

- Affected specs: 画布核心、形状系统、工具系统、事件系统
- Affected code: 
  - `apps/ai_draw/client/src/canvas/` → 迁移至 `packages/canvas-sdk/`
  - 新建 `packages/canvas-sdk/` 作为独立包

---

## ADDED Requirements

### Requirement: SDK 包结构

SDK 应采用清晰的包结构，分离核心模块：

```
packages/canvas-sdk/
├── src/
│   ├── core/                    # 核心模块
│   │   ├── Editor.ts            # Editor 核心类
│   │   ├── Store.ts             # 状态存储
│   │   ├── History.ts           # 历史管理
│   │   ├── Viewport.ts          # 视口管理
│   │   └── Selection.ts         # 选择管理
│   ├── shapes/                  # 形状系统
│   │   ├── ShapeUtil.ts         # 形状工具基类
│   │   ├── ShapeRegistry.ts     # 形状注册表
│   │   ├── types.ts             # 形状类型定义
│   │   └── defaults/            # 内置形状
│   │       ├── RectangleShape.ts
│   │       ├── EllipseShape.ts
│   │       ├── TextShape.ts
│   │       ├── ImageShape.ts
│   │       └── GroupShape.ts
│   ├── events/                  # 事件系统
│   │   ├── EventEmitter.ts      # 事件发射器
│   │   └── types.ts             # 事件类型定义
│   ├── primitives/              # 基础原语
│   │   ├── Vec.ts               # 向量
│   │   ├── Box.ts               # 盒子
│   │   └── Matrix.ts            # 矩阵变换
│   ├── react/                   # React 集成
│   │   ├── Canvas.tsx           # 主画布组件
│   │   ├── ShapeRenderer.tsx    # 形状渲染器
│   │   ├── SelectionBox.tsx     # 选择框
│   │   ├── hooks/               # React Hooks
│   │   │   ├── useEditor.ts     # 获取 Editor 实例
│   │   │   ├── useShape.ts      # 形状订阅
│   │   │   └── useSelection.ts  # 选择订阅
│   │   └── context/             # React Context
│   │       └── EditorContext.tsx
│   ├── utils/                   # 工具函数
│   │   ├── geometry.ts          # 几何计算
│   │   ├── dom.ts               # DOM 操作
│   │   └── id.ts                # ID 生成
│   └── index.ts                 # 导出入口
├── package.json
├── tsconfig.json
└── README.md
```

#### Scenario: 包结构验证
- **WHEN** 开发者查看 SDK 包结构
- **THEN** 可以清晰看到 core、shapes、events、react 等模块分离

---

### Requirement: Editor 核心类

Editor 是 SDK 的核心入口，提供统一的 API 接口。

```typescript
interface Editor {
  // 生命周期
  mount(container: HTMLElement): void
  unmount(): void
  
  // 形状管理
  createShape<T extends ShapeProps>(type: string, props: Partial<T>): Shape
  updateShape(id: string, props: Partial<ShapeProps>): void
  deleteShape(id: string): void
  getShape(id: string): Shape | undefined
  getShapes(): Shape[]
  getShapesByType(type: string): Shape[]
  
  // 选择管理
  select(ids: string | string[]): void
  deselect(ids?: string | string[]): void
  getSelectedShapes(): Shape[]
  getSelectedIds(): string[]
  
  // 视口管理
  getViewport(): ViewportState
  setViewport(viewport: Partial<ViewportState>): void
  zoomIn(): void
  zoomOut(): void
  zoomToFit(): void
  zoomToShape(id: string): void
  panTo(x: number, y: number): void
  
  // 历史管理
  undo(): void
  redo(): void
  canUndo(): boolean
  canRedo(): boolean
  clearHistory(): void
  
  // 坐标转换
  screenToCanvas(x: number, y: number): Vec
  canvasToScreen(x: number, y: number): Vec
  
  // 事件订阅
  on<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): () => void
  once<K extends keyof EditorEvents>(event: K, handler: EditorEvents[K]): () => void
  
  // 导出
  exportToImage(options?: ExportOptions): Promise<Blob>
  exportToJSON(): string
  importFromJSON(json: string): void
  
  // 形状注册
  registerShape(shapeUtil: ShapeUtil): void
  unregisterShape(type: string): void
}
```

#### Scenario: 创建 Editor 实例
- **WHEN** 开发者创建 Editor 实例
- **THEN** 可以通过 `new Editor(options)` 创建
- **AND** 可以通过 `<Canvas editor={editor} />` 绑定到 React 组件

#### Scenario: 形状操作
- **WHEN** 开发者调用 `editor.createShape('rectangle', { x: 100, y: 100 })`
- **THEN** 返回新创建的 Shape 对象
- **AND** 触发 `shape:create` 事件

#### Scenario: 视口控制
- **WHEN** 开发者调用 `editor.zoomToFit()`
- **THEN** 视口自动调整以适应所有形状

---

### Requirement: Shape 系统

Shape 系统采用 ShapeUtil 模式，支持自定义形状注册。

```typescript
interface ShapeUtil<T extends ShapeProps = ShapeProps> {
  type: string
  
  // 默认属性
  defaultProps: Partial<T>
  
  // 最小尺寸
  minSize: { minWidth: number; minHeight: number }
  
  // 渲染
  render(shape: T, context: ShapeRenderContext): React.ReactElement
  
  // 可选：指示器
  renderIndicator?(shape: T, context: ShapeRenderContext): React.ReactElement
  
  // 可选：点击测试
  hitTest?(shape: T, point: Vec): boolean
  
  // 可选：边界计算
  getBounds?(shape: T): Box
  
  // 可选：旋转处理
  onRotate?(shape: T, rotation: number): Partial<T>
  
  // 可选：缩放处理
  onResize?(shape: T, bounds: Box, handle: string): Partial<T>
}

interface ShapeProps {
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

interface ShapeRenderContext {
  isSelected: boolean
  isEditing: boolean
  zoom: number
}
```

#### Scenario: 注册自定义形状
- **WHEN** 开发者定义一个 ClothingShapeUtil 并注册
- **THEN** 可以通过 `editor.createShape('clothing', props)` 创建该形状

#### Scenario: 形状渲染
- **WHEN** 形状需要渲染
- **THEN** 调用对应 ShapeUtil 的 render 方法
- **AND** 传入 ShapeRenderContext 提供上下文信息

---

### Requirement: 事件系统

提供完整的事件订阅机制，支持形状事件、选择事件、视口事件等。

```typescript
interface EditorEvents {
  // 形状事件
  'shape:create': (shape: Shape) => void
  'shape:update': (shape: Shape, prevProps: Partial<ShapeProps>) => void
  'shape:delete': (shape: Shape) => void
  
  // 选择事件
  'selection:change': (selectedIds: string[]) => void
  
  // 视口事件
  'viewport:change': (viewport: ViewportState) => void
  'viewport:zoom': (zoom: number) => void
  'viewport:pan': (x: number, y: number) => void
  
  // 历史事件
  'history:undo': () => void
  'history:redo': () => void
  'history:push': () => void
  
  // 交互事件
  'pointer:down': (event: PointerEvent) => void
  'pointer:move': (event: PointerEvent) => void
  'pointer:up': (event: PointerEvent) => void
  
  // 键盘事件
  'keyboard:keydown': (event: KeyboardEvent) => void
  'keyboard:keyup': (event: KeyboardEvent) => void
}
```

#### Scenario: 订阅形状创建事件
- **WHEN** 开发者调用 `editor.on('shape:create', handler)`
- **THEN** 当形状创建时触发 handler
- **AND** 返回取消订阅函数

#### Scenario: AI Agent 订阅事件
- **WHEN** AI Agent 需要监听画布变化
- **THEN** 可以通过 `editor.on('shape:update', handler)` 订阅
- **AND** 获取形状变更信息

---

### Requirement: React 集成

提供 React 组件和 Hooks，支持声明式使用。

```typescript
// 主组件
interface CanvasProps {
  editor?: Editor
  shapes?: ShapeProps[]
  onShapeCreate?: (shape: Shape) => void
  onSelectionChange?: (ids: string[]) => void
  children?: React.ReactNode
}

const Canvas: React.FC<CanvasProps>

// Hooks
function useEditor(): Editor
function useShape(id: string): Shape | undefined
function useShapes(filter?: (shape: Shape) => boolean): Shape[]
function useSelection(): { selectedIds: string[]; selectedShapes: Shape[] }
function useViewport(): ViewportState
```

#### Scenario: 使用 Canvas 组件
- **WHEN** 开发者在 React 项目中使用 `<Canvas />`
- **THEN** 自动渲染一个可交互的无限画布

#### Scenario: 使用 Hooks
- **WHEN** 开发者在组件中使用 `useSelection()`
- **THEN** 可以响应式获取当前选择状态

---

### Requirement: 坐标系统

使用 CSS `transform: matrix()` 实现无限画布坐标系统。

```typescript
interface ViewportState {
  x: number      // 视口偏移 X
  y: number      // 视口偏移 Y
  zoom: number   // 缩放级别 (0.1 - 10)
}

// 坐标转换
function screenToCanvas(screenX: number, screenY: number, viewport: ViewportState): Vec
function canvasToScreen(canvasX: number, canvasY: number, viewport: ViewportState): Vec
```

#### Scenario: 缩放保持焦点
- **WHEN** 用户在鼠标位置进行缩放
- **THEN** 鼠标指向的画布位置保持不变

---

### Requirement: 历史管理

支持撤销/重做功能，可配置历史记录数量。

```typescript
interface HistoryOptions {
  maxHistory?: number  // 最大历史记录数，默认 50
}

interface HistoryEntry {
  shapes: ShapeProps[]
  selectedIds: string[]
}
```

#### Scenario: 撤销操作
- **WHEN** 用户执行撤销操作
- **THEN** 恢复到上一个历史状态
- **AND** 触发 `history:undo` 事件

---

### Requirement: 导出功能

支持导出为图片和 JSON。

```typescript
interface ExportOptions {
  format?: 'png' | 'jpeg' | 'webp'
  quality?: number        // 0 - 1
  scale?: number          // 1, 2, 4
  background?: string     // 背景色
  padding?: number        // 边距
  onlySelected?: boolean  // 仅导出选中
}
```

#### Scenario: 导出为 PNG
- **WHEN** 开发者调用 `editor.exportToImage({ format: 'png', scale: 2 })`
- **THEN** 返回 PNG Blob 对象

---

### Requirement: TypeScript 支持

提供完整的 TypeScript 类型定义。

```typescript
// 导出所有类型
export type { 
  Editor, 
  Shape, 
  ShapeProps, 
  ShapeUtil,
  ViewportState,
  EditorEvents,
  Box,
  Vec,
  Matrix
}

// 泛型支持
interface Editor {
  createShape<T extends ShapeProps>(type: string, props: Partial<T>): Shape<T>
  getShape<T extends ShapeProps>(id: string): Shape<T> | undefined
}
```

#### Scenario: 类型安全
- **WHEN** 开发者使用 TypeScript
- **THEN** 获得完整的类型提示和检查

---

## MODIFIED Requirements

### Requirement: 形状类型定义

原 `types.ts` 中的形状类型定义需要重构：

```typescript
// 原定义
export type ShapeType = 'rect' | 'circle' | 'text' | 'note' | 'image' | 'arrow' | 'draw' | 'clothing'

// 新定义：形状类型由注册决定，不硬编码
// 内置形状类型
export const BUILTIN_SHAPE_TYPES = {
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  TEXT: 'text',
  IMAGE: 'image',
  GROUP: 'group',
} as const

// 自定义形状类型由开发者定义
// 例如：'clothing', 'logo', 'video' 等
```

---

## REMOVED Requirements

### Requirement: Tool 系统

**Reason**: 本次重构仅关注 Shape 和 Editor 核心，Tool 系统将在后续版本中作为独立模块实现。

**Migration**: 当前 `ToolType` 相关代码暂时保留在应用层，不纳入 SDK 核心。

### Requirement: AI Agent 集成

**Reason**: AI Agent 属于业务层功能，不在 SDK 核心范围内。

**Migration**: SDK 通过事件系统提供 AI Agent 所需的 API，AI Agent 实现保留在应用层。

### Requirement: 业务组件

**Reason**: ClothingPanel、LogoEditorLayer 等业务组件不属于 SDK 核心。

**Migration**: 这些组件保留在 `apps/ai_draw/client/` 中，依赖 SDK 提供的 API。

---

## 技术约束

1. **不使用 tldraw 代码**：仅参考架构设计，所有代码自研
2. **使用 Bun 作为包管理工具**
3. **React 19 + TypeScript 5.x**
4. **Zustand 作为内部状态管理**（对外透明）
5. **支持 ESM 和 CJS 两种模块格式**

---

## API 使用示例

### 基础使用

```tsx
import { Canvas, createEditor } from '@gke/canvas-sdk'
import '@gke/canvas-sdk/style.css'

const editor = createEditor()

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas editor={editor} />
    </div>
  )
}
```

### 自定义形状

```tsx
import { ShapeUtil, ShapeProps, ShapeRenderContext } from '@gke/canvas-sdk'

interface ClothingShapeProps extends ShapeProps {
  clothingView: 'front' | 'back' | 'side'
  clothingColors: {
    body: string
    sleeveLeft: string
    sleeveRight: string
    collar: string
  }
}

class ClothingShapeUtil extends ShapeUtil<ClothingShapeProps> {
  type = 'clothing'
  
  defaultProps = {
    width: 800,
    height: 800,
    clothingView: 'front',
    clothingColors: {
      body: '#191919',
      sleeveLeft: '#8C8C8E',
      sleeveRight: '#8C8C8E',
      collar: '#8C8C8E',
    },
  }
  
  minSize = { minWidth: 100, minHeight: 100 }
  
  render(shape: ClothingShapeProps, context: ShapeRenderContext) {
    return <ClothingComponent shape={shape} />
  }
}

// 注册
editor.registerShape(new ClothingShapeUtil())
```

### AI Agent 调用

```tsx
// AI Agent 可以通过 API 操作画布
editor.createShape('rectangle', { x: 100, y: 100, width: 200, height: 150 })

// 订阅事件
editor.on('shape:create', (shape) => {
  console.log('Shape created:', shape.id)
})

// 获取当前状态
const shapes = editor.getShapes()
const viewport = editor.getViewport()
```

---

## 性能目标

| 指标 | 目标值 |
|------|--------|
| 首次渲染 | < 100ms |
| 形状操作响应 | < 16ms (60fps) |
| 支持 1000+ 形状 | 无明显卡顿 |
| 包体积 (gzip) | < 50KB |

---

## 版本规划

- **v1.0.0**: 核心 Editor + Shape 系统 + React 组件
- **v1.1.0**: Tool 系统（选择、手型、画笔等）
- **v1.2.0**: 辅助系统（对齐、吸附、网格）
- **v2.0.0**: 协作功能（多人实时编辑）
