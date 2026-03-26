# Joii 项目交接文档

## 项目概述

Joii 是一个基于纯 DOM 渲染的无限画布设计平台，使用 React 19 + TypeScript + Zustand 构建。项目代号 Joii 极客。

### 技术栈
- **前端框架**: React 19 + TypeScript
- **状态管理**: Zustand
- **样式**: Tailwind CSS + CSS Variables
- **构建工具**: Vite
- **图标**: Lucide React

---

## 项目结构

```
apps/ai_draw/client/src/
├── App.tsx                          # 主应用入口，布局控制
├── index.css                        # 全局样式，CSS 变量定义
├── canvas/
│   ├── Canvas.tsx                   # 画布核心组件
│   ├── store.ts                    # Zustand 状态管理
│   ├── components/
│   │   ├── LeftSidebar.tsx         # 左侧工具栏
│   │   ├── RightSidebar.tsx        # 右侧对话面板
│   │   ├── ZoomControls.tsx        # 缩放控制组件
│   │   └── Toolbar.tsx             # 顶部工具栏
│   └── shapes/
│       ├── Shape.tsx               # 形状渲染组件
│       └── types.ts                # 类型定义
└── lib/
    └── utils.ts                    # 工具函数（如 generateId）
```

---

## 核心功能实现状态

### 1. 画布系统 ✅ 完成

#### 画布渲染
- 基于纯 DOM 渲染，使用 CSS transform matrix 实现缩放和平移
- Viewport 状态管理（x, y, zoom）
- 支持滚轮缩放（Cmd/Ctrl + 滚轮）
- 支持空格键切换到手型工具拖动画布

#### 元素系统
- 支持形状类型: `rect`, `circle`, `text`, `note`, `image`, `arrow`, `draw`
- 每种形状有独立的渲染逻辑
- 统一的选中、拖拽、缩放、旋转接口

### 2. 选择系统 ✅ 完成

#### 单选
- 点击元素选中
- 显示选中边框和8个缩放手柄
- 4个角点 + 4个边中点
- 4个旋转手柄（带方向图标）

#### 多选
- Shift + 点击：添加/移除选中
- 鼠标框选：拖动创建选区，框内元素被选中
- 多选时显示统一的边界框
- 多选拖拽：同时移动所有选中元素

#### 旋转后边界框
- 使用 `getRotatedBoundingBox()` 函数计算旋转后的实际包围盒
- 动态调整边界框尺寸，正确包裹旋转后的元素

### 3. 变换操作 ✅ 完成

#### 拖拽
- 单选拖拽：Shape.tsx 中独立处理
- 多选拖拽：Canvas.tsx 中统一处理

#### 缩放
- 单选缩放：以选中元素中心为基准
- 多选缩放：以多选区域中心为基准，等比/非等比缩放
- 最小尺寸限制：每种形状有独立的 minWidth/minHeight

#### 旋转
- 单选旋转：围绕元素几何中心旋转
- 多选旋转：围绕多选区域几何中心统一旋转
- 旋转时更新位置和旋转角度

### 4. 图片上传 ✅ 完成

#### 点击上传
- 图片组件初始显示"点击上传图片"按钮
- 支持选择单个或多个图片
- 上传后替换原占位组件
- 保持原始宽高比（最大宽度400px）

#### 拖拽上传
- 支持拖拽图片文件到画布
- 在 drop 位置创建图片组件
- 从左向右自动排列（间距20px）

### 5. 复制粘贴 ✅ 完成

- `Cmd/Ctrl + C`: 复制选中元素到剪贴板
- `Cmd/Ctrl + V`: 粘贴（偏移20px，自动选中）
- `Cmd/Ctrl + D`: 快速复制（原地复制并偏移）
- `Cmd/Ctrl + A`: 全选
- `Cmd/Ctrl + Z`: 撤销
- `Cmd/Ctrl + Shift + Z`: 重做
- `Delete/Backspace`: 删除选中

### 6. 历史记录 ✅ 完成

- 基于 shapes 和 selectedIds 的快照
- 最多保存50条历史记录
- 拖拽、缩放、旋转、删除等操作后自动保存

### 7. UI 组件

#### LeftSidebar
- 工具选择：select, hand, pen, eraser, arrow, text, note, image, shape
- 当前工具高亮显示

#### RightSidebar
- 可折叠的对话面板
- Header 包含：标题、下拉历史、新建对话按钮、折叠按钮
- 消息列表区域
- 输入区域

#### ZoomControls
- [-] [100%] [+] 按钮
- 快捷键支持 Cmd +/- / 0
- 底部固定位置

---

## CSS 变量（用于 Dark Mode 适配）

```css
:root {
  --background: #ffffff;
  --foreground: #09090b;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #18181b;
  --border: #e4e4e7;
  --radius: 8px;
  --ring: #2563eb;
  --canvas-background: #f4f4f5;  /* 画布/侧边栏背景色 */
}
```

---

## 状态管理 (store.ts)

### 核心状态
```typescript
interface CanvasStore {
  shapes: ShapeProps[]           // 所有形状
  selectedIds: string[]           // 选中的形状 ID
  viewport: ViewportState        // { x, y, zoom }
  activeTool: ToolType           // 当前工具
  clipboard: ShapeProps[]        // 剪贴板
  isDragging: boolean            // 拖拽状态
  isResizing: boolean            // 缩放状态
  isRotating: boolean            // 旋转状态
}
```

### 关键方法
- `addShape()`: 添加形状
- `updateShape()`: 更新形状属性
- `deleteShape()`: 删除形状
- `setSelectedIds()`: 设置选中
- `addToSelection()`: 添加到选区
- `copySelectedShapes()`: 复制
- `pasteShapes()`: 粘贴
- `duplicateSelectedShapes()`: 快速复制
- `screenToCanvas()`: 屏幕坐标转画布坐标
- `canvasToScreen()`: 画布坐标转屏幕坐标

---

## 形状类型定义 (shapes/types.ts)

```typescript
export interface ShapeProps {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  text?: string
  imageUrl?: string
  points?: Array<{ x: number; y: number }>
}
```

---

## 最近修改记录

### 2026-03-25

#### 1. 多选旋转修复
- 问题：多选旋转时每个元素独立旋转
- 修复：实现围绕选择区域中心统一旋转，所有元素作为一个整体旋转
- 文件：Canvas.tsx

#### 2. 旋转后边界框计算
- 问题：旋转后的元素角点会超出边界框
- 修复：添加 `getRotatedBoundingBox()` 函数计算旋转后的轴对齐包围盒
- 文件：Canvas.tsx

#### 3. 图片上传功能
- 点击上传按钮选择单/多个图片
- 拖拽图片到画布上传
- 上传后替换原占位组件
- 保持原始比例，最大宽度400px
- 多个图片从左向右自动排列
- 文件：Shape.tsx, Canvas.tsx

#### 4. UI 优化
- 对话区域折叠按钮移至 header 右侧
- 全局 CSS 变量 `--canvas-background` 用于 dark mode 适配
- 移除旧的缩放控件

---

## 待优化/待实现功能

1. **文字编辑**：双击 text/note 进入编辑模式（已部分实现）
2. **铅笔工具**：自由绘制路径
3. **橡皮擦**：擦除功能
4. **图层层级**：元素上下层级调整
5. **对齐辅助**：元素对齐线
6. **Dark Mode**：完整暗色主题实现
7. **撤销/重做UI**：界面按钮支持

---

## 开发注意事项

### 坐标系统
- 画布使用 canvas 坐标系
- 屏幕使用 screen 坐标系
- 转换函数：`screenToCanvas()`, `canvasToScreen()`

### 事件处理
- 形状的 mousedown 使用 window 级 mousemove/mouseup 监听
- 避免事件穿透，使用 `e.stopPropagation()`
- Shape.tsx 中对已选中元素的点击不重置选区

### 缩放计算
- 屏幕坐标转 canvas: `(screenX - viewport.x) / viewport.zoom`
- canvas 转屏幕: `canvasX * viewport.zoom + viewport.x`

---

## 命令

```bash
cd apps/ai_draw/client

# 开发
bun run dev

# 构建
npm run build

# 类型检查
tsc --noEmit
```

---

## 关键文件快速索引

| 功能 | 文件 | 关键函数/组件 |
|------|------|--------------|
| 画布渲染 | Canvas.tsx | Canvas 组件 |
| 形状渲染 | shapes/Shape.tsx | Shape 组件, renderContent() |
| 状态管理 | store.ts | useCanvasStore |
| 选择系统 | Canvas.tsx | SelectionBoxLayer, SelectionBox |
| 旋转逻辑 | Canvas.tsx | handleMultiRotateStart, getRotatedBoundingBox |
| 图片上传 | shapes/Shape.tsx | images-uploaded 事件 |
| 拖放处理 | Canvas.tsx | onDrop handler |
| 布局 | App.tsx | 主布局组件 |
| 工具栏 | components/LeftSidebar.tsx | 工具选择 |
| 对话面板 | components/RightSidebar.tsx | 聊天UI |
| 缩放控制 | components/ZoomControls.tsx | 缩放按钮 |
