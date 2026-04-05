# Joii 画布系统架构文档

## 概述

Joii 是一个基于 Web 的无限画布智能设计平台，核心功能围绕**画布操作**和**AI 组件**展开。本文档详细介绍画布与组件的核心架构。

---

## 一、目录结构

```
apps/web/src/
├── app/canvas/
│   ├── Canvas.tsx                    # 主画布组件
│   ├── store.ts                     # Zustand 状态管理
│   ├── page.tsx                     # 画布页面入口
│   ├── style.css                    # 画布样式
│   ├── components/                  # 画布 UI 组件
│   │   ├── Toolbar.tsx              # 工具栏
│   │   ├── LeftSidebar.tsx          # 左侧边栏
│   │   ├── RightSidebar.tsx         # 右侧边栏
│   │   ├── Header.tsx               # 顶部栏
│   │   ├── ClothingPanel.tsx        # 服装面板
│   │   ├── ClothingSidebar.tsx       # 服装侧边栏
│   │   ├── LogoEditorLayer.tsx      # Logo 编辑层
│   │   ├── LogoMaterialPanel.tsx    # Logo 素材面板
│   │   ├── SaveIndicator.tsx        # 保存指示器
│   │   └── ZoomControls.tsx         # 缩放控制
│   ├── shapes/                      # 形状组件
│   │   ├── Shape.tsx                # 形状渲染器（分发器）
│   │   ├── types.ts                 # 类型定义
│   │   ├── ClothingComponent.tsx     # 服装组件
│   │   ├── AICombinationComponent.tsx # AI 组合组件
│   │   ├── CustomCombination.tsx     # 自定义组合
│   │   ├── ImageSlot.tsx            # 图片插槽
│   │   └── DetailImageShape.tsx     # 详情图组件
│   └── detail-image/                 # 详情图模块
│       ├── DetailImageShape.tsx      # 详情图组件
│       ├── DetailImageContainer.tsx  # 详情图容器
│       ├── DetailImagePanel.tsx      # 详情图面板
│       ├── DetailImageService.ts     # 详情图服务
│       ├── DesignPlanPanel.tsx      # 设计方案面板
│       ├── AIWriteModal.tsx         # AI 写作弹窗
│       ├── store.ts                 # 详情图状态
│       └── style.css
├── ai-combination/                  # AI 组合模块
│   ├── service.ts                   # AI 服务
│   ├── registry.tsx                 # 注册表
│   ├── types.ts                     # 类型定义
│   ├── built-in-types.ts            # 内置组合类型
│   └── ...
└── lib/
    ├── canvas/
    │   ├── transform.ts              # 变换矩阵工具
    │   ├── incremental-transform.ts  # 增量变换
    │   └── operation-buffer.ts       # 操作缓冲
    ├── api/
    │   └── project-api.ts           # 项目 API 客户端
    ├── storage/
    │   ├── local.ts                 # localStorage 管理
    │   └── image.ts                 # 图片存储
    └── import-export/
        └── json.ts                  # JSON 导入导出
```

---

## 二、画布核心（Canvas）

### 2.1 主画布组件

**文件**: [Canvas.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/Canvas.tsx)

主画布组件负责：
- 鼠标事件处理（拖拽、缩放、选择）
- 键盘快捷键处理
- 形状渲染循环
- 视口变换
- 选择框渲染

#### 视口变换原理

画布使用 CSS `matrix` 变换实现无限画布的平移和缩放：

```typescript
// 视口状态
interface ViewportState {
  x: number      // 画布原点在屏幕的 X 偏移（像素）
  y: number      // 画布原点在屏幕的 Y 偏移（像素）
  zoom: number   // 缩放比例，范围 0.1 ~ 10
}

// 变换矩阵生成
const matrix = `matrix(${zoom}, 0, 0, ${zoom}, ${x}, ${y})`
```

#### 坐标转换

```typescript
// 屏幕坐标 → 画布坐标
screenToCanvas(screenX, screenY) {
  return {
    x: (screenX - viewport.x) / viewport.zoom,
    y: (screenY - viewport.y) / viewport.zoom
  }
}

// 画布坐标 → 屏幕坐标
canvasToScreen(canvasX, canvasY) {
  return {
    x: canvasX * viewport.zoom + viewport.x,
    y: canvasY * viewport.zoom + viewport.y
  }
}
```

### 2.2 状态管理（Zustand Store）

**文件**: [store.ts](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/store.ts)

#### 状态结构

```typescript
interface CanvasStore {
  // 形状数据
  shapes: ShapeProps[]           // 画布上所有形状
  selectedIds: string[]          // 当前选中的形状 ID

  // 视口
  viewport: ViewportState        // 视口状态

  // 工具
  activeTool: ToolType          // 当前工具
  activeAICategory: string | null  // 当前 AI 类别

  // 拖拽状态
  isDragging: boolean
  isResizing: boolean
  isRotating: boolean

  // 历史记录（撤销/重做）
  history: HistoryEntry[]
  historyIndex: number

  // 剪贴板
  clipboard: ShapeProps[]

  // Logo 编辑状态
  logoEditingState: {
    isEditing: boolean
    previousViewport: ViewportState | null
    targetShapeId: string | null
    targetLogoId: string | null
  }

  // 项目管理
  projectId: string | null
  projectName: string
  isDirty: boolean              // 是否有未保存的更改
  lastSavedAt: number | null

  // 自动保存
  autoSaveTimer: NodeJS.Timeout | null
  isSaving: boolean
}
```

#### 核心方法

| 方法 | 说明 |
|------|------|
| `addShape(shape)` | 添加形状 |
| `updateShape(id, props)` | 更新形状属性 |
| `deleteShape(id)` | 删除形状 |
| `deleteSelectedShapes()` | 删除选中形状 |
| `setSelectedIds(ids)` | 设置选中 |
| `addToSelection(id)` | 添加到选中 |
| `clearSelection()` | 清除选中 |
| `setViewport(viewport)` | 设置视口 |
| `zoomIn()` / `zoomOut()` | 缩放 |
| `zoomToFit()` | 适应窗口 |
| `undo()` / `redo()` | 撤销/重做 |
| `copySelectedShapes()` | 复制 |
| `pasteShapes()` | 粘贴 |
| `duplicateSelectedShapes()` | 复制一份 |
| `bringToFront()` / `sendToBack()` | Z 轴排序 |
| `screenToCanvas()` / `canvasToScreen()` | 坐标转换 |

---

## 三、形状系统（Shapes）

### 3.1 类型定义

**文件**: [shapes/types.ts](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/shapes/types.ts)

```typescript
export type ShapeType =
  | 'rect'              // 矩形
  | 'circle'            // 圆形
  | 'text'              // 文本
  | 'note'              // 便签
  | 'image'             // 图片
  | 'arrow'             // 箭头
  | 'draw'              // 自由绘制
  | 'clothing'          // 服装 ⭐
  | 'ai-combination'    // AI 组合 ⭐
  | 'image-slot'         // 图片插槽
  | 'custom-combination' // 自定义组合
  | 'detail-image'       // 详情图 ⭐
```

#### 基础形状属性

```typescript
interface ShapeProps {
  id: string
  type: ShapeType

  // 位置和尺寸
  x: number
  y: number
  width: number
  height: number
  rotation: number        // 旋转角度（度）

  // 变换
  scaleX?: number        // X 轴缩放
  scaleY?: number        // Y 轴缩放

  // 样式
  fill: string           // 填充色
  stroke: string         // 边框色
  strokeWidth: number    // 边框宽度
  opacity: number        // 不透明度

  // 类型特定属性
  text?: string         // 文本内容

  // 变换约束
  resizable?: boolean   // 是否可调整大小
  rotatable?: boolean   // 是否可旋转
}
```

### 3.2 形状渲染器

**文件**: [Shape.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/shapes/Shape.tsx)

`Shape` 组件是形状渲染的**分发器**，根据 `shape.type` 渲染不同的子组件：

```typescript
const renderContent = () => {
  switch (shape.type) {
    case 'text':
      return <TextEditor />
    case 'note':
      return <NoteEditor />
    case 'image':
      return <ImageRenderer />
    case 'draw':
      return <FreeDrawPath />
    case 'arrow':
      return <ArrowSVG />
    case 'clothing':
      return <ClothingComponent />
    case 'ai-combination':
      return <AICombinationComponent />
    case 'custom-combination':
      return <CustomCombination />
    case 'detail-image':
      return <DetailImageShape />
    default:
      return null
  }
}
```

#### 变换矩阵

每个形状使用 `TransformMatrix` 计算 CSS 变换：

```typescript
const transformStyle = {
  transform: TransformMatrix.toCssString(
    TransformMatrix.compose(
      cx, cy,           // 中心点
      width, height,    // 尺寸
      rotation,         // 旋转
      scaleX ?? 1,      // X 缩放
      scaleY ?? 1       // Y 缩放
    )
  )
}
```

---

## 四、组件详解

### 4.1 服装组件（ClothingComponent）

**文件**: [ClothingComponent.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/shapes/ClothingComponent.tsx)

#### 功能概述

服装组件用于在画布上展示可自定义颜色的服装模板，支持：
- 三个视角切换（前/后/侧）
- 四部位颜色自定义
- Logo 区域定义和编辑

#### SVG 模板

服装使用预定义的 SVG 模板：
```
/clothing/
├── 前幅.svg    # 正面
├── 后幅.svg    # 背面
└── 侧幅.svg    # 侧面
```

SVG 中的关键元素：
- `path#fill_body` - 主体
- `path#fill_sleeve_left` - 左袖
- `path#fill_sleeve_right` - 右袖
- `path#fill_collar` - 领口
- `rect#logo_*` - Logo 区域（可多个）

#### 数据结构

```typescript
// 服装视角
type ClothingView = 'front' | 'back' | 'side'

// 服装颜色
interface ClothingColors {
  body: string        // 主体颜色，如 '#191919'
  sleeveLeft: string  // 左袖颜色
  sleeveRight: string // 右袖颜色
  collar: string      // 领口颜色
}

// Logo 区域
interface LogoArea {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// 服装形状属性
interface ClothingShapeProps extends ShapeProps {
  type: 'clothing'
  clothingView?: ClothingView      // 默认 'front'
  clothingColors?: ClothingColors  // 颜色配置
  logoAreas?: LogoArea[]           // Logo 区域列表
  activeLogoId?: string            // 当前编辑的 Logo ID
  logoContent?: Record<string, string>  // Logo 图片 URL
}
```

#### Logo 编辑流程

1. 点击服装上的 Logo 区域
2. 触发 `zoomToArea()` 将该区域放大到视口中心
3. 用户可拖拽图片到 Logo 区域
4. Logo 内容存储在 `logoContent` 中

### 4.2 AI 组合组件（AICombinationComponent）

**文件**: [AICombinationComponent.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx)

#### 插槽（Slot）架构

AI 组合组件基于**插槽模式**，支持灵活定义输入输出：

```typescript
// 插槽定义
interface SlotDefinition {
  id: string                    // 唯一标识
  name: string                  // 显示名称
  type: 'image' | 'text'       // 插槽类型
  role: 'input' | 'output'      // 输入或输出
  placeholder?: string           // 空状态占位文本
  acceptDrop?: boolean          // 是否接受拖拽
  defaultValue?: string         // 默认值
  required?: boolean            // 是否必填
}

// 插槽内容
interface SlotContent {
  imageUrl?: string | null      // 图片 URL
  text?: string | null          // 文本内容
  source: 'none' | 'upload' | 'canvas' | 'drag' | 'text'
}

// 组合类型
interface CombinationType {
  id: string
  name: string
  description: string
  icon?: string
  slots: SlotDefinition[]
  aiConfig: AIConfig
}
```

#### 内置组合类型

| ID | 名称 | 描述 | 插槽配置 |
|----|------|------|----------|
| `simple-tryon` | 服装换装 | 模特图 + 服装图 = 换装结果 | model, clothing → result |
| `fixed-face-tryon` | 固定面部换衣 | 保持面部特征的换装 | model, face, clothing → result |
| `fixed-face-bg-tryon` | 固定面部背景换衣 | 保持面部和背景 | model, face, background, clothing → result |
| `fixed-face-bg-pose-tryon` | 固定全部换衣 | 保持面部、背景、姿势 | model, face, background, pose, clothing → result |
| `pose-fission` | 姿势裂变 | 一个图生成5个姿势 | source → result1~5 |

#### 工作流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  输入插槽1   │     │  输入插槽2   │     │  输出插槽    │
│  (模特图)   │     │  (服装图)   │     │  (结果图)   │
└──────┬──────┘     └──────┬──────┘     └──────▲──────┘
       │                   │                   │
       └─────────┬─────────┘                   │
                 ▼                             │
          ┌─────────────┐                     │
          │  ▶ 生成按钮  │                     │
          └──────┬──────┘                     │
                 │                            │
                 ▼                            │
          ┌─────────────┐                     │
          │ AI 服务调用  │─────────────────────┘
          └─────────────┘
```

#### 生成流程

```typescript
async function handleExecute() {
  // 1. 更新状态为生成中
  updateShape(id, { combinationStatus: 'generating' })

  // 2. 调用 AI 服务
  const result = await aiCombinationService.generate({
    id,
    combinationTypeId,
    slotContents,
    settings
  })

  // 3. 更新结果或错误
  if (result.success) {
    updateShape(id, {
      combinationStatus: 'completed',
      combinationResults: [result.imageUrl]
    })
  } else {
    updateShape(id, {
      combinationStatus: 'error',
      combinationError: result.error
    })
  }
}
```

### 4.3 详情图组件（DetailImageShape）

**文件**: [detail-image/DetailImageShape.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/detail-image/DetailImageShape.tsx)

#### 多步骤向导

详情图组件是一个完整的 AI 生成向导，包含 5 个步骤：

```typescript
type DetailImageStep = 'input' | 'analyzing' | 'planning' | 'generating' | 'done'
```

#### 步骤详情

| 步骤 | 状态 | 说明 |
|------|------|------|
| `input` | 用户输入 | 上传产品图片、设置参数、输入需求描述 |
| `analyzing` | AI 处理 | 分析产品特征（模拟 1.5s） |
| `planning` | AI 处理 | 生成设计方案（模拟 1s） |
| `generating` | AI 生成 | 执行 AI 生图（模拟 3s） |
| `done` | 完成 | 展示结果，可添加到画布或重新生成 |

#### 配置选项

```typescript
// 尺寸比例
type AspectRatio = '1:1' | '3:4 竖版' | '4:3 横版' | '9:16 竖版' | '16:9 横版'

// 分辨率
type Resolution = '1K 标准' | '2K 高清' | '4K 超清'

// 生成速度
type GenerationSpeed = 'standard' | 'fast' | 'ultra'

// 产品图片（最多6张）
productImages: string[]  // 图片 URL 列表
```

#### 添加到画布

生成完成后，用户可以点击"添加到画布"将结果作为独立图片形状添加到画布：

```typescript
function handleAddToCanvas() {
  generatedImages.forEach((url, i) => {
    useCanvasStore.getState().addShape({
      type: 'image',
      x: shape.x + shape.width + 20 + (i % 2) * 220,
      y: shape.y + Math.floor(i / 2) * 220,
      width: 200,
      height: 200,
      imageUrl: url
    })
  })
}
```

---

## 五、变换系统

### 5.1 变换矩阵（TransformMatrix）

**文件**: [lib/canvas/transform.ts](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/lib/canvas/transform.ts)

#### 核心概念

CSS `matrix(a, b, c, d, e, f)` 对应 2D 变换：

```
| a  c  e |
| b  d  f |
| 0  0  1 |
```

- `a, d` - 缩放
- `b, c` - 旋转/倾斜
- `e, f` - 平移

#### 组合变换

```typescript
TransformMatrix.compose(cx, cy, width, height, rotation, scaleX, scaleY)

// 分解：
// 1. 平移到原点 (-cx, -cy)
// 2. 缩放 (scaleX, scaleY)
// 3. 旋转 (rotation 度)
// 4. 平移回 (cx, cy)
// 5. 应用最终平移 (x, y)
```

### 5.2 形状变换操作

#### 单选变换

```typescript
// 调整大小 - 8 个手柄
type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

// 旋转 - 4 个角落
type RotateCorner = 'nw' | 'ne' | 'sw' | 'se'
```

#### 多选变换

多选时，计算所有选中形状的**边界框（Bounding Box）**：

```typescript
const allBounds = selectedShapes.map(s =>
  getRotatedBoundingBox(s.x, s.y, s.width, s.height, s.rotation)
)
const minX = Math.min(...allBounds.map(b => b.minX))
const minY = Math.min(...allBounds.map(b => b.minY))
const maxX = Math.max(...allBounds.map(b => b.maxX))
const maxY = Math.max(...allBounds.map(b => b.maxY))
```

---

## 六、工具栏系统

**文件**: [components/Toolbar.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/app/canvas/components/Toolbar.tsx)

### 6.1 工具列表

```typescript
const baseTools = [
  { type: 'select',     icon: <MousePointer2 />, label: '选择',   shortcut: 'V' },
  { type: 'hand',        icon: <Hand />,          label: '手型',   shortcut: 'H' },
  { type: 'pen',         icon: <Pencil />,         label: '画笔',   shortcut: 'P' },
  { type: 'eraser',      icon: <Eraser />,        label: '橡皮擦', shortcut: 'E' },
  { type: 'arrow',       icon: <ArrowRight />,     label: '箭头',   shortcut: 'A' },
  { type: 'text',        icon: <Type />,           label: '文本',   shortcut: 'T' },
  { type: 'note',        icon: <StickyNote />,     label: '便签',   shortcut: 'N' },
  { type: 'image',       icon: <ImageIcon />,       label: '图片',   shortcut: 'I' },
  { type: 'shape',       icon: <Square />,          label: '形状',   shortcut: 'S' },
  { type: 'clothing',    icon: <Shirt />,           label: '服装',   shortcut: 'C' },
  { type: 'detail-image',icon: <Wand2 />,           label: '详情图', shortcut: 'D' },
]
```

### 6.2 AI 组合下拉菜单

点击 Sparkles 图标打开下拉菜单，显示所有注册的 AI 组合类型：

```
┌─────────────────────────────┐
│ 服装换装                    ✓│
│ 模特图 + 服装图 = 换装结果   │
├─────────────────────────────┤
│ 固定面部换衣                │
│ 保持固定面部特征进行换装     │
├─────────────────────────────┤
│ 固定面部背景换衣            │
│ 保持固定面部和背景进行换装   │
├─────────────────────────────┤
│ ...                         │
├─────────────────────────────┤
│ + 创建自定义组合           │
└─────────────────────────────┘
```

### 6.3 创建形状

点击工具按钮时，根据类型创建对应形状：

```typescript
function createShape(type: ToolType) {
  const size = SHAPE_SIZES[type] || { width: 200, height: 200 }
  const pos = getNextPosition(size.width, size.height)

  const newShape = addShape({
    type,
    x: pos.x,
    y: pos.y,
    width: size.width,
    height: size.height,
    // ... 其他默认属性
  })

  setSelectedIds([newShape.id])
  focusOnArea(pos.x, pos.y, size.width, size.height)
}
```

---

## 七、AI 服务

### 7.1 AI 组合服务

**文件**: [ai-combination/service.ts](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/ai-combination/service.ts)

```typescript
class AICombinationService {
  // 上传图片到 S3
  async uploadImage(file: File, folder: string): Promise<UploadResult> {
    // 1. 获取预签名 URL
    const signedData = await fetch('/api/upload/signed-url', {...})

    // 2. 直接上传到 S3
    await fetch(signedData.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    })

    return { success: true, url: signedData.url }
  }

  // AI 生成
  async generate(instance: GenerateInput): Promise<GenerationResult> {
    const response = await fetch('/api/image/generate', {
      method: 'POST',
      body: JSON.stringify(instance)
    })
    return response.json()
  }
}

export const aiCombinationService = new AICombinationService()
```

### 7.2 注册表模式

**文件**: [ai-combination/registry.tsx](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/ai-combination/registry.tsx)

```typescript
class CombinationTypeRegistry {
  private types: Map<string, CombinationType> = new Map()
  private listeners: Set<() => void> = new Set()

  register(type: CombinationType): void {
    this.types.set(type.id, type)
    this.notifyListeners()
  }

  get(id: string): CombinationType | undefined {
    return this.types.get(id)
  }

  getAll(): CombinationType[] {
    return Array.from(this.types.values())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
}

export const combinationRegistry = new CombinationTypeRegistry()
```

---

## 八、持久化与同步

### 8.1 存储层次

```
┌─────────────────────────────────────────────┐
│  Zustand Store（热数据层）                   │
│  - shapes, viewport, selection, history      │
│  - 内存状态，高频读写                        │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  localStorage（温数据层）                    │
│  - 项目快照                                  │
│  - 用户偏好                                  │
│  - 自动保存点                               │
│  - 5MB 限制                                 │
└─────────────────────┬───────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│  后端 API（冷数据层）                        │
│  - 项目元数据                                │
│  - 用户数据                                  │
│  - 云端同步基础                              │
└─────────────────────────────────────────────┘
```

### 8.2 自动保存机制

```typescript
const AUTO_SAVE_DELAY = 2000  // 2秒防抖

scheduleAutoSave() {
  if (autoSaveTimer) clearTimeout(autoSaveTimer)

  const timer = setTimeout(() => {
    saveToServer()
  }, AUTO_SAVE_DELAY)

  set({ autoSaveTimer: timer })
}
```

### 8.3 项目 API

**文件**: [lib/api/project-api.ts](file:///Users/lucas/workspace/workspace/ai/canvas/apps/web/src/lib/api/project-api.ts)

| 方法 | 说明 |
|------|------|
| `getProjects()` | 获取项目列表 |
| `getProject(id)` | 获取项目详情 |
| `createProject(params)` | 创建项目 |
| `updateProject(id, params)` | 更新项目 |
| `deleteProject(id)` | 删除项目 |
| `saveCanvasData(projectId, canvasData)` | 保存画布数据 |

---

## 九、关键设计模式

### 9.1 注册表模式

用于管理 AI 组合类型，便于扩展新的 AI 模型：

```typescript
// 注册新类型
combinationRegistry.register({
  id: 'my-custom-tryon',
  name: '自定义换装',
  slots: [...],
  aiConfig: {...}
})

// 使用
const type = combinationRegistry.get('my-custom-tryon')
```

### 9.2 插槽模式

输入/输出插槽解耦了 AI 模型的接口定义：

- 同一个 AI 组合组件可以适配不同的 AI 模型
- 新增 AI 模型只需注册新的 `CombinationType`

### 9.3 变换中心点

所有形状变换以**中心点**为基准：

```typescript
const cx = shape.x + shape.width / 2   // 中心 X
const cy = shape.y + shape.height / 2  // 中心 Y
```

### 9.4 视口相对坐标

所有用户交互使用**屏幕坐标**，内部转换为**画布坐标**：

```typescript
const canvasPoint = screenToCanvas(e.clientX, e.clientY)
updateShape(id, { x: canvasPoint.x, y: canvasPoint.y })
```

---

## 十、快捷键参考

| 快捷键 | 功能 |
|--------|------|
| `V` | 选择工具 |
| `H` | 手型工具（平移） |
| `P` | 画笔工具 |
| `E` | 橡皮擦工具 |
| `A` | 箭头工具 |
| `T` | 文本工具 |
| `N` | 便签工具 |
| `I` | 图片工具 |
| `S` | 形状工具 |
| `C` | 服装工具 |
| `D` | 详情图工具 |
| `U` | 创建 AI 组合 |
| `Space` (按住) | 临时切换到手型工具 |
| `Delete` / `Backspace` | 删除选中形状 |
| `Ctrl/Cmd + C` | 复制 |
| `Ctrl/Cmd + V` | 粘贴 |
| `Ctrl/Cmd + D` | 复制一份 |
| `Ctrl/Cmd + Z` | 撤销 |
| `Ctrl/Cmd + Shift + Z` / `Ctrl/Cmd + Y` | 重做 |
| `Ctrl/Cmd + A` | 全选 |
| `Ctrl/Cmd + S` | 保存（触发自动保存） |
| `鼠标滚轮` | 垂直滚动 |
| `Shift + 鼠标滚轮` | 水平滚动 |
| `Ctrl/Cmd + 鼠标滚轮` | 缩放 |
| `Shift + 点击` | 多选 |

---

## 十一、扩展指南

### 11.1 添加新的 AI 组合类型

1. 在 `ai-combination/built-in-types.ts` 中注册：

```typescript
combinationRegistry.register({
  id: 'my-new-tryon',
  name: '新换装',
  description: '描述',
  slots: [
    { id: 'input1', name: '输入1', type: 'image', role: 'input' },
    { id: 'output1', name: '输出1', type: 'image', role: 'output' },
  ],
  aiConfig: {
    model: 'my-model',
    promptTemplate: '...',
    supportedResolutions: [...]
  }
})
```

2. 后端实现对应的 AI 生成逻辑

### 11.2 添加新的形状类型

1. 在 `shapes/types.ts` 中添加类型和最小尺寸：

```typescript
export type ShapeType = 'rect' | ... | 'my-shape'

export const SHAPE_MIN_SIZE: Record<ShapeType, { minWidth: number; minHeight: number }> = {
  'my-shape': { minWidth: 100, minHeight: 100 },
}
```

2. 在 `Shape.tsx` 的 `renderContent()` 中添加渲染逻辑

3. 在 `Toolbar.tsx` 中添加工具按钮

### 11.3 自定义 Logo 素材面板

编辑 `LogoMaterialPanel.tsx` 添加新的素材分类和素材。
