# @gke/canvas-sdk

一个简单易用的无限画布 SDK，支持自定义形状、事件系统和 React 集成。

## 特性

- 🎨 **无限画布** - 支持缩放、平移、自适应
- 📦 **Shape 系统** - 支持自定义形状注册和渲染
- ⚡ **事件系统** - 完整的事件订阅机制
- ⚛️ **React 集成** - 开箱即用的 React 组件和 Hooks
- 🔄 **历史管理** - 撤销/重做功能
- 📝 **TypeScript** - 完整的类型定义

## 安装

```bash
bun add @gke/canvas-sdk
# 或
npm install @gke/canvas-sdk
```

## 快速开始

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

### 创建形状

```tsx
// 创建矩形
editor.createShape('rectangle', {
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  fill: '#3b82f6',
  stroke: '#1d4ed8',
})

// 创建椭圆
editor.createShape('ellipse', {
  x: 400,
  y: 100,
  width: 150,
  height: 150,
  fill: '#ef4444',
})

// 创建文本
editor.createShape('text', {
  x: 100,
  y: 300,
  text: 'Hello World',
  fontSize: 24,
  color: '#000000',
})
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

// 注册自定义形状
editor.registerShape(new ClothingShapeUtil())
```

### 事件订阅

```tsx
// 订阅形状创建事件
editor.on('shape:create', (payload) => {
  console.log('Shape created:', payload.shape)
})

// 订阅选择变化
editor.on('selection:change', (payload) => {
  console.log('Selected:', payload.selectedIds)
})

// 订阅视口变化
editor.on('viewport:change', (payload) => {
  console.log('Viewport:', payload.viewport)
})
```

### React Hooks

```tsx
import { useEditor, useSelection, useViewport, EditorProvider } from '@gke/canvas-sdk'

function MyComponent() {
  const editor = useEditor()
  const { selectedIds, selectedShapes } = useSelection(editor)
  const viewport = useViewport(editor)
  
  return (
    <div>
      <p>Selected: {selectedIds.length} shapes</p>
      <p>Zoom: {viewport.zoom.toFixed(2)}x</p>
    </div>
  )
}

function App() {
  const editor = createEditor()
  
  return (
    <EditorProvider editor={editor}>
      <Canvas editor={editor} />
      <MyComponent />
    </EditorProvider>
  )
}
```

## API 参考

### Editor

Editor 是 SDK 的核心入口，提供统一的 API 接口。

#### 生命周期

- `mount(container: HTMLElement)` - 挂载到 DOM 容器
- `unmount()` - 卸载

#### 形状管理

- `createShape(type, props)` - 创建形状
- `updateShape(id, props)` - 更新形状
- `deleteShape(id)` - 删除形状
- `getShape(id)` - 获取单个形状
- `getShapes()` - 获取所有形状
- `getShapesByType(type)` - 按类型获取形状

#### 选择管理

- `select(ids)` - 选择形状
- `deselect(ids?)` - 取消选择
- `getSelectedShapes()` - 获取选中的形状
- `getSelectedIds()` - 获取选中的 ID

#### 视口管理

- `getViewport()` - 获取视口状态
- `setViewport(viewport)` - 设置视口状态
- `zoomIn()` - 放大
- `zoomOut()` - 缩小
- `zoomToFit()` - 自适应所有形状
- `zoomToShape(id)` - 聚焦指定形状
- `panTo(x, y)` - 平移到指定位置

#### 历史管理

- `undo()` - 撤销
- `redo()` - 重做
- `canUndo()` - 是否可撤销
- `canRedo()` - 是否可重做
- `clearHistory()` - 清空历史

#### 坐标转换

- `screenToCanvas(x, y)` - 屏幕坐标转画布坐标
- `canvasToScreen(x, y)` - 画布坐标转屏幕坐标

#### 导出

- `exportToJSON()` - 导出为 JSON
- `importFromJSON(json)` - 从 JSON 导入

#### 事件订阅

- `on(event, handler)` - 订阅事件，返回取消订阅函数
- `once(event, handler)` - 订阅一次性事件

#### 形状注册

- `registerShape(shapeUtil)` - 注册自定义形状
- `unregisterShape(type)` - 注销形状

### 内置形状

| 形状 | 类型 | 特有属性 |
|------|------|----------|
| Rectangle | `rectangle` | `fill`, `stroke`, `strokeWidth`, `borderRadius` |
| Ellipse | `ellipse` | `fill`, `stroke`, `strokeWidth` |
| Text | `text` | `text`, `fontSize`, `fontFamily`, `fontWeight`, `color`, `textAlign`, `verticalAlign` |
| Image | `image` | `src`, `objectFit`, `borderRadius` |
| Group | `group` | `childIds` |

### 事件类型

| 事件 | 负载 |
|------|------|
| `shape:create` | `{ shape }` |
| `shape:update` | `{ shape, prevProps }` |
| `shape:delete` | `{ shape }` |
| `selection:change` | `{ selectedIds }` |
| `viewport:change` | `{ viewport }` |
| `viewport:zoom` | `{ zoom }` |
| `viewport:pan` | `{ x, y }` |
| `history:undo` | `{}` |
| `history:redo` | `{}` |
| `history:push` | `{}` |

## 许可证

MIT
