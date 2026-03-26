# AI换装组件 - Phase 1A 规格文档

## Why

当前需要为无限画布设计平台实现一个 **AI换装组件**，该组件能够在画布上创建实例、填充图片、调用AI生成合成图片。

采用**渐进式实现策略**，先实现组件结构和UI操作流程，确认无误后再实现图片上传和AI生成功能。

## What Changes

- 新增 `ai-combination/` 目录，包含类型定义、注册表、内置组合类型
- 新增 `AICombinationComponent.tsx` 组件渲染
- 扩展 `Shape.tsx` 支持 ai-combination 类型
- 扩展 `store.ts` 支持 AI 组合相关状态管理
- 扩展 `Canvas.tsx` 添加 ai-combination 工具

## Impact

- **Affected specs**: 扩展画布工具系统，支持新的组件类型
- **Affected code**:
  - `apps/ai_draw/client/src/canvas/shapes/types.ts`
  - `apps/ai_draw/client/src/canvas/shapes/Shape.tsx`
  - `apps/ai_draw/client/src/canvas/store.ts`
  - `apps/ai_draw/client/src/canvas/Canvas.tsx`
  - `apps/ai_draw/client/src/ai-combination/types.ts` (new)
  - `apps/ai_draw/client/src/ai-combination/registry.ts` (new)
  - `apps/ai_draw/client/src/ai-combination/built-in-types.ts` (new)
  - `apps/ai_draw/client/src/ai-combination/service.ts` (new)
  - `apps/ai_draw/client/src/canvas/shapes/AICombinationComponent.tsx` (new)

---

## ADDED Requirements

### Requirement: 组合类型注册表

系统 SHALL 提供一个组合类型注册表（`CombinationTypeRegistry`），用于注册、获取、注销组合类型。

#### Scenario: 注册新组合类型
- **WHEN** 调用 `registry.register(combinationType)`
- **THEN** 组合类型被添加到注册表，可通过 `registry.get(id)` 获取

#### Scenario: 获取所有已注册类型
- **WHEN** 调用 `registry.getAll()`
- **THEN** 返回所有已注册的组合类型数组

### Requirement: 内置组合类型 - 简单换装

系统 SHALL 提供一个内置组合类型 `simple-tryon`（服装换装），定义如下：

- **ID**: `simple-tryon`
- **名称**: `服装换装`
- **描述**: `模特图 + 服装图 = 换装结果`
- **槽位**:
  - `model`: 模特图，placeholder: "拖入或上传模特图"，acceptDrop: true
  - `clothing`: 服装图，placeholder: "拖入或上传服装图"，acceptDrop: true
- **AI配置**:
  - Model: `tryon-v1`
  - Prompt模板: `将{{clothing}}服装应用到{{model}}人物身上，保持人物面部特征和姿势自然`
  - 支持分辨率: 512×512, 768×1024, 1024×1024

### Requirement: AI组合组件渲染

系统 SHALL 提供 `AICombinationComponent` 组件，用于在画布上渲染 AI 组合实例。

#### Scenario: 渲染空状态
- **WHEN** 组件实例创建但槽位未填充图片时
- **THENEN** 显示组件标题、各槽位的虚线框和 placeholder 文字、执行按钮

#### Scenario: 渲染已填充状态
- **WHEN** 槽位已填充图片时
- **THEN** 槽位显示图片预览，右上角显示删除按钮

#### Scenario: 渲染选中状态
- **WHEN** 组件被选中时
- **THEN** 组件外围显示蓝色 ring 边框

### Requirement: 组件交互 - 槽位拖拽

系统 SHALL 支持从电脑拖拽图片文件到槽位进行填充。

#### Scenario: 拖拽图片到槽位
- **WHEN** 用户从电脑拖拽图片文件到槽位区域
- **THEN**
  - 槽位边框变为蓝色，背景变为浅蓝色
  - 释放后，图片显示在槽位中
  - `slotContents` 中对应槽位的 `imageUrl` 被更新

### Requirement: 组件交互 - 点击上传

系统 SHALL 支持点击槽位打开文件选择器上传图片。

#### Scenario: 点击空槽位
- **WHEN** 用户点击空槽位区域
- **THEN** 打开系统文件选择器，允许选择图片文件

### Requirement: 组件交互 - 清除槽位

系统 SHALL 支持清除已填充的槽位图片。

#### Scenario: 点击清除按钮
- **WHEN** 用户点击槽位右上角的清除按钮
- **THEN**
  - 槽位图片被清除
  - 显示 placeholder 文字

### Requirement: 组件交互 - 执行生成（模拟）

系统 SHALL 提供执行按钮，点击后显示生成状态。

#### Scenario: 点击执行按钮（Phase 1A 模拟）
- **WHEN** 用户点击执行按钮
- **THEN**
  - 按钮变为禁用状态，显示加载动画
  - 状态变为 'generating'
  - **Phase 1A**: 模拟2秒后显示占位结果图（暂不调用真实AI）

### Requirement: 组件交互 - 删除组件

系统 SHALL 支持通过画布的 Delete 键或工具删除组件。

---

## MODIFIED Requirements

### Requirement: Shape类型扩展

**Modified**: 在 `ShapeType` 枚举中添加 `ai-combination` 类型。

**Migration**: 现有 Shape 组件通过 switch case 处理，新增 case 渲染 AICombinationComponent。

### Requirement: ShapeProps扩展

**Modified**: 在 `ShapeProps` 接口中为 `ai-combination` 类型添加特定属性。

**Migration**: 使用类型断言或类型守卫区分不同类型的 props。

### Requirement: Canvas工具扩展

**Modified**: 在工具栏中添加 `ai-combination` 工具。

**Migration**:
- 在 `ToolType` 中添加 `ai-combination`
- 在 `placementTools` 数组中添加 `ai-combination`
- 在 `handleMouseDown` 中处理 `ai-combination` 工具点击，创建新的 AI 组合实例

### Requirement: Store状态管理扩展

**Modified**: 在 `CanvasStore` 中扩展支持 AI 组合相关状态更新。

**Migration**: 添加 `updateAISlotContent`、`updateAISettings`、`updateAIStatus` 等方法。

---

## REMOVED Requirements

无

---

## Phase 1A 架构图

```
┌─────────────────────────────────────────────────────────┐
│                   AICombinationComponent                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Header: [服装换装]                    [设置]   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                  │   │
│  │   ┌─────────┐      ┌─────────┐      ┌─────┐   │   │
│  │   │ 模特图  │  +   │ 服装图  │   →  │ ▶️  │   │   │
│  │   │ [图片]  │      │ [图片]  │      └─────┘   │   │
│  │   │ 上传/   │      │ 上传/   │                  │   │
│  │   │ 拖拽   │      │ 拖拽   │                  │   │
│  │   └─────────┘      └─────────┘                  │   │
│  │                                                  │   │
│  │   [拖入或上传模特图]    [拖入或上传服装图]           │   │
│  │                                                  │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  生成结果:  [结果1]  [结果2]  [结果3]            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 文件结构

```
apps/ai_draw/client/src/
├── ai-combination/                      # 【新增】
│   ├── types.ts                         # 类型定义
│   ├── registry.ts                      # 组合类型注册表
│   ├── built-in-types.ts                # 内置组合类型
│   └── service.ts                       # AI调用服务（Phase 1A 模拟）
│
├── canvas/
│   ├── shapes/
│   │   ├── types.ts                     # 【修改】添加ai-combination
│   │   ├── Shape.tsx                     # 【修改】添加ai-combination case
│   │   └── AICombinationComponent.tsx    # 【新增】组件渲染
│   │
│   ├── store.ts                         # 【修改】添加AI组合方法
│   └── Canvas.tsx                        # 【修改】添加ai-combination工具
```
