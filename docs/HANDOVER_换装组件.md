# Joii 项目进度交接文档

## 文档信息

| 项目       | 内容                   |
| -------- | -------------------- |
| **文档名称** | 项目进度交接文档           |
| **项目**   | Joii - 无限画布智能设计平台 |
| **版本**   | v1.1.0               |
| **交接日期** | 2026-03-26           |
| **状态**   | 开发进行中               |

***

## 1. 项目概述

### 1.1 项目背景

由于 tldraw 的授权协议限制（不允许在生产环境免费使用），我们需要自研一个无限画布设计平台。项目参考 tldraw 的架构设计，但完全独立实现代码。

### 1.2 技术栈

| 技术       | 版本/说明              |
| -------- | ------------------- |
| Vite     | 构建工具              |
| React    | 19.x                |
| TypeScript | 5.x                 |
| Tailwind | CSS 框架             |
| Zustand  | 状态管理              |
| Vercel AI SDK | AI 功能集成         |
| shadcn/ui | UI 组件库            |

### 1.3 项目结构

```
apps/ai_draw/
├── src/
│   ├── canvas/
│   │   ├── shapes/           # 画布元素组件
│   │   │   ├── Shape.tsx           # 基础 Shape 组件
│   │   │   ├── AICombinationComponent.tsx  # AI 组合组件
│   │   │   └── ...
│   │   ├── store.ts          # 画布状态管理 (Zustand)
│   │   ├── Canvas.tsx        # 主画布组件
│   │   ├── components/       # 画布相关 UI 组件
│   │   │   └── Toolbar.tsx   # 工具栏 (Tabbar)
│   │   └── index.tsx
│   ├── ai-combination/       # AI 组合功能模块
│   │   ├── built-in-types.ts # 内置组合类型定义
│   │   └── ...
│   ├── components/ui/        # shadcn/ui 组件
│   │   ├── dropdown-menu.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts          # 工具函数
│   └── App.tsx
```

***

## 2. 已完成功能

### 2.1 无限画布引擎

**核心文件**: `src/canvas/Canvas.tsx`, `src/canvas/store.ts`

#### 功能列表

- [x] DOM 实现的无限画布
- [x] 画布拖拽平移 (Pan)
- [x] 缩放功能 (Zoom)
- [x] 视口聚焦到指定区域 (`focusOnArea` 方法)

#### 关键实现

```typescript
// store.ts - focusOnArea 方法
focusOnArea: (x, y, width, height, options) => {
  const padding = options?.padding ?? 40
  const maxZoom = options?.maxZoom ?? 1
  const sidebarWidth = 320
  const topOffset = 56
  const bottomOffset = 80

  const containerWidth = window.innerWidth - sidebarWidth
  const containerHeight = window.innerHeight - topOffset - bottomOffset

  const scaleX = containerWidth / (width + padding * 2)
  const scaleY = containerHeight / (height + padding * 2)
  const scale = Math.min(scaleX, scaleY, maxZoom)

  const newOffsetX = (window.innerWidth / 2) - (x + width / 2) * scale
  const newOffsetY = (window.innerHeight / 2 - topOffset) - (y + height / 2) * scale

  setOffsetX(newOffsetX)
  setOffsetY(newOffsetY)
  setZoom(scale)
}
```

### 2.2 AI 组合组件系统

**核心文件**: `src/canvas/shapes/AICombinationComponent.tsx`

#### 功能列表

- [x] AI 组合组件渲染 (输入槽位 + 输出槽位)
- [x] 动态尺寸计算
- [x] 多输入槽位支持
- [x] 单输出和多输出布局
- [x] 拖拽排序功能
- [x] 错误状态显示

#### 组件结构

```
┌─────────────────────────────────────┐
│ [标签: 服装图模特图换衣]                    │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐  ┌──────┐      ┌──────┐  │
│  │输入1 │  │输入2 │  =   │ 输出  │  │
│  └──────┘  └──────┘      └──────┘  │
│                                     │
│              [执行按钮]               │
│                                     │
└─────────────────────────────────────┘
```

#### 尺寸常量

```typescript
const SLOT_WIDTH = 140
const SLOT_HEIGHT = 180
const SLOT_GAP = 12
const PADDING = 12
const BUTTON_WIDTH = 48
const EQUAL_WIDTH = 20
const PLUS_WIDTH = 16
const LABEL_HEIGHT = 20
```

### 2.3 内置组合类型

**核心文件**: `src/ai-combination/built-in-types.ts`

#### 已实现的组合类型

| 类型名称                  | 输入数量 | 输出数量 | 说明                    |
| --------------------- | ---- | ---- | --------------------- |
| 服装图模特图换衣            | 2    | 1    | 标准换衣流程              |
| 固定面部换衣               | 2    | 1    | 保留面部特征               |
| 固定面部、背景换衣           | 3    | 1    | 保留面部和背景             |
| 固定面部、背景、参考姿势换衣     | 4    | 1    | 保留面部、背景和姿势         |
| 姿势裂变                  | 1    | 5    | 单图输入生成5个不同姿势       |

#### 类型定义示例

```typescript
export const BUILT_IN_COMBINATION_TYPES: Record<string, CombinationType> = {
  'clothing-model-swap': {
    id: 'clothing-model-swap',
    name: '服装图模特图换衣',
    inputSlots: [
      { id: 'clothing', type: 'image', label: '服装图' },
      { id: 'model', type: 'image', label: '模特图' },
    ],
    outputSlots: [
      { id: 'result', type: 'image', label: '结果图' },
    ],
    systemPrompt: '请将服装图中的服装穿到模特图上...',
    config: { model: 'nano', quality: '4k' },
  },
  // ... 其他类型
}
```

### 2.4 Tabbar 工具栏

**核心文件**: `src/canvas/components/Toolbar.tsx`

#### 功能列表

- [x] 下拉菜单式组件选择 (使用 shadcn/ui DropdownMenu)
- [x] 向上展开的下拉菜单
- [x] 组件类型分组显示
- [x] 选中状态显示

#### UI 组件依赖

- `src/components/ui/dropdown-menu.tsx` (已修改，修复背景和header问题)

### 2.5 组件自动创建与布局

**核心文件**: `src/canvas/Canvas.tsx`, `src/canvas/store.ts`

#### 功能列表

- [x] 点击 Tabbar 自动创建组件
- [x] 自动排列到上一组件下方
- [x] 动态计算创建位置 (不受画布拖动影响)
- [x] 创建完成后自动聚焦到新组件
- [x] 创建完成后鼠标状态回归选择状态

#### 布局算法

```typescript
// 自动创建位置计算
const lastShape = shapes[shapes.length - 1]
const newX = 100  // 固定 X 位置
const newY = lastShape
  ? lastShape.y + lastShape.height + COMPONENT_GAP  // 上一组件下方
  : 100  // 首个组件位置
```

#### 组件间距常量

```typescript
const COMPONENT_GAP = 24  // 组件间距
```

### 2.6 拖拽排序功能

**核心文件**: `src/canvas/shapes/AICombinationComponent.tsx`

#### 功能列表

- [x] 槽位拖拽排序
- [x] 拖拽占位符显示
- [x] 拖拽状态管理
- [x] 拖拽方向限制 (仅水平)

***

## 3. 待优化问题

### 3.1 组件边界包裹问题

**问题描述**: 换装组件的外围选取没有完全包裹住内部所有元素，两端有一小部分没有包裹住。

**相关文件**: `src/canvas/shapes/AICombinationComponent.tsx`

**状态**: 部分修复中

### 3.2 姿势裂变组件换行问题

**问题描述**: 最后一个姿势裂变组件在布局时换行了，不应该换行。

**状态**: 待修复

**可能原因**: 组件宽度计算或布局算法问题

### 3.3 组件尺寸动态计算

**问题描述**: 需要确保所有元素 (输入槽位、按钮、输出槽位、间距) 都被正确计算在总尺寸内。

**状态**: 待验证

***

## 4. 核心文件说明

### 4.1 状态管理 (store.ts)

**位置**: `src/canvas/store.ts`

**主要状态**:
- `shapes`: 画布上的所有形状
- `offsetX/offsetY`: 画布偏移
- `zoom`: 缩放比例
- `selectedShapeIds`: 选中的形状 ID 列表
- `tool`: 当前工具

**关键方法**:
- `addShape()`: 添加形状
- `updateShape()`: 更新形状属性
- `deleteShape()`: 删除形状
- `focusOnArea()`: 聚焦到指定区域
- `getLastShapeBottom()`: 获取最后一个形状的底部位置

### 4.2 基础形状组件 (Shape.tsx)

**位置**: `src/canvas/shapes/Shape.tsx`

**功能**:
- 通用形状渲染
- 选中状态 UI
- 旋转/缩放手柄
- 组件类型判断和渲染委托

**关键逻辑**:
```typescript
const isCustomComponent = ['ai-combination'].includes(shape.type)
const shapeStyle: React.CSSProperties = {
  position: 'absolute',
  left: shape.x,
  top: shape.y,
  width: shape.width,
  height: shape.height,
  transform: `rotate(${shape.rotation}deg)`,
  overflow: shape.type === 'ai-combination' ? 'visible' : undefined,
}
```

### 4.3 AI 组合组件 (AICombinationComponent.tsx)

**位置**: `src/canvas/shapes/AICombinationComponent.tsx`

**功能**:
- 组合类型配置渲染
- 动态尺寸计算
- 槽位渲染 (输入/输出)
- 执行按钮
- 拖拽排序

**尺寸计算逻辑**:
```typescript
useEffect(() => {
  const calculateDimensions = () => {
    let totalWidth = PADDING * 2
    let totalHeight = PADDING * 2 + LABEL_HEIGHT

    if (isMultiOutput) {
      totalWidth += (SLOT_WIDTH * inputSlots.length) + (SLOT_GAP * (inputSlots.length - 1)) + BUTTON_WIDTH
      totalHeight += SLOT_HEIGHT + SLOT_GAP + (Math.ceil(outputSlots.length / 2) * (SLOT_HEIGHT + SLOT_GAP))
    } else {
      totalWidth += (SLOT_WIDTH * inputSlots.length) + (SLOT_GAP * (inputSlots.length - 1)) + EQUAL_WIDTH + SLOT_WIDTH + BUTTON_WIDTH
      totalHeight += SLOT_HEIGHT
    }

    return { totalWidth, totalHeight }
  }
  // ... 更新 shape 尺寸
}, [inputSlots.length, outputSlots.length, isMultiOutput])
```

### 4.4 工具栏 (Toolbar.tsx)

**位置**: `src/canvas/components/Toolbar.tsx`

**功能**:
- Tabbar 渲染
- 下拉菜单触发
- 组件创建逻辑

***

## 5. 样式系统

### 5.1 全局样式

**位置**: `src/index.css`

**内容**:
- Tailwind CSS 配置
- 自定义 CSS 变量
- shadcn/ui 样式覆盖

### 5.2 DropdownMenu 修改

**位置**: `src/components/ui/dropdown-menu.tsx`

**修改内容**:
- 添加背景色 (`bg-white`)
- 移除 header

***

## 6. 下一步开发建议

### 6.1 紧急 (P0)

1. **修复组件边界包裹问题**
   - 验证所有间距常量是否正确
   - 检查 padding 和 gap 的计算
   - 确保 `overflow: visible` 正确应用

2. **修复姿势裂变组件换行**
   - 检查多输出布局的宽度计算
   - 验证 `Math.ceil(outputSlots.length / 2)` 逻辑

### 6.2 重要 (P1)

1. **完善拖拽排序功能**
   - 添加视觉反馈
   - 实现数据持久化

2. **AI 执行功能对接**
   - 连接后端 API
   - 实现图片上传/下载

3. **撤销/重做功能**
   - 使用 Zustand middleware

### 6.3 常规 (P2)

1. **组件属性编辑面板**
2. **快捷键支持**
3. **导出功能**

***

## 7. 已知问题

| 序号 | 问题描述 | 严重程度 | 状态 |
| -- | ----- | ----- | -- |
| 1  | 组件边界包裹不完整 | 中    | 修复中 |
| 2  | 姿势裂变组件换行 | 中    | 待修复 |
| 3  | 拖拽排序视觉反馈 | 低    | 待完善 |

***

## 8. 修改记录

| 版本     | 日期         | 修改人  | 修改内容 |
| ------ | ---------- | -----| ----- |
| v1.1.0 | 2026-03-26 | Joii Team | 当前版本，新增 AI 组合组件系统、Tabbar 下拉菜单、组件自动创建功能 |
| v1.0.0 | 2026-03-23 | Joii Team | 初始版本，完成 PRD 文档和项目规划 |

***

**文档版本历史**

| 版本     | 日期         | 修改人          | 修改内容 |
| ------ | ---------- | ------------ | ---- |
| v1.1.0 | 2026-03-26 | Joii Team | 当前进度交接 |
| v1.0.0 | 2026-03-23 | Joii Team | 初始版本 |
