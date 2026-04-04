# 属性配置面板文档

## 概述

属性配置面板是一个浮动在画布组件下方的配置工具，用于配置 AI 图片生成参数。当选中支持的组件类型时，面板会自动显示在组件下方。

## 目录结构

```
canvas/config-panel/
├── index.ts                  # 统一导出
├── FloatingConfigPanel.tsx   # 主面板组件
├── ModelSelect.tsx           # 模型选择组件
├── AspectRatioSelect.tsx     # 比例选择组件
├── ResolutionSelect.tsx      # 分辨率选择组件
└── CountSelect.tsx          # 张数选择组件
```

## 组件列表

### 1. FloatingConfigPanel

主面板组件，浮动显示在选中组件下方。

**位置**: 选中组件正下方，水平居中，自动调整避免溢出

**Props**:
```typescript
interface FloatingConfigPanelProps {
  containerRef: React.RefObject<HTMLDivElement | null>  // 画布容器 ref
  config?: ConfigPanelConfig
}

interface ConfigPanelConfig {
  enabledFields?: ConfigField[]  // 启用的配置项
  shapeTypeFilter?: ShapeTypeFilter  // 组件类型过滤
}

type ConfigField = 'model' | 'resolution' | 'aspectRatio' | 'count'
type ShapeTypeFilter = 'image' | 'custom-combination' | 'all'
```

**使用示例**:
```tsx
import { FloatingConfigPanel } from './config-panel'

// 显示所有支持的组件类型（默认）
<FloatingConfigPanel containerRef={containerRef} />

// 只显示 image 组件的配置面板
<FloatingConfigPanel 
  containerRef={containerRef}
  config={{ shapeTypeFilter: 'image' }}
/>

// 只显示 custom-combination 组件的配置面板
<FloatingConfigPanel 
  containerRef={containerRef}
  config={{ shapeTypeFilter: 'custom-combination' }}
/>

// 只启用部分配置项
<FloatingConfigPanel 
  containerRef={containerRef}
  config={{ enabledFields: ['model', 'count'] }}
/>

// 组合使用
<FloatingConfigPanel 
  containerRef={containerRef}
  config={{ 
    shapeTypeFilter: 'custom-combination',
    enabledFields: ['model', 'resolution', 'aspectRatio', 'count'] 
  }}
/>
```

### 2. ModelSelect

模型选择组件，下拉显示可用的 AI 模型。

**导出内容**:
```typescript
export const MODEL_OPTIONS: ModelOption[] = [
  { value: 'gemini-3-pro-image-preview', label: 'Nano Banana Pro', icon: 'google' },
  { value: 'gemini-3.1-flash-image-preview', label: 'Nano Banana 2', icon: 'google' },
  { value: 'gemini-2.5-flash-image', label: 'Nano Banana', icon: 'google' },
  { value: 'seedream-4.5', label: 'Seedream 4.5', icon: 'seedream' },
]

interface ModelOption {
  value: string    // 模型标识
  label: string    // 显示名称
  icon: string     // 图标标识
}
```

**使用示例**:
```tsx
import { ModelSelect } from './config-panel'

<ModelSelect
  value={config.model}
  onChange={(v) => updateConfig({ model: v })}
  className="h-8 text-sm"
/>
```

### 3. AspectRatioSelect

图片比例选择组件，下拉显示竖向/横向/方形比例。

**导出内容**:
```typescript
export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  // 方形
  { value: '1:1', width: 1024, height: 1024, category: 'square' },
  // 竖向
  { value: '2:3', width: 832, height: 1248, category: 'portrait' },
  { value: '3:4', width: 864, height: 1184, category: 'portrait' },
  { value: '4:5', width: 896, height: 1152, category: 'portrait' },
  { value: '9:16', width: 768, height: 1344, category: 'portrait' },
  // 横向
  { value: '3:2', width: 1248, height: 832, category: 'landscape' },
  { value: '4:3', width: 1184, height: 864, category: 'landscape' },
  { value: '16:9', width: 1344, height: 768, category: 'landscape' },
  { value: '21:9', width: 1536, height: 672, category: 'landscape' },
]

interface AspectRatioOption {
  value: string                    // 比例值
  width: number                    // 对应宽度
  height: number                   // 对应高度
  category: 'portrait' | 'landscape' | 'square'
}
```

**使用示例**:
```tsx
import { AspectRatioSelect } from './config-panel'

<AspectRatioSelect
  value={config.aspectRatio}
  onChange={(v) => updateConfig({ aspectRatio: v })}
  className="h-8 text-sm"
/>
```

### 4. ResolutionSelect

图片分辨率选择组件。

**导出内容**:
```typescript
export type Resolution = '1K' | '2K' | '4K'

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { value: '1K', label: '1K 标准' },
  { value: '2K', label: '2K 高清' },
  { value: '4K', label: '4K 超清' },
]
```

**使用示例**:
```tsx
import { ResolutionSelect } from './config-panel'

<ResolutionSelect
  value={config.resolution}
  onChange={(v) => updateConfig({ resolution: v })}
  className="h-8 text-sm"
/>
```

### 5. CountSelect

生成张数选择组件。

**导出内容**:
```typescript
export type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const COUNT_OPTIONS: CountOption[] = [
  { value: 1, label: '1 张' },
  { value: 2, label: '2 张' },
  // ...
  { value: 10, label: '10 张' },
]
```

**使用示例**:
```tsx
import { CountSelect } from './config-panel'

<CountSelect
  value={config.count}
  onChange={(v) => updateConfig({ count: v })}
  className="h-8 text-sm"
/>
```

## 数据类型

### ImageConfig

存储在 ShapeProps 中的配置数据类型，所有支持属性配置的组件都使用此结构：

```typescript
export interface ImageConfig {
  model: string           // 模型标识
  resolution: '1K' | '2K' | '4K'  // 分辨率
  aspectRatio: string     // 比例，如 '1:1', '9:16'
  count: number          // 生成张数
  prompt: string         // 提示词
}
```

### ImageGenerationConfig

面板使用的完整配置类型：

```typescript
import type { Resolution } from './ResolutionSelect'
import type { Count } from './CountSelect'

export interface ImageGenerationConfig {
  model: string
  resolution: Resolution
  aspectRatio: string
  count: Count
  prompt: string
}
```

## 集成到 Canvas

在 Canvas.tsx 中集成：

```tsx
import { FloatingConfigPanel } from './config-panel'

export const Canvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef}>
      {/* 画布内容 */}

      {/* 浮动配置面板 - 放在 viewport 外部 */}
      <FloatingConfigPanel containerRef={containerRef} />
    </div>
  )
}
```

## 支持的组件类型

### image 组件
- 使用 `imageConfig` 存储配置
- 支持所有配置项

### custom-combination 组件
- 使用 `imageConfig` 存储配置
- 支持所有配置项
- 已移除内置配置面板，统一使用属性配置面板

## 交互行为

1. **显示条件**: 当选中的组件类型为 `image` 或 `custom-combination` 时自动显示
2. **定位**: 始终在选中组件下方，水平居中
3. **边界检测**: 自动调整位置避免溢出视口
4. **点击穿透**: 点击面板不触发画布取消选中

## 下一步计划

- [ ] 生成按钮对接后端 API
- [ ] 添加配置预览功能
- [ ] 支持更多组件类型的配置
