# AI Chat 实现方案规格说明书

## 1. 背景与目标

### 1.1 项目背景

`apps/ai_draw` 是一个基于无限画布的 AI 驱动设计平台。当前右侧边栏（RightSidebar）仅包含简单的占位聊天 UI，需要完整实现与 `apps/web` 一致的 AI 对话功能。

### 1.2 核心要求

1. **模块独立性**：AI 聊天模块与画布模块完全独立，通过 tool 调用交互
2. **UI 风格**：纯黑白设计，无蓝色等彩色
   - 用户消息：黑色背景
   - AI 消息：白色背景
   - 无头像设计
3. **前后分离**：不使用 Next.js 服务端，直接调用 api 服务
4. **技术栈**：Vite + React 19 + TypeScript + Tailwind CSS + Zustand

### 1.3 参考实现

- **Web 前端** (`apps/web`)：成熟的 AI 对话 UI 实现（仅参考 UI/UX）
- **API 服务** (`apps/api`)：AI 对话后端服务，支持流式响应

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 对话消息展示

| 功能 | 描述 |
|------|------|
| 用户消息 | 黑色背景 (#000000)，白色文字，右对齐 |
| AI 消息 | 白色背景 (#ffffff)，黑色文字，左对齐 |
| Markdown 渲染 | 支持 GFM（表格、列表、链接、粗体、斜体等） |
| 代码块 | 黑色背景 + 灰色边框，等宽字体 |
| 时间戳 | 灰色小字显示相对时间 |
| 复制按钮 | AI 消息 hover 时显示，无图标纯文字 |

#### 2.1.2 流式响应

| 功能 | 描述 |
|------|------|
| SSE 流式接收 | 实时显示 AI 响应内容，逐字输出 |
| reasoning 块 | 展示 AI 思考过程，可折叠，灰色背景 |
| tool_call 块 | 显示工具调用名称（黑色背景白字） |
| tool_result 块 | 显示工具执行结果，可折叠 |
| typing indicator | AI 响应时显示 "思考中..." 文字 |

#### 2.1.3 画布交互（通过 Tool 调用）

| 功能 | 描述 |
|------|------|
| 添加图片到画布 | 当 AI 生成图片时，通过 tool 调用将图片添加到画布 |
| 画布状态同步 | 画布状态变更不影响对话，对话状态不影响画布 |
| 独立状态管理 | 画布和对话各自独立状态，无共享状态 |

### 2.2 交互需求

| 交互 | 描述 |
|------|------|
| 发送消息 | Enter 发送，Shift+Enter 换行 |
| 自动调整输入框高度 | 根据内容自动扩展，最大 200px |
| 滚动加载 | 新消息自动滚动到底部 |
| 清空对话 | 支持清空当前对话 |
| 对话历史 | 支持切换不同对话线程 |

### 2.3 API 接口

调用 `apps/api` 的 `/api/chat` 端点：

```typescript
POST /api/chat
Content-Type: application/json

Request:
{
  "messages": [{ role: "user" | "assistant", content: string }],
  "conversationId"?: string,
  "mode": "auto" | "agent",
  "model": "deepseek/deepseek-chat" | "deepseek/deepseek-reasoner"
}

Response: SSE stream
data: { type: "reasoning", content: string }
data: { type: "text", content: string }
data: { type: "tool_call", name: string, input: string }
data: { type: "tool_result", output: string }
data: { type: "tool_error", error: string }
data: [DONE]
```

---

## 3. 技术架构

### 3.1 模块结构（完全独立于 canvas）

```
ai_draw/src/
├── features/
│   └── chat/
│       ├── components/
│       │   ├── ChatMessage.tsx      # 单条消息组件
│       │   ├── ReasoningContent.tsx # 思考过程组件
│       │   ├── ToolResultContent.tsx # 工具结果组件
│       │   └── ChatInput.tsx       # 输入框组件
│       ├── hooks/
│       │   └── useChat.ts          # 对话逻辑 Hook
│       ├── services/
│       │   └── api.ts              # API 调用服务
│       ├── types/
│       │   └── index.ts            # 类型定义
│       └── store/
│           └── index.ts             # Zustand store（独立）
```

### 3.2 状态管理

**独立的 Chat Store**，不与 Canvas Store 共享：

```typescript
interface ChatState {
  messages: Message[]
  threads: ChatThread[]
  currentThreadId: string
  isLoading: boolean
  input: string

  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  addThread: () => void
  selectThread: (id: string) => void
  setInput: (value: string) => void
}
```

### 3.3 消息类型定义

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  blocks?: MessageBlock[]
}

interface MessageBlock {
  id: string
  type: 'reasoning' | 'text' | 'tool-call' | 'tool-result'
  content?: string
  name?: string
  input?: string
  output?: string
  status?: 'running' | 'completed' | 'error'
  isCollapsed?: boolean
}

interface ChatThread {
  id: string
  title: string
  messages: Message[]
  createdAt: number
}
```

---

## 4. UI 设计

### 4.1 颜色系统（纯黑白）

```css
--chat-bg: #ffffff
--chat-user-bg: #000000
--chat-user-text: #ffffff
--chat-ai-text: #000000
--chat-muted: #71717a
--chat-border: #e4e4e7
--chat-reasoning-bg: #f4f4f5
--chat-tool-bg: #000000
--chat-tool-text: #ffffff
```

### 4.2 消息气泡样式

| 消息类型 | 样式 |
|----------|------|
| 用户消息 | 黑色背景 (#000000)，白色文字，圆角 16px，右对齐，margin-left: 60px |
| AI 消息 | 白色背景 (#ffffff)，黑色文字，圆角 16px，左对齐，margin-right: 60px |

### 4.3 布局结构

```
┌─────────────────────────────────────────┐
│  Header: 项目名称 + 折叠按钮             │
├──────────┬──────────────────────────────┤
│          │                              │
│  工具栏   │        画布区域               │
│  (左侧)   │                              │
│          │                              │
│          ├──────────────────────────────┤
│          │  右侧边栏 (AI Chat)           │
│          │  ┌────────────────────────┐  │
│          │  │ 对话下拉 / 新建按钮     │  │
│          │  ├────────────────────────┤  │
│          │  │                        │  │
│          │  │    消息列表             │  │
│          │  │    (可滚动)            │  │
│          │  │                        │  │
│          │  ├────────────────────────┤  │
│          │  │    输入框 + 发送按钮    │  │
│          │  └────────────────────────┘  │
└──────────┴──────────────────────────────┘
```

---

## 5. 实施计划

### 5.1 第一阶段：基础架构

1. 创建 `features/chat` 目录结构
2. 实现 Chat Store（独立于 Canvas）
3. 实现 API 服务层

### 5.2 第二阶段：UI 组件

1. 创建 ChatMessage 组件
2. 创建 ReasoningContent 组件
3. 创建 ToolResultContent 组件
4. 创建 ChatInput 组件

### 5.3 第三阶段：集成

1. 更新 RightSidebar 使用新组件
2. 实现流式响应
3. 实现画布交互（tool 调用）

---

## 6. 影响范围

### 6.1 新建文件

| 文件 | 用途 |
|------|------|
| `features/chat/types/index.ts` | 类型定义 |
| `features/chat/store/index.ts` | 独立 Zustand Store |
| `features/chat/services/api.ts` | API 调用服务 |
| `features/chat/hooks/useChat.ts` | 对话逻辑 Hook |
| `features/chat/components/ChatMessage.tsx` | 消息组件 |
| `features/chat/components/ReasoningContent.tsx` | 思考过程组件 |
| `features/chat/components/ToolResultContent.tsx` | 工具结果组件 |
| `features/chat/components/ChatInput.tsx` | 输入框组件 |

### 6.2 修改文件

| 文件 | 变更 |
|------|------|
| `apps/ai_draw/src/canvas/components/RightSidebar.tsx` | 使用新的 chat 组件 |
| `apps/ai_draw/package.json` | 添加依赖 |

### 6.3 新增依赖

| 依赖 | 用途 |
|------|------|
| react-markdown | Markdown 渲染 |
| remark-gfm | GitHub Flavored Markdown |
| react-syntax-highlighter | 代码高亮 |
| @types/react-syntax-highlighter | TypeScript 类型 |

---

## 7. 验收标准

1. ✅ Chat 模块完全独立于 Canvas 模块，无共享状态
2. ✅ 用户可以发送消息并收到 AI 流式响应
3. ✅ 用户消息：黑色背景，白色文字
4. ✅ AI 消息：白色背景，黑色文字
5. ✅ 无头像设计
6. ✅ Markdown 内容正确渲染
7. ✅ reasoning 思考过程可折叠展示
8. ✅ 工具调用和结果正确显示
9. ✅ 输入框支持自动高度调整
10. ✅ 新消息自动滚动到底部
11. ✅ AI 生成图片时通过 tool 调用添加到画布
