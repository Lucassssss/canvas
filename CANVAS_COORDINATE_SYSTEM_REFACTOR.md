# 画布坐标系统重构方案

## 问题分析

### 当前存在的问题

1. **适合屏幕偏右下角**
   - 原因：侧边栏宽度计算不准确，硬编码为 `64 + 320`
   - 实际：右侧边栏可拖拽调整宽度（280-600px），且可关闭

2. **缩放中心点不在屏幕中间**
   - 原因：没有考虑右侧边栏的实际宽度和状态
   - 需要：动态获取右侧边栏的实际宽度

3. **新组件位置计算错误**
   - 当前逻辑：`getNextPosition()` 只找最后一行最右边的位置
   - 问题：不考虑换行，导致组件叠加或位置错误
   - 需要：智能换行，考虑可视区域宽度

4. **组件创建后可能不可见**
   - 原因：新组件位置可能超出可视区域
   - 需要：创建后自动聚焦到新组件

## 核心设计原则

### 1. 坐标系统定义

```
画布坐标系（Canvas Coordinates）：
- 无限制范围的逻辑坐标
- 单位：像素
- 原点：任意位置（通常第一个组件在 (100, 100)）

屏幕坐标系（Screen Coordinates）：
- 相对于浏览器窗口的像素坐标
- 单位：像素
- 原点：窗口左上角

视口变换（Viewport Transform）：
screenX = canvasX * zoom + viewportX
screenY = canvasY * zoom + viewportY
```

### 2. 可视区域计算

```typescript
interface ViewportDimensions {
  // 左侧工具栏宽度（固定）
  leftSidebarWidth: 64
  
  // 右侧面板宽度（动态）
  rightSidebarWidth: number // 0（关闭）或 280-600（打开且可拖拽）
  
  // 顶部和底部偏移（固定）
  topOffset: 56
  bottomOffset: 80
  
  // 可用画布区域
  availableWidth: window.innerWidth - leftSidebarWidth - rightSidebarWidth
  availableHeight: window.innerHeight - topOffset - bottomOffset
  
  // 可视区域中心（屏幕坐标）
  centerX: leftSidebarWidth + availableWidth / 2
  centerY: topOffset + availableHeight / 2
}
```

### 3. 新组件位置策略

```typescript
interface PositionStrategy {
  // 起始位置
  startX: 100
  startY: 100
  
  // 间距
  columnGap: 50
  rowGap: 80
  
  // 最大行宽（基于可视区域）
  maxRowWidth: availableWidth - 200 // 留出边距
  
  // 智能换行逻辑
  getNextPosition(width: number, height: number): {
    x: number
    y: number
    shouldFocus: boolean // 是否需要自动聚焦
  }
}
```

## 实现方案

### 阶段 1：创建视口尺寸管理器

创建 `apps/web/src/lib/canvas/viewport-manager.ts`：

```typescript
export class ViewportManager {
  private static instance: ViewportManager
  private rightSidebarWidth: number = 360
  private isRightSidebarOpen: boolean = true
  
  static getInstance(): ViewportManager {
    if (!ViewportManager.instance) {
      ViewportManager.instance = new ViewportManager()
    }
    return ViewportManager.instance
  }
  
  // 更新右侧边栏状态
  updateRightSidebar(width: number, isOpen: boolean): void
  
  // 获取可视区域尺寸
  getViewportDimensions(): ViewportDimensions
  
  // 获取可视区域中心（屏幕坐标）
  getScreenCenter(): { x: number; y: number }
  
  // 获取可用画布宽度（用于组件排列）
  getAvailableCanvasWidth(): number
}
```

### 阶段 2：改进组件位置计算

修改 `apps/web/src/app/canvas/components/Toolbar.tsx` 中的 `getNextPosition()`：

```typescript
function getNextPosition(width: number, height: number): {
  x: number
  y: number
} {
  const shapes = useCanvasStore.getState().shapes
  const viewportManager = ViewportManager.getInstance()
  const maxRowWidth = viewportManager.getAvailableCanvasWidth()
  
  if (shapes.length === 0) {
    return { x: START_X, y: START_Y }
  }
  
  // 按 Y 坐标分组，找到所有行
  const rows = groupShapesByRow(shapes, ROW_GAP)
  
  // 从最后一行开始尝试放置
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i]
    const rowY = row[0].y
    const rowMaxHeight = Math.max(...row.map(s => s.height))
    const rowRightmost = Math.max(...row.map(s => s.x + s.width))
    
    // 检查当前行是否还能放下新组件
    if (rowRightmost + COL_GAP + width <= maxRowWidth) {
      return {
        x: rowRightmost + COL_GAP,
        y: rowY
      }
    }
  }
  
  // 所有行都放不下，创建新行
  const lastRow = rows[rows.length - 1]
  const lastRowY = lastRow[0].y
  const lastRowMaxHeight = Math.max(...lastRow.map(s => s.height))
  
  return {
    x: START_X,
    y: lastRowY + lastRowMaxHeight + ROW_GAP
  }
}

function groupShapesByRow(shapes: ShapeProps[], rowGap: number): ShapeProps[][] {
  // 按 Y 坐标排序
  const sorted = [...shapes].sort((a, b) => a.y - b.y)
  const rows: ShapeProps[][] = []
  
  sorted.forEach(shape => {
    // 找到属于同一行的组（Y 坐标差距小于 rowGap）
    const row = rows.find(r => 
      Math.abs(r[0].y - shape.y) < rowGap
    )
    
    if (row) {
      row.push(shape)
    } else {
      rows.push([shape])
    }
  })
  
  // 每行内按 X 坐标排序
  rows.forEach(row => row.sort((a, b) => a.x - b.x))
  
  return rows
}
```

### 阶段 3：修复适合屏幕和缩放

修改 `apps/web/src/app/canvas/store.ts`：

```typescript
zoomToFit: () => {
  const { shapes } = get()
  if (shapes.length === 0) {
    set({ viewport: { x: 0, y: 0, zoom: 1 } })
    return
  }

  const viewportManager = ViewportManager.getInstance()
  const { availableWidth, availableHeight, centerX, centerY } = 
    viewportManager.getViewportDimensions()

  const minX = Math.min(...shapes.map((s) => s.x))
  const minY = Math.min(...shapes.map((s) => s.y))
  const maxX = Math.max(...shapes.map((s) => s.x + s.width))
  const maxY = Math.max(...shapes.map((s) => s.y + s.height))

  const padding = 50
  const contentWidth = maxX - minX + padding * 2
  const contentHeight = maxY - minY + padding * 2

  const zoom = Math.min(
    availableWidth / contentWidth,
    availableHeight / contentHeight,
    1
  )

  const contentCenterX = (minX + maxX) / 2
  const contentCenterY = (minY + maxY) / 2

  set({
    viewport: {
      x: centerX - contentCenterX * zoom,
      y: centerY - contentCenterY * zoom,
      zoom,
    },
  })
}
```

修改 Canvas.tsx 中的滚轮缩放：

```typescript
const wheelHandler = (e: WheelEvent) => {
  e.preventDefault()

  if (e.metaKey || e.ctrlKey) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(10, viewport.zoom * delta))

    const rect = container.getBoundingClientRect()
    const viewportManager = ViewportManager.getInstance()
    const { leftSidebarWidth } = viewportManager.getViewportDimensions()
    
    // 鼠标在可视区域内的坐标（考虑左侧边栏）
    const screenMouseX = e.clientX - rect.left - leftSidebarWidth
    const screenMouseY = e.clientY - rect.top

    // 鼠标在画布上的坐标
    const canvasX = (screenMouseX - viewport.x) / viewport.zoom
    const canvasY = (screenMouseY - viewport.y) / viewport.zoom

    setViewport({
      zoom: newZoom,
      x: screenMouseX - canvasX * newZoom,
      y: screenMouseY - canvasY * newZoom,
    })
  } else {
    setViewport({
      x: viewport.x - e.deltaX,
      y: viewport.y - e.deltaY,
    })
  }
}
```

### 阶段 4：集成到 RightSidebar

修改 `apps/web/src/app/canvas/components/RightSidebar.tsx`：

```typescript
import { ViewportManager } from '@/lib/canvas/viewport-manager'

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  // ... 现有代码 ...
  
  // 当宽度或打开状态变化时，通知 ViewportManager
  useEffect(() => {
    const viewportManager = ViewportManager.getInstance()
    viewportManager.updateRightSidebar(sidebarWidth, isOpen)
  }, [sidebarWidth, isOpen])
  
  // ... 现有代码 ...
}
```

### 阶段 5：自动聚焦新组件

修改 `createShape()` 和相关函数：

```typescript
function createShape(type: ToolType): void {
  const { addShape, setSelectedIds, focusOnArea } = useCanvasStore.getState()
  
  const size = SHAPE_SIZES[type] || { width: 200, height: 200 }
  const pos = getNextPosition(size.width, size.height)

  // ... 创建组件 ...

  setSelectedIds([newShape.id])
  
  // 自动聚焦到新组件（使用合适的缩放级别）
  focusOnArea(pos.x, pos.y, size.width, size.height, {
    padding: 100,
    maxZoom: 1 // 不放大，最多 1:1
  })
}
```

## 后续扩展考虑

### 1. 吸附和辅助线

```typescript
interface SnapGuide {
  type: 'vertical' | 'horizontal'
  position: number
  source: 'shape' | 'grid' | 'center'
}

class SnapManager {
  // 计算吸附点
  getSnapPoints(shape: ShapeProps, allShapes: ShapeProps[]): SnapGuide[]
  
  // 应用吸附
  applySnap(x: number, y: number, threshold: number): { x: number; y: number }
}
```

### 2. AI 创建组件

```typescript
interface AIComponentRequest {
  prompt: string
  position?: { x: number; y: number } // 可选，默认使用 getNextPosition
  size?: { width: number; height: number }
}

async function createComponentFromAI(request: AIComponentRequest): Promise<ShapeProps> {
  // 1. 调用 LLM 生成组件配置
  // 2. 使用 getNextPosition 或指定位置
  // 3. 创建组件
  // 4. 自动聚焦
}
```

### 3. 性能优化

- 使用虚拟化渲染（只渲染可视区域内的组件）
- 缓存视口尺寸计算结果
- 使用 requestAnimationFrame 优化拖拽和缩放

## 测试计划

### 单元测试

1. ViewportManager 的尺寸计算
2. getNextPosition 的换行逻辑
3. 坐标变换公式

### 集成测试

1. 创建多个组件，验证自动换行
2. 调整右侧边栏宽度，验证适合屏幕
3. 关闭/打开右侧边栏，验证缩放中心
4. 在不同窗口大小下测试

### 用户体验测试

1. 连续创建 20 个组件，验证排列整齐
2. 缩放和平移流畅性
3. 新组件始终可见
4. 适合屏幕功能准确

## 实施步骤

1. ✅ 创建 ViewportManager（核心基础设施）
2. ✅ 修改 RightSidebar 集成 ViewportManager
3. ✅ 修复 zoomToFit 和缩放逻辑
4. ✅ 改进 getNextPosition 换行逻辑
5. ✅ 添加自动聚焦功能
6. ✅ 测试和调优
7. 🔄 文档和注释

## 风险和注意事项

1. **向后兼容**：现有项目的组件位置不受影响
2. **性能**：ViewportManager 使用单例模式，避免重复计算
3. **边界情况**：窗口很小时的降级处理
4. **多显示器**：确保在不同分辨率下正常工作
