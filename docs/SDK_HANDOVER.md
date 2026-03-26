# 无限画布 SDK 重构 - 项目交接文档

## 文档信息

| 项目 | 内容 |
|------|------|
| **文档名称** | 无限画布 SDK 重构交接文档 |
| **项目** | GKE - 无限画布智能设计平台 |
| **版本** | v1.0.0 |
| **交接日期** | 2026-03-26 |
| **状态** | SDK 核心开发完成，待应用层集成 |

---

## 1. 项目概述

### 1.1 重构目标

将 `apps/ai_draw/client` 中的画布核心代码重构为独立 SDK 包，类似 tldraw 的架构设计，完全自研实现，可独立发布和使用。

### 1.2 重构范围

| 模块 | 状态 | 说明 |
|------|------|------|
| SDK 包结构 | ✅ 完成 | `packages/canvas-sdk/` |
| Editor 核心 | ✅ 完成 | 形状管理、选择管理、视口管理 |
| Shape 系统 | ✅ 完成 | ShapeUtil 模式 + 注册表 |
| 事件系统 | ✅ 完成 | EventEmitter + 事件订阅 |
| 内置形状 | ✅ 完成 | Rectangle, Ellipse, Text, Image, Group |
| React 集成 | ✅ 完成 | Canvas 组件 + Hooks |
| 历史管理 | ✅ 完成 | undo/redo |
| 导出功能 | ✅ 完成 | JSON 导出/导入 |
| Monorepo 配置 | ✅ 完成 | Bun workspaces + Turborepo |

### 1.3 不在本次重构范围

- Tool 系统（工具栏、快捷键等）→ 保留在应用层
- AI Agent 集成 → 保留在应用层，通过 SDK 事件系统调用
- 业务组件（ClothingPanel、LogoEditorLayer 等）→ 保留在应用层

---

## 2. 技术架构

### 2.1 Monorepo 结构

```
canvas/
├── package.json              # 根 workspace 配置
├── turbo.json               # Turborepo 配置
├── apps/
│   └── ai_draw/             # 主应用
│       ├── package.json      # 依赖 @gke/canvas-sdk: workspace:*
│       └── src/
│           ├── App.tsx       # 应用入口
│           ├── shapes/      # 自定义形状
│           └── canvas/      # 业务组件
└── packages/
    └── canvas-sdk/          # SDK 包
        ├── src/             # 源码
        ├── dist/            # 构建产物
        ├── package.json     # 名称: @gke/canvas-sdk
        └── README.md        # SDK 文档
```

### 2.2 SDK 包结构

```
packages/canvas-sdk/src/
├── core/                    # 核心模块
│   ├── Editor.ts            # Editor 核心类
│   ├── Store.ts             # Zustand 状态存储
│   ├── History.ts           # 历史管理器
│   └── types.ts             # 核心类型定义
├── shapes/                  # 形状系统
│   ├── ShapeUtil.ts         # 形状工具基类
│   ├── ShapeRegistry.ts     # 形状注册表
│   ├── types.ts             # 形状类型定义
│   └── defaults/            # 内置形状
│       ├── RectangleShape.ts
│       ├── EllipseShape.ts
│       ├── TextShape.ts
│       ├── ImageShape.ts
│       └── GroupShape.ts
├── events/                  # 事件系统
│   ├── EventEmitter.ts      # 事件发射器
│   └── types.ts             # 事件类型定义
├── primitives/               # 基础原语
│   ├── Vec.ts               # 向量运算
│   ├── Box.ts               # 边界框计算
│   └── Matrix.ts            # 2D 矩阵变换
├── react/                    # React 集成
│   ├── Canvas.tsx            # 主画布组件
│   ├── context/             # React Context
│   │   └── EditorContext.tsx
│   └── hooks/               # React Hooks
│       ├── useEditor.ts
│       ├── useShape.ts
│       ├── useShapes.ts
│       ├── useSelection.ts
│       └── useViewport.ts
├── utils/                    # 工具函数
│   ├── id.ts                # ID 生成器
│   ├── geometry.ts          # 几何计算
│   └── dom.ts               # DOM 操作
├── createEditor.ts           # Editor 工厂函数
└── index.ts                  # 导出入口
```

### 2.3 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Bun | 1.x | 包管理器、运行时 |
| React | 19.x | UI 框架 |
| TypeScript | 5.6.x | 类型安全 |
| Zustand | 4.5.x | 内部状态管理 |

---

## 3. SDK API 参考

### 3.1 Editor 类

Editor 是 SDK 的核心入口，提供统一的 API 接口。

#### 生命周期

```typescript
editor.mount(container: HTMLElement)  // 挂载到 DOM
editor.unmount()                       // 卸载
```

#### 形状管理

```typescript
editor.createShape<T>(type: string, props: Partial<T>): ShapeProps
editor.updateShape(id: string, props: Partial<ShapeProps>): void
editor.deleteShape(id: string): void
editor.getShape(id: string): ShapeProps | undefined
editor.getShapes(): ShapeProps[]
editor.getShapesByType(type: string): ShapeProps[]
```

#### 选择管理

```typescript
editor.select(ids: string | string[]): void
editor.deselect(ids?: string | string[]): void
editor.getSelectedShapes(): ShapeProps[]
editor.getSelectedIds(): string[]
```

#### 视口管理

```typescript
editor.getViewport(): ViewportState
editor.setViewport(viewport: Partial<ViewportState>): void
editor.zoomIn(): void
editor.zoomOut(): void
editor.zoomToFit(): void
editor.zoomToShape(id: string): void
editor.panTo(x: number, y: number): void
editor.screenToCanvas(x: number, y: number): Vec
editor.canvasToScreen(x: number, y: number): Vec
```

#### 历史管理

```typescript
editor.undo(): void
editor.redo(): void
editor.canUndo(): boolean
editor.canRedo(): boolean
editor.clearHistory(): void
```

#### 事件订阅

```typescript
editor.on<K extends keyof EditorEvents>(event: K, handler): () => void
editor.once<K extends keyof EditorEvents>(event: K, handler): () => void
```

#### 导出/导入

```typescript
editor.exportToJSON(): string
editor.importFromJSON(json: string): void
```

#### 形状注册

```typescript
editor.registerShape(shapeUtil: ShapeUtil): void
editor.unregisterShape(type: string): void
editor.getShapeUtil(type: string): ShapeUtil | undefined
```

### 3.2 内置形状类型

| 形状 | 类型 | 特有属性 |
|------|------|----------|
| Rectangle | `rectangle` | `fill`, `stroke`, `strokeWidth`, `borderRadius` |
| Ellipse | `ellipse` | `fill`, `stroke`, `strokeWidth` |
| Text | `text` | `text`, `fontSize`, `fontFamily`, `color`, `textAlign` |
| Image | `image` | `src`, `objectFit`, `borderRadius` |
| Group | `group` | `childIds` |

### 3.3 事件类型

```typescript
type EditorEvents = {
  'shape:create': { shape: ShapeProps }
  'shape:update': { shape: ShapeProps; prevProps: Record<string, unknown> }
  'shape:delete': { shape: ShapeProps }
  'selection:change': { selectedIds: string[] }
  'viewport:change': { viewport: ViewportState }
  'viewport:zoom': { zoom: number }
  'viewport:pan': { x: number; y: number }
  'history:undo': Record<string, never>
  'history:redo': Record<string, never>
  'history:push': Record<string, never>
}
```

---

## 4. 使用示例

### 4.1 基础使用

```tsx
import { Canvas, createEditor, EditorProvider } from '@gke/canvas-sdk'

const editor = createEditor()

function App() {
  return (
    <EditorProvider editor={editor}>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas editor={editor} />
      </div>
    </EditorProvider>
  )
}
```

### 4.2 自定义形状

```tsx
import { ShapeUtil } from '@gke/canvas-sdk'

interface ClothingShapeProps extends ShapeProps {
  clothingView: 'front' | 'back' | 'side'
  clothingColors: { body: string; sleeveLeft: string; ... }
}

class ClothingShapeUtil extends ShapeUtil<ClothingShapeProps> {
  type = 'clothing'
  defaultProps = { width: 800, height: 800, clothingView: 'front', ... }
  minSize = { minWidth: 100, minHeight: 100 }
  
  render(shape: ClothingShapeProps, context) {
    return <ClothingComponent shape={shape} />
  }
}

// 注册自定义形状
editor.registerShape(new ClothingShapeUtil())

// 使用
editor.createShape('clothing', { x: 100, y: 100 })
```

### 4.3 事件订阅

```tsx
// 订阅形状创建
editor.on('shape:create', ({ shape }) => {
  console.log('Created:', shape.id)
})

// 订阅选择变化
editor.on('selection:change', ({ selectedIds }) => {
  console.log('Selected:', selectedIds)
})

// AI Agent 可通过这些事件监听画布变化
```

---

## 5. 已完成工作

### 5.1 SDK 包开发

| 模块 | 文件 | 状态 |
|------|------|------|
| Editor | `src/core/Editor.ts` | ✅ |
| Store | `src/core/Store.ts` | ✅ |
| History | `src/core/History.ts` | ✅ |
| ShapeUtil | `src/shapes/ShapeUtil.ts` | ✅ |
| ShapeRegistry | `src/shapes/ShapeRegistry.ts` | ✅ |
| EventEmitter | `src/events/EventEmitter.ts` | ✅ |
| Vec | `src/primitives/Vec.ts` | ✅ |
| Box | `src/primitives/Box.ts` | ✅ |
| Matrix | `src/primitives/Matrix.ts` | ✅ |
| Canvas | `src/react/Canvas.tsx` | ✅ |
| Hooks | `src/react/hooks/*.ts` | ✅ |
| 内置形状 | `src/shapes/defaults/*.ts` | ✅ |

### 5.2 Monorepo 配置

| 配置 | 文件 | 状态 |
|------|------|------|
| Workspace | `package.json` | ✅ |
| Turborepo | `turbo.json` | ✅ |
| SDK package.json | `packages/canvas-sdk/package.json` | ✅ |
| SDK 构建配置 | `packages/canvas-sdk/tsconfig.json` | ✅ |

### 5.3 文档

| 文档 | 位置 | 状态 |
|------|------|------|
| SDK README | `packages/canvas-sdk/README.md` | ✅ |
| 重构规格 | `.trae/specs/canvas-sdk-refactor/spec.md` | ✅ |
| 任务清单 | `.trae/specs/canvas-sdk-refactor/tasks.md` | ✅ |
| 验证清单 | `.trae/specs/canvas-sdk-refactor/checklist.md` | ✅ |

---

## 6. 待完成工作

### 6.1 高优先级

| 任务 | 说明 | 依赖 |
|------|------|------|
| 应用层集成 | 将 `apps/ai_draw` 完全迁移到使用 SDK | SDK 构建完成 |
| 业务组件迁移 | ClothingPanel、LogoEditorLayer 等使用 SDK API | 应用层集成 |
| Tool 系统 | 工具栏、快捷键等（可选，保留在应用层） | 应用层集成 |

### 6.2 中优先级

| 任务 | 说明 |
|------|------|
| 单元测试 | Editor、Store、Shape 系统测试 |
| 性能测试 | 验证 60fps、1000+ 形状性能 |
| 包体积优化 | 确保 gzip < 50KB |

### 6.3 低优先级

| 任务 | 说明 |
|------|------|
| exportToImage | 图片导出功能 |
| 协作功能 | 多人实时编辑 (v2.0) |

---

## 7. 运行命令

### 7.1 安装依赖

```bash
# 从根目录安装所有 workspace 依赖
bun install
```

### 7.2 构建 SDK

```bash
# 构建 SDK 包
cd packages/canvas-sdk
bun run build

# 监听模式
bun run dev
```

### 7.3 运行应用

```bash
# 运行主应用
cd apps/ai_draw
bun run dev
```

### 7.4 构建应用

```bash
cd apps/ai_draw
bun run build
```

---

## 8. 注意事项

1. **SDK 必须先构建**：`apps/ai_draw` 依赖 `packages/canvas-sdk`，确保先构建 SDK
2. **使用 workspace 协议**：`@gke/canvas-sdk: workspace:*` 确保链接本地包
3. **不复制 tldraw 代码**：仅参考架构设计
4. **AI 部分不在 SDK**：AI Agent 保留在应用层，通过 SDK 事件系统集成

---

## 9. 关键文件位置

| 文件 | 路径 |
|------|------|
| SDK 包根目录 | `packages/canvas-sdk/` |
| SDK 入口 | `packages/canvas-sdk/src/index.ts` |
| SDK 构建产物 | `packages/canvas-sdk/dist/` |
| SDK README | `packages/canvas-sdk/README.md` |
| 应用入口 | `apps/ai_draw/src/App.tsx` |
| 重构规格 | `.trae/specs/canvas-sdk-refactor/` |

---

**文档版本历史**

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| v1.0.0 | 2026-03-26 | GKE Team | 初始版本 |
