# Canvas 性能优化文档

本文档记录了 Canvas 画布组件的性能优化过程，重点解决拖动、缩放、辅助线等功能在操作时的卡顿问题。

***

## 核心原则

**避免在 mousemove/wheel 等高频事件中触发 React 状态更新**

原因：

- mousemove 事件每秒触发 60+ 次
- 每次 React state 更新都会触发组件重渲染
- 高频重渲染会导致严重的视觉卡顿和性能问题

***

## 优化一：组件拖动性能

### 用户确认节点

> "可以，真厉害，现在很丝滑了。"

### 问题描述

拖动组件时，每次 mousemove 都会触发状态更新，导致组件重渲染，造成明显卡顿。

### 问题代码

```tsx
// ❌ 错误示例
const [isMouseDragging, setIsMouseDragging] = useState(false)

const handleMouseMove = (moveEvent: MouseEvent) => {
  if (!isDraggingStartedRef.current) {
    isDraggingStartedRef.current = true
    state.setIsDragging(true)
    setIsMouseDragging(true)  // 触发重渲染！
  }

  // 更新位置
  updateShape(shape.id, { x: newX, y: newY })  // 触发重渲染！
}
```

### 优化方案

#### 1. 视觉更新使用 CSS transform

```tsx
const handleMouseMove = (moveEvent: MouseEvent) => {
  // 直接操作 DOM 的 transform，不触发 React 重渲染
  dragElementsRef.current.forEach((el, id) => {
    const matrix = TransformMatrix.compose(cx, cy, width, height, rotation, scaleX, scaleY)
    el.style.transform = TransformMatrix.toCssString(matrix)
  })
}
```

#### 2. 状态追踪使用 ref 而非 state

```tsx
// ✅ 正确：使用 ref
const isMouseDraggingRef = useRef(false)

const handleMouseMove = (moveEvent: MouseEvent) => {
  if (!isDraggingStartedRef.current) {
    isDraggingStartedRef.current = true
    state.setIsDragging(true)
    isMouseDraggingRef.current = true
    elementRef.current?.classList.add('dragging')  // 直接操作 DOM class
  }
}
```

#### 3. 批量更新在 mouseUp 时执行

```tsx
const handleMouseUp = () => {
  // 拖动结束后一次性更新所有组件位置
  if (updates.length > 0) {
    state.batchUpdateShapes(updates)
  }
  state.saveHistory()
  state.scheduleAutoSave()
}
```

### 关键文件

- `apps/web/src/app/canvas/shapes/Shape.tsx`

***

## 优化二：画布拖动性能

### 用户确认节点

> "真棒，移动现在非常丝滑了"

### 问题描述

画布拖动时，每次 mousemove 调用 `setViewport({ x, y })`，导致所有订阅 viewport 的组件重渲染。

### 问题代码

```tsx
// ❌ 错误示例
const handleMouseMove = (e: React.MouseEvent) => {
  const newX = viewport.x + dx
  const newY = viewport.y + dy
  setViewport({ x: newX, y: newY })  // 每帧都触发重渲染！
}
```

### 优化方案

#### 使用 RAF 节流 + CSS transform

```tsx
const viewportRafRef = useRef<number | null>(null)
const pendingViewportRef = useRef<{ x: number; y: number } | null>(null)
const viewportRef = useRef<HTMLDivElement>(null)

const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDragging) return

  if (viewportDragStartRef.current) {
    const { x, y, viewportX, viewportY } = viewportDragStartRef.current
    const dx = e.clientX - x
    const dy = e.clientY - y
    const newX = viewportX + dx
    const newY = viewportY + dy

    // 存储待更新位置
    pendingViewportRef.current = { x: newX, y: newY }
    
    // RAF 节流：最多每帧更新一次 DOM
    if (viewportRafRef.current === null) {
      viewportRafRef.current = requestAnimationFrame(() => {
        viewportRafRef.current = null
        if (pendingViewportRef.current && viewportRef.current) {
          // 直接操作 DOM，不触发 React 重渲染
          viewportRef.current.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${x}, ${y})`
        }
      })
    }
  }
}

const handleMouseUp = () => {
  // 拖动结束后一次性更新 state
  if (pendingViewportRef.current) {
    setViewport(pendingViewportRef.current)
  }
}
```

### 关键文件

- `apps/web/src/app/canvas/Canvas.tsx`

***

## 优化三：画布缩放性能

### 用户确认节点

> "非常丝滑了！"

### 问题描述

缩放时每次 wheel 事件调用 `setViewport({ zoom })`，导致重渲染。

### 优化方案

#### 与画布拖动相同的模式

```tsx
const wheelRafRef = useRef<number | null>(null)
const pendingWheelRef = useRef<{ zoom: number; x: number; y: number } | null>(null)

const wheelHandler = (e: WheelEvent) => {
  e.preventDefault()

  if (e.metaKey || e.ctrlKey) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const currentZoom = pendingWheelRef.current?.zoom ?? viewport.zoom
    const currentX = pendingWheelRef.current?.x ?? viewport.x
    const currentY = pendingWheelRef.current?.y ?? viewport.y
    const newZoom = Math.max(0.1, Math.min(10, currentZoom * delta))

    // 计算以鼠标为中心缩放的新位置
    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const canvasX = (mouseX - currentX) / currentZoom
    const canvasY = (mouseY - currentY) / currentZoom

    const newX = mouseX - canvasX * newZoom
    const newY = mouseY - canvasY * newZoom

    pendingWheelRef.current = { zoom: newZoom, x: newX, y: newY }

    // RAF 节流
    if (wheelRafRef.current === null) {
      wheelRafRef.current = requestAnimationFrame(() => {
        wheelRafRef.current = null
        if (pendingWheelRef.current && viewportRef.current) {
          const { zoom, x, y } = pendingWheelRef.current
          viewportRef.current.style.transform = `matrix(${zoom}, 0, 0, ${zoom}, ${x}, ${y})`
        }
      })
    }
  }
}
```

### 关键文件

- `apps/web/src/app/canvas/Canvas.tsx`

***

## 优化四：辅助线渲染性能

### 用户确认节点

> "不错，丝滑了"

### 问题描述

辅助线用 React 组件渲染，每次位置变化都触发重渲染，且辅助线计算在每次 mousemove 都执行。

### 优化方案

#### 1. 使用模块级变量存储数据

```tsx
// alignmentGuides.ts
let guidesData: AlignmentGuide[] = []
let viewportData = { x: 0, y: 0, zoom: 1 }

export function updateGuidesData(guides: AlignmentGuide[], viewport: { x: number; y: number; zoom: number }) {
  guidesData = guides
  viewportData = viewport
}
```

#### 2. 直接 DOM 操作渲染辅助线

```tsx
// AlignmentGuides.tsx
export const AlignmentGuides: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let rafId: number | null = null
    let lastGuidesLength = 0

    const renderGuides = () => {
      rafId = null

      if (guidesData.length === 0) {
        if (lastGuidesLength > 0) {
          container.innerHTML = ''
          lastGuidesLength = 0
        }
        return
      }

      // 使用 DocumentFragment 批量创建 DOM
      const fragment = document.createDocumentFragment()

      for (let i = 0; i < guidesData.length; i++) {
        const guide = guidesData[i]
        const el = document.createElement('div')
        el.className = 'pointer-events-none absolute'
        el.style.backgroundColor = GUIDE_COLOR

        if (guide.type === 'vertical') {
          const screenX = guide.targetPosition * viewportData.zoom + viewportData.x
          const screenStart = guide.start * viewportData.zoom + viewportData.y
          const screenEnd = guide.end * viewportData.zoom + viewportData.y

          el.style.left = `${screenX}px`
          el.style.top = `${screenStart}px`
          el.style.width = `${GUIDE_THICKNESS}px`
          el.style.height = `${screenEnd - screenStart}px`
        } else {
          // horizontal guide...
        }

        fragment.appendChild(el)
      }

      container.innerHTML = ''
      container.appendChild(fragment)
      lastGuidesLength = guidesData.length
    }

    const intervalId = setInterval(scheduleRender, 16)

    return () => {
      clearInterval(intervalId)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-50" />
}
```

#### 3. 辅助线计算放入 RAF 节流

```tsx
// Shape.tsx
const handleMouseMove = (moveEvent: MouseEvent) => {
  // ... 视觉更新 ...

  pendingAlignmentRef.current = { dx, dy }
  
  // 辅助线计算放入 RAF，避免每帧都计算
  if (alignmentRafRef.current === null) {
    alignmentRafRef.current = requestAnimationFrame(() => {
      alignmentRafRef.current = null
      if (!pendingAlignmentRef.current || !dragStartRef.current) return

      const { dx: pdx, dy: pdy } = pendingAlignmentRef.current
      const draggedShapes: ShapeProps[] = []
      // ... 构建拖动的 shape 数据 ...

      if (draggedShapes.length > 0) {
        const guides = calculateAlignmentGuides(draggedShapes, state.shapes, draggedShapeIds)
        updateGuidesData(guides, state.viewport)
        
        // 吸附逻辑...
      }
    })
  }
}
```

### 关键文件

- `apps/web/src/app/canvas/utils/alignmentGuides.ts`
- `apps/web/src/app/canvas/components/AlignmentGuides.tsx`
- `apps/web/src/app/canvas/shapes/Shape.tsx`

***

## 优化五：图片组件拖动性能

### 用户确认节点

> "很棒，丝滑了"

### 问题描述

图片组件拖动时比其他组件卡顿，原因是：

1. `isMouseDragging` 是 React state，拖动开始时触发重渲染
2. `setDropTarget()` 触发 store 更新，导致 CustomCombination 组件重渲染

### 优化方案

#### 1. 将 isMouseDragging 改为 ref

```tsx
// ❌ 错误
const [isMouseDragging, setIsMouseDragging] = useState(false)

// ✅ 正确
const isMouseDraggingRef = useRef(false)

const handleMouseMove = (moveEvent: MouseEvent) => {
  if (!isDraggingStartedRef.current) {
    isDraggingStartedRef.current = true
    state.setIsDragging(true)
    isMouseDraggingRef.current = true
    elementRef.current?.classList.add('dragging')  // 直接操作 DOM
  }
}
```

#### 2. 拖放目标反馈使用直接 DOM 操作

```tsx
// dropTargetManager.ts
let currentDropTarget: DropTargetData | null = null

export function updateDropTarget(target: DropTargetData | null): void {
  const previousTarget = currentDropTarget
  currentDropTarget = target

  // 直接操作 DOM class，不触发 React 重渲染
  if (previousTarget) {
    const prevEl = document.querySelector(
      `[data-combination-shape-id="${previousTarget.combinationShapeId}"][data-slot-id="${previousTarget.slotId}"]`
    )
    prevEl?.classList.remove('drop-target-active')
  }

  if (target) {
    const newEl = document.querySelector(
      `[data-combination-shape-id="${target.combinationShapeId}"][data-slot-id="${target.slotId}"]`
    )
    newEl?.classList.add('drop-target-active')
  }
}
```

#### 3. 拖放检测放入 RAF 节流

```tsx
const handleMouseMove = (moveEvent: MouseEvent) => {
  // ... 视觉更新 ...

  pendingAlignmentRef.current = { dx, dy, clientX: moveEvent.clientX, clientY: moveEvent.clientY }
  
  if (alignmentRafRef.current === null) {
    alignmentRafRef.current = requestAnimationFrame(() => {
      alignmentRafRef.current = null
      
      const { dx: pdx, dy: pdy, clientX, clientY } = pendingAlignmentRef.current
      const draggedShapeIds = Array.from(dragElementsRef.current.keys())

      // 拖放检测放入 RAF
      if (isImageDragRef.current) {
        const dropTarget = detectDropTarget(clientX, clientY, state.shapes, draggedShapeIds)
        updateDropTarget(dropTarget)  // 直接 DOM 操作
      }

      // 辅助线计算...
    })
  }
}
```

### 关键文件

- `apps/web/src/app/canvas/shapes/Shape.tsx`
- `apps/web/src/app/canvas/utils/dropTargetManager.ts`
- `apps/web/src/app/canvas/utils/dropZone.ts`
- `apps/web/src/app/canvas/shapes/CustomCombination.tsx`

***

## 优化总结表

| 优化项  | 问题                         | 解决方案                                | 用户确认           |
| ---- | -------------------------- | ----------------------------------- | -------------- |
| 组件拖动 | `isDragging` state 更新触发重渲染 | ref + DOM classList + CSS transform | ✅ "真厉害，现在很丝滑了" |
| 画布拖动 | `setViewport` 每帧调用         | RAF 节流 + CSS transform              | ✅ "移动现在非常丝滑了"  |
| 画布缩放 | `setViewport` 每帧调用         | RAF 节流 + CSS transform              | ✅ "非常丝滑了！"     |
| 辅助线  | React 组件渲染 + 每帧计算          | 模块变量 + 直接 DOM 操作 + RAF 节流           | ✅ "不错，丝滑了"     |
| 图片拖动 | state 更新 + store 更新        | ref + 直接 DOM 操作 + RAF 节流            | ✅ "很棒，丝滑了"     |

***

## 核心优化模式

```
┌─────────────────────────────────────────────────────────────┐
│                  mousemove 高频事件                          │
│                    (每秒 60+ 次)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         存储到 ref / module 变量（无重渲染）                  │
│   pendingRef.current = { dx, dy, clientX, clientY }         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              RAF 节流（最多每帧执行一次）                     │
│   if (rafRef.current === null) {                            │
│     rafRef.current = requestAnimationFrame(() => {          │
│       rafRef.current = null                                 │
│       // 执行计算和 DOM 操作                                 │
│     })                                                      │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           CSS transform / DOM 操作（视觉更新）               │
│   el.style.transform = TransformMatrix.toCssString(matrix)  │
│   el.classList.add('dragging')                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         mouseUp → 一次性更新 React state（数据同步）         │
│   batchUpdateShapes(updates)                                │
│   setViewport(pendingViewportRef.current)                   │
│   saveHistory()                                             │
└─────────────────────────────────────────────────────────────┘
```

***

## 关键要点

### 1. 视觉更新和数据更新分离

- **视觉更新**：使用 CSS transform 和 DOM 操作，不触发 React 重渲染
- **数据更新**：在操作结束后（mouseUp）一次性更新 React state

### 2. RAF 节流

- 使用 `requestAnimationFrame` 将高频事件中的计算和 DOM 操作限制在每帧一次
- 避免重复执行昂贵的操作（如 DOM 查询、辅助线计算）

### 3. ref 替代 state

- 在拖动过程中需要追踪的状态使用 `useRef` 而非 `useState`
- 避免触发组件重渲染

### 4. 模块级变量

- 对于跨组件共享的临时数据（如辅助线数据、拖放目标），使用模块级变量
- 配合直接 DOM 操作，完全避免 React 重渲染

### 5. 批量更新

- 将多次 state 更新合并为一次
- 使用 `batchUpdateShapes` 等方法减少重渲染次数

***

## 相关文件清单

```
apps/web/src/app/canvas/
├── Canvas.tsx                    # 画布拖动、缩放优化
├── shapes/
│   ├── Shape.tsx                 # 组件拖动优化
│   └── CustomCombination.tsx     # 拖放目标组件
├── components/
│   └── AlignmentGuides.tsx       # 辅助线渲染优化
├── utils/
│   ├── alignmentGuides.ts        # 辅助线计算
│   ├── dropZone.ts               # 拖放区域检测
│   └── dropTargetManager.ts      # 拖放目标管理
└── store.ts                      # 状态管理

apps/web/src/app/
└── globals.css                   # 拖放反馈样式
```

***

## 参考资料

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [CSS transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

