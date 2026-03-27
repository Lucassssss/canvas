# Joii 画布性能优化方案

## 文档信息

| 项目       | 内容                |
| -------- | ----------------- |
| **产品名称** | Joii - 无限画布智能设计平台 |
| **版本**   | v1.0.1            |
| **状态**   | 设计阶段              |
| **架构师**  | 数据架构设计            |
| **文档日期** | 2026-03-27        |

***

## 一、现有问题分析

### 1.1 当前实现的问题

查看 [Shape.tsx:L285-L296](file:///Users/lucas/workspace/workspace/ai/canvas/apps/ai_draw/src/canvas/shapes/Shape.tsx#L285-L296) 和 [Canvas.tsx:L1253-L1267](file:///Users/lucas/workspace/workspace/ai/canvas/apps/ai_draw/src/canvas/Canvas.tsx#L1253-L1267)，当前实现存在以下性能瓶颈：

#### 1.1.1 布局触发问题

```typescript
// Shape.tsx - 当前渲染方式
const style: React.CSSProperties = {
  left: shape.x,        // ❌ 触发重排
  top: shape.y,         // ❌ 触发重排
  width: shape.width,
  height: shape.height,
  transform: `rotate(${shape.rotation}deg)`, // ❌ 单独触发合成
  opacity: shape.opacity,
  // ...
}
```

**问题**：

- `left` / `top` 使用绝对定位坐标 → 每次修改触发浏览器**重排（reflow）**
- `transform: rotate()` 单独使用 → 旋转围绕元素左上角而非中心点旋转
- 移动/旋转/缩放分散在多个属性 → 每次操作触发多次重排+合成

#### 1.1.2 高频操作数据缓存写入问题

查看 [Shape.tsx:L70-L78](file:///Users/lucas/workspace/workspace/ai/canvas/apps/ai_draw/src/canvas/shapes/Shape.tsx#L70-L78) 和 [Canvas.tsx:L631-L639](file:///Users/lucas/workspace/workspace/ai/canvas/apps/ai_draw/src/canvas/Canvas.tsx#L631-L639)：

```typescript
// 拖拽时实时更新位置
const handleMouseMove = (moveEvent: MouseEvent) => {
  const dx = (moveEvent.clientX - dragStartRef.current.x) / viewport.zoom
  const dy = (moveEvent.clientY - dragStartRef.current.y) / viewport.zoom

  dragStartRef.current.shapePositions.forEach((pos, id) => {
    updateShape(id, { x: pos.x + dx, y: pos.y + dy })  // ❌ 每帧写入
  })
}
```

**问题**：

- 拖拽时 `mousemove` 以 60fps 触发 → 每帧调用 `updateShape`
- `updateShape` 直接修改 Zustand store → 触发 React 重渲染
- 缩放/旋转同理 → 短时间内大量状态写入
- 未对操作进行批量/防抖处理

#### 1.1.3 历史记录频繁写入

查看 [store.ts:L128-L135](file:///Users/lucas/workspace/workspace/ai/canvas/apps/ai_draw/src/canvas/store.ts#L128-L135)：

```typescript
updateShape: (id, props) => {
  set((state) => ({
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, ...props } : s
    ),
    isDirty: true
  }))
},  // ❌ 无防抖保护
```

`saveHistory()` 仅在 `mouseup` 时调用（这是正确的），但问题在于 **store 订阅者可能响应每次 updateShape 调用**。

***

## 二、优化目标：专业级画布工具

参考 Figma、Tldraw 等专业设计工具的实现：

| 指标       | 当前实现       | 优化目标     |
| -------- | ---------- | -------- |
| 60fps 拖拽 | 可能掉帧       | 稳定 60fps |
| 变换触发     | 重排+重绘      | 仅触发合成    |
| 缩放旋转中心   | 左上角        | 元素中心     |
| 高频操作     | 每帧写入 store | 防抖批量写入   |
| 内存占用     | 无优化        | 虚拟化渲染    |

***

## 三、Transform Matrix 优化方案

### 3.1 矩阵变换原理

使用 `transform: matrix(a,b,c,d,e,f)` 一次性表达所有变换：

```
matrix(a, b, c, d, e, f) = | a  c  e |
                           | b  d  f |
                           | 0  0  1 |

对应 2D 变换：
- 平移: matrix(1, 0, 0, 1, tx, ty)
- 旋转: matrix(cosθ, sinθ, -sinθ, cosθ, 0, 0)
- 缩放: matrix(sx, 0, 0, sy, 0, 0)
- 中心旋转: 需要结合平移

以元素中心为原点进行变换：
1. 平移到原点 (translate(-cx, -cy))
2. 应用旋转/缩放
3. 平移回原位 (translate(cx, cy))
4. 应用最终位置 (translate(x, y))
```

### 3.2 新数据结构设计

```typescript
// types/canvas/shapes-extended.ts

export interface TransformState {
  // 基础尺寸（不变）
  width: number
  height: number

  // 变换参数（解耦存储）
  x: number          // 中心点 X 坐标
  y: number          // 中心点 Y 坐标
  rotation: number    // 旋转角度（度）
  scaleX: number      // X 方向缩放
  scaleY: number      // Y 方向缩放

  // 缓存的计算属性
  _matrix?: Float32Array  // 缓存的矩阵值
  _matrixVersion?: number // 矩阵版本（用于检测失效）
}

export interface ShapePropsOptimized {
  id: string
  type: ShapeType

  // Transform
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number

  // Style
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number

  // Type-specific
  text?: string
  imageUrl?: string
  points?: Array<{ x: number; y: number }>
  // ...
}
```

### 3.3 矩阵计算工具

```typescript
// lib/canvas/transform.ts

export class TransformMatrix {
  private static DEG_TO_RAD = Math.PI / 180

  /**
   * 计算以中心点为原点的变换矩阵
   * 矩阵顺序: translate(x,y) * translate(-cx,-cy) * rotate * scale * translate(cx,cy)
   */
  static compose(
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number,
    scaleX: number = 1,
    scaleY: number = 1
  ): Float32Array {
    const cx = width / 2
    const cy = height / 2
    const rad = rotation * this.DEG_TO_RAD
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    // 缩放矩阵
    const a = cos * scaleX
    const b = sin * scaleX
    const c = -sin * scaleY
    const d = cos * scaleY

    // 平移分量 (考虑中心点偏移)
    // tx = x + cx - cx*cos*scaleX + cy*sin*scaleY
    // ty = y + cy - cx*sin*scaleX - cy*cos*scaleY
    const e = x + cx - cx * a - cy * c
    const f = y + cy - cx * b - cy * d

    return new Float32Array([a, b, c, d, e, f])
  }

  /**
   * 将矩阵转换为 CSS 字符串
   */
  static toCssString(matrix: Float32Array): string {
    return `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, ${matrix[4]}, ${matrix[5]})`
  }

  /**
   * 从矩阵中提取平移分量
   */
  static getTranslation(matrix: Float32Array): { x: number; y: number } {
    return { x: matrix[4], y: matrix[5] }
  }

  /**
   * 从矩阵中提取旋转角度
   */
  static getRotation(matrix: Float32Array): number {
    return Math.atan2(matrix[1], matrix[0]) * (180 / Math.PI)
  }

  /**
   * 增量更新矩阵（用于拖拽优化）
   */
  static translate(matrix: Float32Array, dx: number, dy: number): Float32Array {
    return new Float32Array([
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4] + dx,
      matrix[5] + dy,
    ])
  }

  /**
   * 增量旋转矩阵
   */
  static rotate(matrix: Float32Array, angle: number, cx: number, cy: number): Float32Array {
    const rad = angle * this.DEG_TO_RAD
    const cos = Math.cos(rad)
    const sin = Math.sin(rad)

    // 以 (cx, cy) 为中心旋转的变换矩阵
    const translateToCenter = new Float32Array([1, 0, 0, 1, -cx, -cy])
    const rotate = new Float32Array([cos, sin, -sin, cos, 0, 0])
    const translateBack = new Float32Array([1, 0, 0, 1, cx, cy])

    // 合并: T * R * T^-1 * M
    const result = this.multiply(this.multiply(translateBack, rotate), translateToCenter)
    return this.multiply(result, matrix)
  }

  /**
   * 矩阵乘法
   */
  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    return new Float32Array([
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5],
    ])
  }

  /**
   * 分解矩阵为独立变换参数
   */
  static decompose(matrix: Float32Array): {
    x: number; y: number;
    rotation: number;
    scaleX: number; scaleY: number;
  } {
    const a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3]
    const e = matrix[4], f = matrix[5]

    const scaleX = Math.sqrt(a * a + b * b)
    const scaleY = Math.sqrt(c * c + d * d)

    const rotation = Math.atan2(b, a) * (180 / Math.PI)

    return {
      x: e,
      y: f,
      rotation,
      scaleX,
      scaleY,
    }
  }
}
```

### 3.4 优化后的 Shape 组件

```typescript
// shapes/ShapeOptimized.tsx

import React, { useMemo, useRef, memo } from 'react'
import { TransformMatrix } from '@/lib/canvas/transform'

interface ShapeOptimizedProps {
  shape: ShapePropsOptimized
  isSelected: boolean
}

// 使用 memo 避免不必要的重渲染
export const ShapeOptimized: React.FC<ShapeOptimizedProps> = memo(({ shape, isSelected }) => {
  const elementRef = useRef<HTMLDivElement>(null)

  // 使用 useMemo 缓存矩阵计算结果
  const transformStyle = useMemo(() => {
    const matrix = TransformMatrix.compose(
      shape.x,
      shape.y,
      shape.width,
      shape.height,
      shape.rotation,
      shape.scaleX,
      shape.scaleY
    )
    return {
      transform: TransformMatrix.toCssString(matrix),
      width: shape.width,
      height: shape.height,
    }
  }, [shape.x, shape.y, shape.width, shape.height, shape.rotation, shape.scaleX, shape.scaleY])

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    ...transformStyle,
    opacity: shape.opacity,
    backgroundColor: shape.fill,
    border: `${shape.strokeWidth}px solid ${shape.stroke}`,
  }

  return (
    <div
      ref={elementRef}
      data-shape-id={shape.id}
      data-shape-type={shape.type}
      style={baseStyle}
    >
      {/* 内容渲染 */}
    </div>
  )
}, (prev, next) => {
  // 自定义比较函数：仅在变换相关属性变化时重渲染
  return (
    prev.shape.x === next.shape.x &&
    prev.shape.y === next.shape.y &&
    prev.shape.width === next.shape.width &&
    prev.shape.height === next.shape.height &&
    prev.shape.rotation === next.shape.rotation &&
    prev.shape.scaleX === next.shape.scaleX &&
    prev.shape.scaleY === next.shape.scaleY &&
    prev.shape.opacity === next.shape.opacity &&
    prev.isSelected === next.isSelected
  )
})
```

### 3.5 变换效果对比

**优化前**：

```html
<div style="
  position: absolute;
  left: 100px;           <!-- 重排 -->
  top: 200px;            <!-- 重排 -->
  width: 300px;
  height: 300px;
  transform: rotate(45deg);  <!-- 单独合成 -->
">
```

**优化后**：

```html
<div style="
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
  height: 300px;
  transform: matrix(0.707, 0.707, -0.707, 0.707, 100, 200);  <!-- 一次性合成 -->
">
```

**性能差异**：

- 优化前：修改位置触发 1 次重排 + 旋转触发 1 次合成 = 2 次
- 优化后：修改任何属性仅触发 1 次合成
- GPU 加速：transform 属性在 GPU 上执行，流畅 60fps

***

## 四、操作缓存与防抖策略

### 4.1 问题分析

当前高频操作（拖拽、缩放、旋转）的问题：

```
mousemove (60fps)
    ↓
updateShape() → setState() → React 重渲染 → 潜在的重排
    ↓
isDirty = true
    ↓
如果直接写存储或触发自动保存 → 大量磁盘 I/O
```

### 4.2 三层缓存架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        交互层 (60fps)                             │
│  mousemove / resize / rotate → 本地状态 → requestAnimationFrame    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      防抖缓冲层 (16ms)                           │
│  累积操作 → 批量更新 → 触发渲染                                     │
│  - 仅在动画/交互期间生效                                           │
│  - 交互结束自动flush                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Store 层 (正常频率)                          │
│  updateShape() → 响应式更新 → 渲染                                │
│  - 操作结束时统一保存历史记录                                       │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 操作缓冲区实现

```typescript
// lib/canvas/operation-buffer.ts

type OperationType = 'translate' | 'scale' | 'rotate' | 'style'

interface Operation {
  shapeId: string
  type: OperationType
  payload: Record<string, number | string>
  timestamp: number
}

interface BufferedUpdate {
  shapeId: string
  props: Partial<ShapePropsOptimized>
  timestamp: number
}

export class OperationBuffer {
  private buffer: Map<string, Partial<ShapePropsOptimized>> = new Map()
  private pendingOperations: Set<string> = new Set()
  private flushScheduled: boolean = false
  private onFlush: (updates: Map<string, Partial<ShapePropsOptimized>>) => void

  private readonly FLUSH_INTERVAL = 16 // ~60fps

  constructor(onFlush: (updates: Map<string, Partial<ShapePropsOptimized>>) => void) {
    this.onFlush = onFlush
  }

  /**
   * 记录操作（高频）
   */
  record(shapeId: string, props: Partial<ShapePropsOptimized>): void {
    this.pendingOperations.add(shapeId)

    const existing = this.buffer.get(shapeId) || {}
    this.buffer.set(shapeId, {
      ...existing,
      ...props,
      _lastUpdate: Date.now(),
    })

    this.scheduleFlush()
  }

  /**
   * 调度刷新
   */
  private scheduleFlush(): void {
    if (this.flushScheduled) return

    this.flushScheduled = true
    requestAnimationFrame(() => {
      this.flush()
    })
  }

  /**
   * 刷新缓冲区（将批量更新推送到 store）
   */
  flush(): void {
    if (this.buffer.size === 0) {
      this.flushScheduled = false
      return
    }

    // 批量更新
    this.onFlush(new Map(this.buffer))
    this.buffer.clear()
    this.pendingOperations.clear()
    this.flushScheduled = false
  }

  /**
   * 强制立即刷新（交互结束时调用）
   */
  forceFlush(): void {
    if (this.flushScheduled) {
      cancelAnimationFrame(this.flushScheduled as any)
    }
    this.flush()
  }

  /**
   * 获取当前是否有待处理的更新
   */
  hasPending(shapeId?: string): boolean {
    if (shapeId) {
      return this.pendingOperations.has(shapeId)
    }
    return this.buffer.size > 0
  }
}
```

### 4.4 增量变换更新

```typescript
// lib/canvas/incremental-transform.ts

interface TransformSnapshot {
  shapeId: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX: number
  scaleY: number
}

export class IncrementalTransform {
  private snapshots: Map<string, TransformSnapshot> = new Map()
  private deltaBuffer: Map<string, {
    dx: number
    dy: number
    dRotation: number
    dScaleX: number
    dScaleY: number
  }> = new Map()

  /**
   * 开始一个新的变换操作
   */
  beginTransform(shapeId: string, currentState: TransformSnapshot): void {
    this.snapshots.set(shapeId, { ...currentState })
    this.deltaBuffer.set(shapeId, {
      dx: 0, dy: 0,
      dRotation: 0,
      dScaleX: 0, dScaleY: 0,
    })
  }

  /**
   * 记录增量变化
   */
  recordDelta(
    shapeId: string,
    dx: number,
    dy: number,
    dRotation: number = 0,
    dScaleX: number = 1,
    dScaleY: number = 1
  ): void {
    const delta = this.deltaBuffer.get(shapeId)
    if (!delta) return

    delta.dx += dx
    delta.dy += dy
    delta.dRotation += dRotation
    delta.dScaleX *= dScaleX
    delta.dScaleY *= dScaleY
  }

  /**
   * 获取最终的变换值
   */
  getFinalTransform(shapeId: string): TransformSnapshot | null {
    const snapshot = this.snapshots.get(shapeId)
    const delta = this.deltaBuffer.get(shapeId)
    if (!snapshot || !delta) return null

    return {
      shapeId,
      x: snapshot.x + delta.dx,
      y: snapshot.y + delta.dy,
      width: snapshot.width * delta.dScaleX,
      height: snapshot.height * delta.dScaleY,
      rotation: snapshot.rotation + delta.dRotation,
      scaleX: snapshot.scaleX * delta.dScaleX,
      scaleY: snapshot.scaleY * delta.dScaleY,
    }
  }

  /**
   * 提交变换（清空缓存）
   */
  commit(shapeId: string): void {
    this.snapshots.delete(shapeId)
    this.deltaBuffer.delete(shapeId)
  }

  /**
   * 回滚到初始状态
   */
  rollback(shapeId: string): TransformSnapshot | null {
    const snapshot = this.snapshots.get(shapeId)
    this.commit(shapeId)
    return snapshot || null
  }
}
```

### 4.5 优化的 Store 更新

```typescript
// store/canvas-store-optimized.ts

import { create } from 'zustand'
import { OperationBuffer } from '@/lib/canvas/operation-buffer'
import { IncrementalTransform } from '@/lib/canvas/incremental-transform'

interface CanvasStoreOptimized {
  // ... 现有接口

  // 新增：操作缓冲区
  operationBuffer: OperationBuffer

  // 新增：增量变换
  incrementalTransform: IncrementalTransform

  // 批量更新（供缓冲区调用）
  batchUpdateShapes: (updates: Map<string, Partial<ShapePropsOptimized>>) => void

  // 开始/结束操作
  beginOperation: (shapeIds: string[]) => void
  endOperation: () => void
}

export const useCanvasStoreOptimized = create<CanvasStoreOptimized>()(
  (set, get) => {
    // 创建操作缓冲区
    const operationBuffer = new OperationBuffer((updates) => {
      get().batchUpdateShapes(updates)
    })

    // 创建增量变换管理器
    const incrementalTransform = new IncrementalTransform()

    return {
      operationBuffer,
      incrementalTransform,

      batchUpdateShapes: (updates) => {
        set((state) => ({
          shapes: state.shapes.map((shape) => {
            const update = updates.get(shape.id)
            if (update) {
              return { ...shape, ...update }
            }
            return shape
          }),
          isDirty: true,
        }))
      },

      beginOperation: (shapeIds) => {
        const shapes = get().shapes
        for (const id of shapeIds) {
          const shape = shapes.find((s) => s.id === id)
          if (shape) {
            incrementalTransform.beginTransform(id, {
              shapeId: id,
              x: shape.x,
              y: shape.y,
              width: shape.width,
              height: shape.height,
              rotation: shape.rotation,
              scaleX: shape.scaleX ?? 1,
              scaleY: shape.scaleY ?? 1,
            })
          }
        }
      },

      endOperation: () => {
        operationBuffer.forceFlush()
        get().saveHistory()  // 操作结束时保存历史
      },
    }
  }
)
```

### 4.6 Canvas 组件集成

```typescript
// Canvas.tsx - 优化后的交互处理

export const Canvas: React.FC = () => {
  const {
    updateShape,
    operationBuffer,
    incrementalTransform,
    beginOperation,
    endOperation,
  } = useCanvasStoreOptimized()

  // 拖拽开始
  const handleDragStart = useCallback((shapeIds: string[]) => {
    beginOperation(shapeIds)
  }, [beginOperation])

  // 拖拽中 - 使用缓冲区
  const handleDragMove = useCallback((dx: number, dy: number) => {
    const { selectedIds } = get()

    for (const id of selectedIds) {
      // 记录增量变换
      incrementalTransform.recordDelta(id, dx, dy)

      // 获取当前累积的变换值
      const transform = incrementalTransform.getFinalTransform(id)
      if (transform) {
        // 推送到缓冲区
        operationBuffer.record(id, {
          x: transform.x,
          y: transform.y,
        })
      }
    }
  }, [operationBuffer, incrementalTransform])

  // 拖拽结束
  const handleDragEnd = useCallback(() => {
    const { selectedIds } = get()

    // 提交所有变换
    for (const id of selectedIds) {
      incrementalTransform.commit(id)
    }

    // 强制刷新并保存历史
    endOperation()
  }, [endOperation, incrementalTransform])

  // 缩放开始
  const handleResizeStart = useCallback((shapeId: string, handle: string) => {
    beginOperation([shapeId])
  }, [beginOperation])

  // 缩放中
  const handleResizeMove = useCallback((dWidth: number, dHeight: number, dX: number, dY: number) => {
    const { selectedIds } = get()

    for (const id of selectedIds) {
      const transform = incrementalTransform.getFinalTransform(id)
      if (transform) {
        operationBuffer.record(id, {
          width: transform.width + dWidth,
          height: transform.height + dHeight,
          x: transform.x + dX / 2,
          y: transform.y + dY / 2,
        })
      }
    }
  }, [operationBuffer, incrementalTransform])

  // 旋转中
  const handleRotateMove = useCallback((dAngle: number) => {
    const { selectedIds } = get()

    for (const id of selectedIds) {
      incrementalTransform.recordDelta(id, 0, 0, dAngle)

      const transform = incrementalTransform.getFinalTransform(id)
      if (transform) {
        operationBuffer.record(id, {
          rotation: transform.rotation,
        })
      }
    }
  }, [operationBuffer, incrementalTransform])
}
```

***

## 五、批量历史记录优化

### 5.1 操作合并策略

对于连续的高频操作（如拖拽），仅在操作结束时记录一次历史：

```typescript
// 优化后的 saveHistory
saveHistory: (operationType?: OperationType, description?: string) => {
  const { shapes, selectedIds, history, historyIndex, isOperationInProgress } = get()

  // 如果有操作正在进行，延迟保存
  if (isOperationInProgress) {
    return
  }

  // ... 现有保存逻辑
}

setOperationInProgress: (inProgress: boolean) => set({ isOperationInProgress: inProgress })
```

### 5.2 操作类型标注

```typescript
// types/canvas/operations.ts

export type OperationType =
  | 'create'
  | 'delete'
  | 'translate'      // 移动（单次移动可能包含多个子操作）
  | 'scale'
  | 'rotate'
  | 'style'
  | 'content'
  | 'zorder'
  | 'batch'

export interface OperationRecord {
  id: string
  type: OperationType
  timestamp: number
  shapeIds: string[]
  description: string

  // 用于差异恢复
  before: Map<string, Partial<ShapeProps>>
  after: Map<string, Partial<ShapeProps>>
}
```

***

## 六、虚拟化渲染（可选优化）

对于大量形状的场景，使用虚拟化只渲染可见区域：

```typescript
// lib/canvas/virtualization.ts

interface ViewportBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export function getVisibleShapes(
  shapes: ShapeProps[],
  viewport: ViewportState,
  containerBounds: DOMRect
): ShapeProps[] {
  const viewBounds: ViewportBounds = {
    minX: -viewport.x / viewport.zoom,
    minY: -viewport.y / viewport.zoom,
    maxX: (containerBounds.width - viewport.x) / viewport.zoom,
    maxY: (containerBounds.height - viewport.y) / viewport.zoom,
  }

  return shapes.filter((shape) => {
    // 扩展形状边界（考虑旋转）
    const expandedBounds = getRotatedBoundingBox(
      shape.x, shape.y,
      shape.width, shape.height,
      shape.rotation
    )

    // AABB 碰撞检测
    return !(
      expandedBounds.maxX < viewBounds.minX ||
      expandedBounds.minX > viewBounds.maxX ||
      expandedBounds.maxY < viewBounds.minY ||
      expandedBounds.minY > viewBounds.maxY
    )
  })
}
```

***

## 七、实现计划

### 7.1 第一阶段：Transform Matrix 重构

| 序号 | 任务                                  | 优先级 | 改动范围          |
| -- | ----------------------------------- | --- | ------------- |
| 1  | 创建 `lib/canvas/transform.ts` 矩阵计算工具 | P0  | 新增文件          |
| 2  | 扩展 `ShapeProps` 类型添加 scaleX/scaleY  | P0  | 修改 types.ts   |
| 3  | 重构 `Shape.tsx` 使用 matrix transform  | P0  | 修改 Shape.tsx  |
| 4  | 重构 `Canvas.tsx` viewport transform  | P0  | 修改 Canvas.tsx |
| 5  | 测试验证 transform 正确性                  | P0  | 测试            |

### 7.2 第二阶段：操作缓存与防抖

| 序号 | 任务                                       | 优先级 | 改动范围          |
| -- | ---------------------------------------- | --- | ------------- |
| 1  | 创建 `lib/canvas/operation-buffer.ts`      | P1  | 新增文件          |
| 2  | 创建 `lib/canvas/incremental-transform.ts` | P1  | 新增文件          |
| 3  | 集成缓冲区到 Canvas.tsx 交互处理                   | P1  | 修改 Canvas.tsx |
| 4  | 优化 `updateShape` 支持批量更新                  | P1  | 修改 store.ts   |
| 5  | 添加操作状态标注                                 | P2  | 修改 store.ts   |

### 7.3 第三阶段：高级优化（可选）

| 序号 | 任务               | 优先级 | 改动范围 |
| -- | ---------------- | --- | ---- |
| 1  | 实现虚拟化渲染          | P2  | 新增文件 |
| 2  | 添加 Web Worker 计算 | P2  | 新增文件 |
| 3  | GPU 加速路径（WebGL）  | P3  | 新增文件 |

***

## 八、兼容性考虑

### 8.1 向后兼容

```typescript
// 数据迁移
function migrateShapeToMatrix(shape: ShapeProps): ShapePropsOptimized {
  return {
    ...shape,
    scaleX: 1,
    scaleY: 1,
  }
}

// 历史记录兼容
function restoreShapeFromMatrix(saved: ShapeProps): ShapeProps {
  const { scaleX, scaleY, ...rest } = saved as any
  return {
    ...rest,
    // scaleX/scaleY 被忽略，仅用于渲染优化
  }
}
```

### 8.2 浏览器支持

- matrix transform: IE9+, 所有现代浏览器
- requestAnimationFrame: IE10+, 所有现代浏览器
- 目标浏览器: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

***

## 九、验证指标

| 指标       | 验证方法                           |
| -------- | ------------------------------ |
| 60fps 拖拽 | Chrome DevTools Performance 面板 |
| 无重排      | Paint Flashing 工具验证            |
| 批量更新     | console.log + 时间戳分析            |
| 内存占用     | Chrome Memory Profiler         |

***

## 十、总结

本次优化通过以下核心技术手段达到专业级画布性能：

1. **Transform Matrix**: 将 left/top + rotate 改为单一 matrix 变换，触发 GPU 合成而非重排
2. **操作缓冲区**: 60fps 的交互操作先写入内存缓冲区，requestAnimationFrame 批量刷新
3. **增量变换**: 仅计算和传输变化的增量值，减少数据传输
4. **历史记录优化**: 操作过程中不保存历史，仅在操作结束时保存

优化后的渲染路径：

```
mousemove → 操作缓冲区 → requestAnimationFrame → 批量 updateShapes → React 重渲染
                                                                          ↓
                                                              仅 transform 样式更新
                                                                          ↓
                                                                    GPU 合成 (0 重排)
```

