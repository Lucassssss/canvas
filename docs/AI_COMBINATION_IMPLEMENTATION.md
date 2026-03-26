# AI组合组件 - 实施文档

## 文档信息

| 项目 | 内容 |
|------|------|
| **文档名称** | AI组合组件实施文档 |
| **版本** | v2.0.0 |
| **状态** | 开发完成 |
| **日期** | 2026-03-26 |

---

## 1. 架构概述

### 1.1 核心设计

AI组合组件是一个**可扩展的组件系统**，通过声明式配置定义不同的AI处理流程。用户可以定义：

- **组件类型**（CombinationType）：描述一个AI任务的输入输出结构
- **槽位**（Slot）：定义输入/输出接口，支持图片和文本
- **自动注册**：定义新组件后自动出现在工具栏

### 1.2 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Toolbar                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │
│  │选择 │ │手型 │ │画笔 │ │文本 │ │图片 │ │服装 │ │换装 │...│
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ │
│                                        ▲                   │
│                    动态注册的工具     │                   │
└────────────────────────────────────────┼───────────────────┘
                                         │
┌────────────────────────────────────────┼───────────────────┐
│            CombinationTypeRegistry      │                   │
│  ┌────────────────────────────────────────────────────────┐│
│  │  register(type) → 自动创建 ToolDefinition              ││
│  │  subscribe(listener) → 监听注册变化，触发Toolbar更新   ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 类型定义

### 2.1 SlotDefinition - 槽位定义

```typescript
interface SlotDefinition {
  id: string           // 槽位唯一标识
  name: string         // 显示名称
  type: 'image' | 'text'  // 槽位类型
  role: 'input' | 'output' // 输入/输出角色
  placeholder?: string // 空状态提示
  acceptDrop?: boolean // 是否接受拖拽（仅image类型）
  defaultValue?: string// 默认值（仅text类型）
  required?: boolean   // 是否必填
}
```

### 2.2 CombinationType - 组合类型定义

```typescript
interface CombinationType {
  id: string           // 唯一标识，如 'simple-tryon'
  name: string         // 显示名称，如 '服装换装'
  icon?: string        // 图标标识
  description: string  // 功能描述
  slots: SlotDefinition[]  // 槽位列表
  aiConfig: AIConfig   // AI配置
}
```

### 2.3 AIConfig - AI配置

```typescript
interface AIConfig {
  model?: string | string[]      // 支持单个或多个模型
  promptTemplate?: string          // 提示词模板
  supportedResolutions?: Array<{   // 支持的分辨率
    width: number
    height: number
    label: string
  }>
  customConfig?: Record<string, unknown>  // 自定义配置
}
```

---

## 3. 内置组件类型

### 3.1 服装换装 (simple-tryon)

```
┌─────────┐    ┌─────────┐         ┌─────────┐
│ 模特图  │ +  │ 服装图  │  ▶ Run  │ 结果图  │
│  input  │    │  input  │         │ output  │
└─────────┘    └─────────┘         └─────────┘
```

```typescript
{
  id: 'simple-tryon',
  name: '服装换装',
  slots: [
    { id: 'model', name: '模特图', type: 'image', role: 'input' },
    { id: 'clothing', name: '服装图', type: 'image', role: 'input' },
    { id: 'result', name: '结果图', type: 'image', role: 'output' },
  ],
  aiConfig: {
    model: 'tryon-v1',
    promptTemplate: '将{{clothing}}服装应用到{{model}}人物身上...',
  }
}
```

### 3.2 文生图 (text-to-image)

```
┌─────────┐         ┌─────────┐
│ 提示词  │  ▶ Run  │ 生成图  │
│  input  │         │ output  │
└─────────┘         └─────────┘
```

```typescript
{
  id: 'text-to-image',
  name: '文生图',
  slots: [
    { id: 'prompt', name: '提示词', type: 'text', role: 'input' },
    { id: 'result', name: '生成图', type: 'image', role: 'output' },
  ],
  aiConfig: {
    model: ['dall-e-3', 'stable-diffusion-xl'],
    customConfig: {
      style: ['realistic', 'anime', 'artistic'],
    }
  }
}
```

### 3.3 图片编辑 (image-edit)

```
┌─────────┐    ┌─────────┐         ┌─────────┐
│  原图   │ +  │ 编辑指令 │  ▶ Run  │ 编辑结果 │
│  input  │    │  input  │         │ output  │
└─────────┘    └─────────┘         └─────────┘
```

---

## 4. 自定义新组件

### 4.1 示例：定义一个新的"模特换装"组件

```typescript
import { combinationRegistry } from './registry'

combinationRegistry.register({
  id: 'model-tryon',
  name: '模特换装',
  description: '多图模特 + 服装图 = 换装结果',
  slots: [
    {
      id: 'model1',
      name: '模特图1',
      type: 'image',
      role: 'input',
      acceptDrop: true,
    },
    {
      id: 'model2',
      name: '模特图2',
      type: 'image',
      role: 'input',
      acceptDrop: true,
    },
    {
      id: 'prompt',
      name: '提示词',
      type: 'text',
      role: 'input',
      placeholder: '额外描述...',
    },
    {
      id: 'result',
      name: '结果图',
      type: 'image',
      role: 'output',
    },
  ],
  aiConfig: {
    model: ['nano', 'banana', 'pro2'],  // 支持多模型选择
    promptTemplate: '{{prompt}}',
    supportedResolutions: [
      { width: 1024, height: 1366, label: '4K' },
      { width: 768, height: 1024, label: '768×1024' },
    ],
    customConfig: {
      quality: ['fast', 'standard', 'hd'],
    },
  },
})
```

### 4.2 自动效果

注册后，该组件会自动：
1. ✅ 出现在工具栏的AI工具区域
2. ✅ 支持快捷键切换
3. ✅ 动态生成对应的UI布局
4. ✅ 支持多模型选择

---

## 5. 文件结构

```
apps/ai_draw/src/
├── ai-combination/
│   ├── types.ts              # 类型定义
│   ├── registry.ts          # 组合类型注册表（支持动态注册）
│   ├── built-in-types.ts     # 内置组件类型
│   └── service.ts           # AI调用服务
│
├── canvas/
│   ├── components/
│   │   └── Toolbar.tsx      # 动态渲染注册的工具
│   ├── shapes/
│   │   ├── AICombinationComponent.tsx  # 组件渲染
│   │   └── Shape.tsx        # 通用Shape渲染
│   └── store.ts             # Zustand store
│
└── App.tsx                  # 调用 registerBuiltInTypes()
```

---

## 6. 核心API

### 6.1 CombinationTypeRegistry

```typescript
class CombinationTypeRegistry {
  // 注册新组件类型
  register(type: CombinationType): void

  // 批量注册
  registerBatch(types: CombinationType[]): void

  // 获取组件类型
  get(id: string): CombinationType | undefined

  // 获取所有已注册类型
  getAll(): CombinationType[]

  // 注销组件类型
  unregister(id: string): void

  // 获取工具栏定义
  getToolDefinitions(): ToolDefinition[]

  // 订阅变化（用于ToolBar自动更新）
  subscribe(listener: () => void): () => void
}
```

---

## 7. 技术细节

### 7.1 动态工具栏

Toolbar使用`useState`和`useEffect`监听registry的变化：

```typescript
const [aiTools, setAITools] = useState<ToolDefinition[]>([])

useEffect(() => {
  setAITools(combinationRegistry.getToolDefinitions())
  
  const unsubscribe = combinationRegistry.subscribe(() => {
    setAITools(combinationRegistry.getToolDefinitions())
  })
  
  return unsubscribe
}, [])
```

### 7.2 组件创建

创建组件时，根据combinationType动态生成slotContents：

```typescript
const combinationType = combinationRegistry.get(categoryId)
const slotContents: Record<string, SlotContent> = {}

combinationType.slots.forEach((slot) => {
  slotContents[slot.id] = {
    source: 'none',
    ...(slot.type === 'image' 
      ? { imageUrl: null } 
      : { text: null }),
  }
})
```

### 7.3 UI渲染

AICombinationComponent根据slot的type和role渲染不同UI：

```typescript
// 输入图片槽位
{slot.type === 'image' && slot.role === 'input' && <ImageSlotRenderer />}

// 输入文本槽位
{slot.type === 'text' && slot.role === 'input' && <TextSlotRenderer />}

// 输出槽位
{slot.role === 'output' && <OutputSlotRenderer />}
```

---

## 8. 已完成功能

- ✅ Slot类型扩展（image/text）
- ✅ Slot角色区分（input/output）
- ✅ 动态注册机制
- ✅ Toolbar自动更新
- ✅ 多模型支持
- ✅ 自定义配置
- ✅ 内置三种组件类型

---

## 9. 后续扩展方向

- [ ] 批量生成支持
- [ ] 提示词编辑面板
- [ ] 分辨率选择器
- [ ] 模型选择器UI
- [ ] 生成历史记录
- [ ] 结果图直接添加到画布

---

**文档版本历史**

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0.0 | 2026-03-26 | 初始版本，基础换装功能 |
| v2.0.0 | 2026-03-26 | 扩展为通用组件系统，支持动态注册 |
