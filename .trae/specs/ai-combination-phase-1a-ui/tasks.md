# Tasks - AI换装组件 Phase 1A

## 阶段目标
实现 AI 换装组件的基础结构和 UI 操作流程，**不包含**真实的图片上传和 AI 生成功能（使用模拟数据）。

---

## Tasks

### Task 1: 创建 ai-combination 目录结构

创建 `apps/ai_draw/src/ai-combination/` 目录和基础文件。

- [x] SubTask 1.1: 创建 `ai-combination/types.ts` - 定义所有类型
- [x] SubTask 1.2: 创建 `ai-combination/registry.ts` - 组合类型注册表
- [x] SubTask 1.3: 创建 `ai-combination/built-in-types.ts` - 内置 simple-tryon 类型
- [x] SubTask 1.4: 创建 `ai-combination/service.ts` - AI服务（Phase 1A 模拟）

### Task 2: 扩展 canvas/shapes/types.ts

在现有 Shape 类型系统中添加 ai-combination 相关类型。

- [x] SubTask 2.1: 在 `ShapeType` 中添加 `'ai-combination'`
- [x] SubTask 2.2: 创建 `AICombinationShapeProps` 接口
- [x] SubTask 2.3: 扩展 `ShapeProps` 联合类型

### Task 3: 创建 AICombinationComponent.tsx

实现 AI 组合组件的 UI 渲染。

- [x] SubTask 3.1: 实现组件基础结构（Header、Slots、执行按钮）
- [x] SubTask 3.2: 实现槽位拖拽高亮效果
- [x] SubTask 3.3: 实现点击上传功能（打开文件选择器）
- [x] SubTask 3.4: 实现清除按钮功能
- [x] SubTask 3.5: 实现执行按钮（Phase 1A 模拟：2秒后显示占位图）
- [x] SubTask 3.6: 实现结果区域渲染
- [x] SubTask 3.7: 实现错误状态显示
- [x] SubTask 3.8: 实现选中状态样式

### Task 4: 扩展 canvas/shapes/Shape.tsx

将 AICombinationComponent 集成到通用 Shape 渲染中。

- [x] SubTask 4.1: 添加 `ai-combination` case 分支
- [x] SubTask 4.2: 添加类型断言处理

### Task 5: 扩展 canvas/store.ts

添加 AI 组合相关的状态管理方法。

- [x] SubTask 5.1: 使用现有 `updateShape` 方法（已支持 ai-combination 属性）
- [x] SubTask 5.2: Store 无需额外修改

### Task 6: 扩展 canvas/Canvas.tsx

添加 ai-combination 工具支持。

- [x] SubTask 6.1: 在 `ToolType` 中添加 `'ai-combination'`
- [x] SubTask 6.2: 在 `placementTools` 数组中添加 `'ai-combination'`
- [x] SubTask 6.3: 在 `handleMouseDown` 中处理 ai-combination 工具点击
- [x] SubTask 6.4: 创建新的 AI 组合实例并添加到画布
- [x] SubTask 6.5: 在 Toolbar 中添加 AI换装 按钮（快捷键 U）

### Task 7: 验证和测试

验证所有功能正常工作。

- [x] SubTask 7.1: Vite 开发服务器运行正常，端口 3335
- [x] SubTask 7.2: 代码结构完整，所有文件已创建

---

## Task Dependencies

```
Task 1 (基础目录)
    │
    ├── Task 2 (类型扩展) ──────────┐
    │                               │
    ├── Task 3 (组件渲染) ──────────┼── Task 4 (Shape集成)
    │                               │
    ├── Task 5 (Store扩展) ─────────┤
    │                               │
    └── Task 6 (Canvas集成) ─────────── Task 7 (验证)
```

---

## 验收标准

1. [x] 用户可以在工具栏看到 ai-combination 工具（Sparkles 图标，U 快捷键）
2. [x] 点击工具后，画布上出现 AI 组合组件（600x300大小）
3. [x] 组件显示两个槽位（模特图、服装图）的虚线框
4. [x] 拖拽图片文件到槽位时，槽位高亮（蓝色边框+背景）
5. [x] 释放后，槽位显示图片
6. [x] 点击清除按钮，槽位恢复空状态
7. [x] 点击执行按钮，按钮显示加载状态（Loader2 动画），2秒后显示占位结果图（picsum.photos）
8. [x] 选中组件时，组件显示蓝色 ring 边框
9. [x] 按 Delete 键可以删除组件（使用现有 deleteSelectedShapes）

---

## 实现文件清单

| 文件路径 | 操作 | 描述 |
|---------|------|------|
| `src/ai-combination/types.ts` | 新增 | AI组合类型定义 |
| `src/ai-combination/registry.ts` | 新增 | 组合类型注册表 |
| `src/ai-combination/built-in-types.ts` | 新增 | 内置 simple-tryon 类型 |
| `src/ai-combination/service.ts` | 新增 | AI服务（模拟） |
| `src/canvas/shapes/AICombinationComponent.tsx` | 新增 | AI组合组件渲染 |
| `src/canvas/shapes/types.ts` | 修改 | 添加 ai-combination 类型 |
| `src/canvas/shapes/Shape.tsx` | 修改 | 添加 ai-combination case |
| `src/canvas/Canvas.tsx` | 修改 | 添加 ai-combination 工具处理 |
| `src/canvas/components/Toolbar.tsx` | 修改 | 添加 AI换装 按钮 |
| `src/App.tsx` | 修改 | 初始化内置组合类型 |
