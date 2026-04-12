# Hero 落地页优化开发计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将落地页 Hero 区域改造为可交互的 AI 换装演示组件，让用户第一眼就能理解 Joii 的核心功能：**拖入模特图 → 拖入服装图 → 点击生成 → 查看结果**。传达"使用简单，效果强大"的产品理念。

**Design Philosophy:**
- **简单 (Simple)**: 三步完成换装，拖拽式交互，无需学习成本
- **清晰 (Clear)**: 所见即所得，流程一目了然
- **强大 (Powerful)**: 展示 AI 生成的高质量结果

**Reference Components:**
1. [AICombinationComponent.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx) - 核心换装交互模式
2. [Toolbar.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/components/Toolbar.tsx) - 画布工具栏 UI 风格
3. [Canvas.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/Canvas.tsx) - 画布布局

**Core Try-on Flow (simple-tryon):**
```
[模特图] + [服装图] = [结果图]
```

---

## 设计规范

### 画布 UI 风格借鉴

从 [Toolbar.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/components/Toolbar.tsx) 提取设计元素：

| 元素 | 画布风格 | 应用到 Hero |
|------|----------|-------------|
| 工具按钮 | 圆形/圆角，`w-12 h-12 rounded-full` | 替换播放按钮 |
| 图标 | Lucide Icons, `size={20}` | 槽位图标 |
| 配色 | `bg-neutral-950` 黑色主调 | 按钮背景色 |
| 间距 | `gap-2`, `p-3` | 组件内间距 |
| 悬停态 | `hover:bg-neutral-800` | 交互反馈 |

### 槽位设计

复用 [AICombinationComponent.tsx:35-42](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx#L35-L42) 的尺寸：

```tsx
const SLOT_WIDTH = 120
const SLOT_HEIGHT = 160
const SLOT_GAP = 16
const BORDER_WIDTH = 3 // 'border-3'
```

### 布局比例

参考 [Canvas.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/Canvas.tsx) 的居中布局模式：

```tsx
// 水平居中布局
<div className="flex items-center justify-center gap-4">

// 垂直方向居中
<div className="flex flex-col items-center justify-center h-full">
```

---

## Task 1: 创建 HeroTryOn 组件基础结构

**Files:**
- Create: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 分析核心交互元素**

从 [AICombinationComponent.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx) 提取关键 UI 模式：

| 元素 | 位置 | 功能 |
|------|------|------|
| ImageSlotRenderer | L63-161 | 图片拖拽/上传槽位 |
| Play Button | L441-456 | 触发 AI 生成 |
| OutputSlotContent | L221-251 | 结果展示 |
| Loading State | L451-455 | 生成中动画 |

从 [Toolbar.tsx:41-53](file:///d:/ai/canvas/apps/web/src/app/canvas/components/Toolbar.tsx#L41-L53) 提取按钮风格：

```tsx
// 工具按钮基础样式
className="w-12 h-12 rounded-full flex items-center justify-center transition-all"

// 选中态
className="bg-neutral-950 text-white"

// 未选中悬停态
className="hover:bg-neutral-100 text-neutral-600"
```

**Step 2: 创建 HeroTryOn 组件框架**

```tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Upload, Play, Loader2, User, Shirt, Image as ImageIcon, Equal } from 'lucide-react'

interface HeroTryOnProps {
  className?: string
}

type Step = 'model' | 'clothing' | 'generating' | 'result'

export function HeroTryOn({ className }: HeroTryOnProps) {
  const [step, setStep] = useState<Step>('model')
  const [modelImage, setModelImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState<string | null>(null)
  // ... 完整代码见文件
}
```

**Step 3: 定义样式常量**

结合画布和 AICombination 的样式：

```tsx
// 槽位尺寸（复用 AICombinationComponent）
const SLOT_WIDTH = 120
const SLOT_HEIGHT = 160
const SLOT_GAP = 16

// 播放按钮（复用 Toolbar 风格）
const PLAY_BUTTON_SIZE = 48 // w-12 h-12
```

---

## Task 2: 实现拖拽上传交互

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 添加拖拽状态处理器**

```tsx
const handleDragOver = (e: React.DragEvent, slot: string) => {
  e.preventDefault()
  setIsDragOver(slot)
}

const handleDrop = useCallback((e: React.DragEvent, slot: string) => {
  e.preventDefault()
  setIsDragOver(null)

  // 使用预设示例图（不做真实上传）
  const mockImages = {
    'model': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'clothing': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
  }

  if (slot === 'model' && !modelImage) {
    setModelImage(mockImages.model)
    setStep('clothing')
  }
  if (slot === 'clothing' && !clothingImage && modelImage) {
    setClothingImage(mockImages.clothing)
    setStep('generating')
    // 模拟 AI 生成延迟
    setTimeout(() => {
      setResultImage('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')
      setStep('result')
    }, 2500)
  }
}, [modelImage, clothingImage])
```

**Step 2: 创建 ImageSlot 组件（借鉴画布 UI）**

```tsx
interface ImageSlotProps {
  type: 'model' | 'clothing' | 'result'
  image: string | null
  isDragOver: boolean
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}

function ImageSlot({ type, image, isDragOver, onDragOver, onDrop, onClick }: ImageSlotProps) {
  // 图标和标签（复用 Toolbar 的 Lucide Icons）
  const icon = type === 'model' ? <User size={20} /> : <Shirt size={20} />
  const label = type === 'model' ? '拖入模特图' : '拖入服装图'

  // 借鉴 AICombinationComponent 的边框样式
  return (
    <div
      className={`
        relative bg-gray-100 overflow-hidden shadow-md transition-all cursor-pointer
        ${isDragOver
          ? 'border-3 border-blue-500 bg-blue-50'  // 拖拽悬停
          : image
            ? 'border-3 border-white'  // 已有图片
            : 'border-3 border-dashed border-gray-300 hover:border-gray-400'  // 空槽位
        }
      `}
      style={{ width: SLOT_WIDTH, height: SLOT_HEIGHT }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {image ? (
        <img src={image} alt={type} className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
          {icon}
          <span className="text-xs">{label}</span>
        </div>
      )}
    </div>
  )
}
```

---

## Task 3: 实现生成动画效果

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 添加生成按钮（复用 Toolbar 风格）**

```tsx
{step === 'clothing' && clothingImage && (
  <button
    onClick={() => {
      setStep('generating')
      setTimeout(() => {
        setResultImage('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')
        setStep('result')
      }, 2500)
    }}
    // 复用 Toolbar 按钮风格
    className="w-12 h-12 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white flex items-center justify-center transition-all shadow-lg"
  >
    <Play size={22} fill="white" />
  </button>
)}
```

**Step 2: 添加生成状态动画（复用 AICombinationComponent）**

```tsx
{step === 'generating' && (
  <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
    <div className="flex flex-col items-center gap-3">
      // 复用 AICombinationComponent 的加载动画
      <Loader2 size={32} className="animate-spin text-neutral-950" />
      <span className="text-sm text-gray-600 font-sans-zh">AI 正在生成...</span>
    </div>
  </div>
)}
```

---

## Task 4: 实现自动播放演示流程

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 添加 useEffect 自动演示**

首次加载时自动播放完整流程（3秒 → 5秒 → 7秒），让用户无需交互即可看到效果：

```tsx
useEffect(() => {
  // 延迟启动自动演示
  const startTimer = setTimeout(() => {
    // Step 1: 自动填入模特图
    if (!modelImage) {
      setModelImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400')
      setStep('clothing')
    }
  }, 3000)

  return () => clearTimeout(startTimer)
}, [])

useEffect(() => {
  // Step 2: 自动填入服装图
  if (step === 'clothing' && modelImage && !clothingImage) {
    const timer = setTimeout(() => {
      setClothingImage('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400')
      setStep('generating')
    }, 2000)
    return () => clearTimeout(timer)
  }

  // Step 3: 自动生成结果
  if (step === 'generating' && clothingImage && !resultImage) {
    const timer = setTimeout(() => {
      setResultImage('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800')
      setStep('result')
    }, 2500)
    return () => clearTimeout(timer)
  }
}, [step, modelImage, clothingImage, resultImage])
```

---

## Task 5: 添加步骤引导和状态提示

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 添加步骤指示器（复用画布风格）**

```tsx
const steps = [
  { id: 'model', label: '上传模特', icon: User },
  { id: 'clothing', label: '选择服装', icon: Shirt },
  { id: 'generating', label: 'AI 生成', icon: Loader2 },
  { id: 'result', label: '查看结果', icon: ImageIcon },
]

function StepIndicator() {
  return (
    <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          {i > 0 && <span className="text-neutral-300">→</span>}
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans-zh transition-all
            ${step === s.id
              ? 'bg-neutral-950 text-white'  // 复用 Toolbar 选中态
              : 'bg-white text-neutral-400 border border-neutral-200'
            }
          `}>
            {step === s.id ? <s.icon size={12} className="animate-spin" /> : <s.icon size={12} />}
            <span>{s.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
```

**Step 2: 添加空槽位提示**

```tsx
// 借鉴 Toolbar 的 tooltip 风格
<div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-neutral-950 text-white text-xs rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-sans-zh">
  拖入图片或点击上传
</div>
```

---

## Task 6: 重构 HeroSectionCN 布局

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroSectionCN.tsx`

**Step 1: 导入 HeroTryOn 组件**

```tsx
import { HeroTryOn } from './HeroTryOn'
```

**Step 2: 替换静态图片区域为交互组件**

[HeroSectionCN.tsx:40-57](file:///d:/ai/canvas/apps/web/src/features/landing/components/HeroSectionCN.tsx#L40-L57)

将现有的静态图片 `<div className="relative aspect-[3/4] bg-neutral-100...">` 替换为 HeroTryOn：

```tsx
<div className="col-span-12 lg:col-span-7">
  <HeroTryOn className="aspect-[4/3] max-w-xl mx-auto" />
</div>
```

**Step 3: 调整左右布局比例**

[HeroSectionCN.tsx:10-11](file:///d:/ai/canvas/apps/web/src/features/landing/components/HeroSectionCN.tsx#L10-L11)

```tsx
// 修改前
<div className="grid grid-cols-12 gap-6 items-start">
  <div className="col-span-12 lg:col-span-7">

// 修改后 - 画布布局：左侧文案少，右侧交互区大
<div className="grid grid-cols-12 gap-12 items-center">
  <div className="col-span-12 lg:col-span-5">
```

---

## Task 7: 添加移动端适配

**Files:**
- Modify: `apps/web/src/features/landing/components/HeroTryOn.tsx`

**Step 1: 添加响应式样式**

```tsx
<div className={`
  relative w-full h-full bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl overflow-hidden
  ${className}
`}>
  {/* 移动端简化展示 - 复用画布的响应式断点 */}
  <div className="md:hidden p-4">
    <div className="text-center text-sm text-neutral-600 mb-4">
      <Sparkles className="w-5 h-5 mx-auto mb-2 animate-pulse" />
      <span className="font-sans-zh">AI 换装演示</span>
    </div>
    {/* 简化版流程图 */}
    <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
      <span>模特</span>
      <span>+</span>
      <span>服装</span>
      <span>=</span>
      <span className="text-emerald-600">结果</span>
    </div>
  </div>

  {/* 桌面端完整交互 */}
  <div className="hidden md:flex flex-col items-center justify-center h-full gap-6">
    {/* 步骤指示器 */}
    <StepIndicator />

    {/* 槽位区域 */}
    <div className="flex items-center justify-center gap-4">
      {/* 模特槽位 */}
      <ImageSlot ... />

      {/* 加号 */}
      <Plus size={16} className="text-neutral-300" />

      {/* 服装槽位 */}
      <ImageSlot ... />

      {/* 等号 */}
      <Equal size={16} className="text-neutral-300" />

      {/* 结果槽位 */}
      <ImageSlot ... />
    </div>

    {/* 操作提示 */}
    <p className="text-xs text-neutral-400 font-sans-zh">
      拖入图片开始体验
    </p>
  </div>
</div>
```

---

## Task 8: 测试和验证

**Step 1: 本地验证**

```bash
cd apps/web && bun run dev
```

**Expected Results:**

| 场景 | 预期行为 |
|------|----------|
| 页面加载 | 3秒后自动开始演示流程 |
| 自动演示 | 模特图 → 服装图 → 生成动画 → 结果图 |
| 拖拽交互 | 拖入模特图后自动进入下一步 |
| 视觉风格 | 与画布 Toolbar 风格一致 |
| 移动端 | 显示简化版流程图 |

**Step 2: 验证自动播放**

Expected: 页面加载 3 秒后自动开始演示流程，完整流程约 7.5 秒

**Step 3: 验证交互**

Expected: 用户可中断自动演示，手动拖拽图片进行交互

---

## Task 9: Commit

```bash
git add apps/web/src/features/landing/components/HeroTryOn.tsx
git add apps/web/src/features/landing/components/HeroSectionCN.tsx
git commit -m "feat(landing): add interactive HeroTryOn with AI try-on demo"
```

---

## 附录：参考组件关键代码片段

### Toolbar 按钮风格
[Toolbar.tsx:41-53](file:///d:/ai/canvas/apps/web/src/app/canvas/components/Toolbar.tsx#L41-L53)

```tsx
const baseTools: { type: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { type: 'select', icon: <MousePointer2 size={20} />, label: '选择', shortcut: 'V' },
  // ...
  { type: 'clothing', icon: <Shirt size={20} />, label: '服装', shortcut: 'C', requiresAlt: true },
]

// 按钮样式复用
className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
```

### ImageSlotRenderer 核心样式
[AICombinationComponent.tsx:100-106](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx#L100-L106)

```tsx
className={`group relative bg-gray-200 border-3 overflow-hidden shadow-md transition-colors cursor-pointer ${
  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-white hover:border-white'
}`}
```

### Play Button 样式
[AICombinationComponent.tsx:442-455](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx#L442-L455)

```tsx
<button className={`
  flex-shrink-0 w-12 h-12 rounded-full transition-all flex items-center justify-center
  ${shape.combinationStatus === 'generating'
    ? 'bg-gray-300 cursor-not-allowed'
    : 'bg-blue-500 hover:bg-blue-600 text-white'}
`}>
```

### Loading State
[AICombinationComponent.tsx:232-235](file:///d:/ai/canvas/apps/web/src/app/canvas/shapes/AICombinationComponent.tsx#L232-L235)

```tsx
<div className="absolute inset-0 flex items-center justify-center">
  <Loader2 size={20} className="animate-spin text-gray-400" />
</div>
```

### Canvas 布局模式
[Canvas.tsx](file:///d:/ai/canvas/apps/web/src/app/canvas/Canvas.tsx)

```tsx
// 居中对齐
<div className="flex items-center justify-center">

// 响应式断点
<div className="hidden md:block">
```
