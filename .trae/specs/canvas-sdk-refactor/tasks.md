# Tasks

## Phase 1: 项目初始化与基础设施

- [x] Task 1: 创建 SDK 包结构
  - [x] SubTask 1.1: 创建 `packages/canvas-sdk` 目录结构
  - [x] SubTask 1.2: 配置 `package.json`（使用 Bun）
  - [x] SubTask 1.3: 配置 `tsconfig.json`（严格模式）
  - [x] SubTask 1.4: 配置构建脚本（ESM + CJS）
  - [x] SubTask 1.5: 创建入口文件 `src/index.ts`

- [x] Task 2: 实现基础原语模块
  - [x] SubTask 2.1: 实现 `Vec` 向量类（加减乘除、点积、叉积、归一化）
  - [x] SubTask 2.2: 实现 `Box` 盒子类（边界计算、相交判断、合并）
  - [x] SubTask 2.3: 实现 `Matrix` 矩阵类（2D 变换、缩放、旋转、平移）
  - [ ] SubTask 2.4: 编写单元测试

- [x] Task 3: 实现工具函数
  - [x] SubTask 3.1: 实现 ID 生成器 `generateId()`
  - [x] SubTask 3.2: 实现几何计算函数（点是否在矩形内、边界框计算等）
  - [x] SubTask 3.3: 实现 DOM 操作工具（获取元素位置、事件坐标转换）

## Phase 2: 核心状态管理

- [x] Task 4: 实现状态存储
  - [x] SubTask 4.1: 定义核心状态类型（shapes、selectedIds、viewport）
  - [x] SubTask 4.2: 实现 Store 类（基于 Zustand）
  - [x] SubTask 4.3: 实现状态订阅机制
  - [x] SubTask 4.4: 实现批量更新支持

- [x] Task 5: 实现历史管理
  - [x] SubTask 5.1: 定义 HistoryEntry 类型
  - [x] SubTask 5.2: 实现 HistoryManager 类
  - [x] SubTask 5.3: 实现 undo/redo 逻辑
  - [x] SubTask 5.4: 实现历史记录限制（默认 50 条）

## Phase 3: Editor 核心类

- [x] Task 6: 实现 Editor 基础结构
  - [x] SubTask 6.1: 定义 Editor 接口类型
  - [x] SubTask 6.2: 实现 Editor 构造函数和配置选项
  - [x] SubTask 6.3: 实现 mount/unmount 生命周期
  - [x] SubTask 6.4: 集成 Store 和 HistoryManager

- [x] Task 7: 实现形状管理 API
  - [x] SubTask 7.1: 实现 `createShape()` 方法
  - [x] SubTask 7.2: 实现 `updateShape()` 方法
  - [x] SubTask 7.3: 实现 `deleteShape()` 方法
  - [x] SubTask 7.4: 实现 `getShape()` 和 `getShapes()` 方法
  - [x] SubTask 7.5: 实现 `getShapesByType()` 方法

- [x] Task 8: 实现选择管理 API
  - [x] SubTask 8.1: 实现 `select()` 方法
  - [x] SubTask 8.2: 实现 `deselect()` 方法
  - [x] SubTask 8.3: 实现 `getSelectedShapes()` 方法
  - [x] SubTask 8.4: 实现 `getSelectedIds()` 方法

- [x] Task 9: 实现视口管理 API
  - [x] SubTask 9.1: 实现 `getViewport()` 和 `setViewport()` 方法
  - [x] SubTask 9.2: 实现 `zoomIn()` 和 `zoomOut()` 方法
  - [x] SubTask 9.3: 实现 `zoomToFit()` 方法
  - [x] SubTask 9.4: 实现 `zoomToShape()` 方法
  - [x] SubTask 9.5: 实现 `panTo()` 方法
  - [x] SubTask 9.6: 实现坐标转换方法 `screenToCanvas()` 和 `canvasToScreen()`

## Phase 4: 事件系统

- [x] Task 10: 实现事件发射器
  - [x] SubTask 10.1: 定义 EditorEvents 类型
  - [x] SubTask 10.2: 实现 EventEmitter 类
  - [x] SubTask 10.3: 实现 `on()` 和 `off()` 方法
  - [x] SubTask 10.4: 实现 `once()` 方法
  - [x] SubTask 10.5: 在 Editor 中集成事件触发

- [x] Task 11: 实现核心事件触发
  - [x] SubTask 11.1: 在形状操作中触发 shape:* 事件
  - [x] SubTask 11.2: 在选择变化时触发 selection:change 事件
  - [x] SubTask 11.3: 在视口变化时触发 viewport:* 事件
  - [x] SubTask 11.4: 在历史操作时触发 history:* 事件

## Phase 5: Shape 系统

- [x] Task 12: 实现 ShapeUtil 基类
  - [x] SubTask 12.1: 定义 ShapeUtil 接口
  - [x] SubTask 12.2: 定义 ShapeProps 基础类型
  - [x] SubTask 12.3: 定义 ShapeRenderContext 类型

- [x] Task 13: 实现形状注册表
  - [x] SubTask 13.1: 实现 ShapeRegistry 类
  - [x] SubTask 13.2: 实现 `registerShape()` 方法
  - [x] SubTask 13.3: 实现 `unregisterShape()` 方法
  - [x] SubTask 13.4: 实现 `getShapeUtil()` 方法

- [x] Task 14: 实现内置形状
  - [x] SubTask 14.1: 实现 RectangleShapeUtil
  - [x] SubTask 14.2: 实现 EllipseShapeUtil
  - [x] SubTask 14.3: 实现 TextShapeUtil
  - [x] SubTask 14.4: 实现 ImageShapeUtil
  - [x] SubTask 14.5: 实现 GroupShapeUtil

## Phase 6: React 集成

- [x] Task 15: 实现 React Context
  - [x] SubTask 15.1: 创建 EditorContext
  - [x] SubTask 15.2: 实现 EditorProvider 组件

- [x] Task 16: 实现 React Hooks
  - [x] SubTask 16.1: 实现 `useEditor()` Hook
  - [x] SubTask 16.2: 实现 `useShape()` Hook
  - [x] SubTask 16.3: 实现 `useShapes()` Hook
  - [x] SubTask 16.4: 实现 `useSelection()` Hook
  - [x] SubTask 16.5: 实现 `useViewport()` Hook

- [x] Task 17: 实现 Canvas 组件
  - [x] SubTask 17.1: 实现 Canvas 主组件
  - [x] SubTask 17.2: 实现视口变换（matrix）
  - [x] SubTask 17.3: 实现形状渲染器 ShapeRenderer
  - [x] SubTask 17.4: 实现选择框 SelectionBox
  - [x] SubTask 17.5: 实现交互处理（鼠标、键盘、滚轮）

- [x] Task 18: 实现交互功能
  - [x] SubTask 18.1: 实现形状选择（单击、Shift 多选）
  - [x] SubTask 18.2: 实现视口平移和缩放

## Phase 7: 导出功能

- [x] Task 19: 实现导出功能
  - [x] SubTask 19.1: 实现 `exportToJSON()` 方法
  - [x] SubTask 19.2: 实现 `importFromJSON()` 方法
  - [ ] SubTask 19.3: 实现 `exportToImage()` 方法（基于 html2canvas 或自定义实现）

## Phase 8: 文档与测试

- [x] Task 20: 编写文档
  - [x] SubTask 20.1: 编写 README.md
  - [ ] SubTask 20.2: 编写 API 文档
  - [ ] SubTask 20.3: 编写使用示例

- [ ] Task 21: 编写测试
  - [ ] SubTask 21.1: 编写 Editor 单元测试
  - [ ] SubTask 21.2: 编写 Store 单元测试
  - [ ] SubTask 21.3: 编写 Shape 系统测试
  - [ ] SubTask 21.4: 编写 React 组件测试

## Phase 9: 应用层迁移

- [x] Task 22: 迁移现有应用
  - [x] SubTask 22.1: 更新 `apps/ai_draw/client/package.json` 依赖 SDK
  - [x] SubTask 22.2: 迁移 ClothingShape 到应用层
  - [x] SubTask 22.3: 更新业务组件使用 SDK API
  - [ ] SubTask 22.4: 移除重复代码

---

# Task Dependencies

- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 4, Task 5]
- [Task 7, Task 8, Task 9] depends on [Task 6]
- [Task 10, Task 11] depends on [Task 6]
- [Task 12, Task 13] depends on [Task 6]
- [Task 14] depends on [Task 12, Task 13]
- [Task 15, Task 16] depends on [Task 6]
- [Task 17] depends on [Task 15, Task 16, Task 14]
- [Task 18] depends on [Task 17]
- [Task 19] depends on [Task 6, Task 7]
- [Task 22] depends on [Task 17, Task 18, Task 19]

---

# 并行任务建议

以下任务可以并行执行：

**Phase 1 并行组**:
- Task 1, Task 2, Task 3 可并行

**Phase 2 并行组**:
- Task 4, Task 5 可并行（Task 5 依赖 Task 4 的类型定义）

**Phase 4 并行组**:
- Task 10, Task 11 可并行

**Phase 5 并行组**:
- Task 12, Task 13 可并行
- Task 14 的各子任务可并行

**Phase 6 并行组**:
- Task 15, Task 16 可并行
- Task 17, Task 18 需顺序执行

**Phase 8 并行组**:
- Task 20, Task 21 可并行
