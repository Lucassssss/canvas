# 画布拖拽性能优化计划

## 优化背景

通过 Chrome 性能分析，发现画布元素拖拽时出现严重卡顿（MouseMove 事件处理耗时 265ms，MouseDown 耗时 245ms）。主要原因是：

1. **每次 updateShape 都触发 scheduleAutoSave** - 导致频繁的状态更新和渲染
2. **高频事件触发的 React 重渲染** - mousemove 每秒可能触发 60+ 次
3. **handleMouseDown 依赖项过多** - 容易导致回调重新创建

***

## 优化步骤（按优先级排序）

### ✅ 优化 1：移除 updateShape 中的 scheduleAutoSave 调用（优先级：最高）✅ **已完成**

**文件**：

* `apps/web/src/app/canvas/store.ts`

* `apps/web/src/app/canvas/shapes/Shape.tsx`

* `apps/web/src/app/canvas/Canvas.tsx`

**修改内容**：

1. **store.ts**：移除 `updateShape` 中的 `get().scheduleAutoSave()` 调用
2. **Shape.tsx**：在 `handleMouseUp` 中添加 `scheduleAutoSave()` 调用，确保拖拽结束时触发自动保存
3. **Canvas.tsx**：在 `handleMouseUp` 中添加 `scheduleAutoSave()` 调用，确保所有交互结束时触发自动保存

**预期效果**：

* 减少每次拖动时的定时器创建

* 降低 React 状态更新频率

* 预计可将 MouseMove 事件处理时间从 265ms 降低到 50ms 以内

### 🔲 优化 2：拖拽期间禁用 scheduleAutoSave（优先级：高）

**文件**：`apps/web/src/app/canvas/store.ts` 和 `apps/web/src/app/canvas/shapes/Shape.tsx`
**问题**：拖拽过程中不应该触发自动保存
**解决方案**：

* 在 Shape 组件拖拽开始时设置 `isDragging` 状态

* 在 store 中检查 isDragging 状态，如果正在拖拽则跳过 scheduleAutoSave

* 拖拽结束后（mouseup）再触发一次自动保存

### 🔲 优化 3：减少 handleMouseDown 的依赖项（优先级：中）

**文件**：`apps/web/src/app/canvas/shapes/Shape.tsx`
**问题**：useCallback 的依赖项过多，导致回调频繁重新创建
**解决方案**：

* 使用 `useCanvasStore.getState()` 替代部分依赖项

* 将不常变化的依赖（如 updateShape, setSelectedIds）移出依赖数组

### ✅ 优化 4：使用 RAF 节流 mousemove 事件（优先级：高）✅ **已完成**
**文件**：
- `apps/web/src/app/canvas/shapes/Shape.tsx`
- `apps/web/src/app/canvas/Canvas.tsx`

**修改内容**：
1. **Shape.tsx**：
   - 添加 `rafIdRef` 和 `latestMoveEventRef` 来追踪 RAF 和最新事件
   - 在 `handleMouseMove` 中只更新最新事件和调度 RAF
   - 在 `processMouseMove` (RAF 回调) 中执行状态更新
   - 在 `handleMouseUp` 中，如果有待处理的 RAF，先执行它再清理

2. **Canvas.tsx**：
   - 添加 `rafIdRef`、`pendingShapeUpdatesRef` 和 `latestMouseEventRef`
   - 创建 `processShapeUpdates` 函数来批量执行待处理的形状更新
   - 在所有涉及 `updateShape` 的操作（拖拽、缩放、旋转）中应用 RAF 节流
   - 在 `handleMouseUp` 中应用待处理的更新

**预期效果**：
- 将 mousemove 事件从每秒 60+ 次降低到每秒 30-60 次（与屏幕刷新率同步）
- 大幅减少 React 渲染次数
- 预计可将 MouseMove 事件处理时间从 265ms 降低到 16ms 以内（单帧时间）

### 🔲 优化 5：考虑使用 CSS transform 替代状态更新（优先级：低）

**文件**：`apps/web/src/app/canvas/shapes/Shape.tsx`
**问题**：拖拽时每次都更新 React 状态和 DOM
**解决方案**：

* 考虑使用 CSS transform: translate() 进行视觉移动

* 仅在拖拽结束时更新实际位置
  **注意**：此优化需要较大改动，建议最后考虑

***

## 当前状态

**待执行**：优化 1 - 移除 updateShape 中的 scheduleAutoSave 调用

***

## 优化 1 详细方案

### 修改位置

文件：`apps/web/src/app/canvas/store.ts`

### 具体修改

1. 找到 `updateShape` 方法（约在第 169-178 行）
2. 移除其中的 `get().scheduleAutoSave()` 调用
3. 确保自动保存仅在交互结束时触发

### 修改前

```typescript
updateShape: (id, props) => {
  const roundedProps = roundProps(props)
  set((state) => ({
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, ...roundedProps } : s
    ),
    isDirty: true
  }))
  get().scheduleAutoSave()  // ← 删除此行
},
```

### 修改后

```typescript
updateShape: (id, props) => {
  const roundedProps = roundProps(props)
  set((state) => ({
    shapes: state.shapes.map((s) =>
      s.id === id ? { ...s, ...roundedProps } : s
    ),
    isDirty: true
  }))
  // 移除自动保存调用，仅在 mouseup 时触发
},
```

### 预期效果

* 减少每次拖动时的定时器创建

* 降低 React 状态更新频率

* 预计可将 MouseMove 事件处理时间从 265ms 降低到 50ms 以内

