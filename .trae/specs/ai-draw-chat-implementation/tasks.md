# Tasks: AI Chat Implementation for ai_draw

## 1. Install Dependencies

- [ ] Install required npm packages for Markdown and syntax highlighting
  - react-markdown
  - remark-gfm
  - react-syntax-highlighter
  - @types/react-syntax-highlighter (dev)

## 2. Create Chat Feature Directory Structure

- [ ] Create `src/features/chat/` directory structure
  - `src/features/chat/types/index.ts`
  - `src/features/chat/store/index.ts`
  - `src/features/chat/services/api.ts`
  - `src/features/chat/hooks/useChat.ts`
  - `src/features/chat/components/`

## 3. Create Type Definitions

- [ ] Create `features/chat/types/index.ts`
  - Message interface (id, role, content, timestamp, blocks)
  - MessageBlock interface (reasoning, text, tool-call, tool-result types)
  - ChatThread interface (id, title, messages, createdAt)

## 4. Create Independent Chat Store

- [ ] Create `features/chat/store/index.ts`
  - Zustand store with messages, threads, currentThreadId, isLoading, input
  - sendMessage function
  - clearMessages function
  - addThread function
  - selectThread function
  - setInput function
  - No sharing with canvas store

## 5. Create API Service

- [ ] Create `features/chat/services/api.ts`
  - Function to call POST /api/chat with SSE streaming
  - Parse SSE events: reasoning, text, tool_call, tool_result, tool_error
  - Return stream for consumption by useChat hook

## 6. Create useChat Hook

- [ ] Create `features/chat/hooks/useChat.ts`
  - Integrate with chat store
  - Handle streaming response parsing
  - Update messages in real-time with blocks

## 7. Create ChatMessage Component

- [ ] Create `features/chat/components/ChatMessage.tsx`
  - User message: black background, white text, right-aligned, margin-left: 60px
  - AI message: white background, black text, left-aligned, margin-right: 60px
  - No avatars
  - Copy button on hover (plain text "复制")
  - Timestamp display (relative time)
  - Markdown rendering with ReactMarkdown + remark-gfm
  - Code blocks with black background, monospace font

## 8. Create ReasoningContent Component

- [ ] Create `features/chat/components/ReasoningContent.tsx`
  - Collapsible header "AI 思考过程"
  - Gray background (#f4f4f5)
  - Monospace font for reasoning text
  - Toggle collapse/expand

## 9. Create ToolResultContent Component

- [ ] Create `features/chat/components/ToolResultContent.tsx`
  - Tool name in black badge
  - Input JSON display (collapsible)
  - Output display (collapsible)
  - Status indicator: running (spinner), completed (checkmark), error (X)

## 10. Create ChatInput Component

- [ ] Create `features/chat/components/ChatInput.tsx`
  - Auto-resizing textarea (min 52px, max 200px)
  - Black border, rounded corners
  - Enter to send, Shift+Enter for newline
  - Send button (black background, white icon)

## 11. Update RightSidebar Component

- [ ] Update `canvas/components/RightSidebar.tsx`
  - Import and use new chat components from features/chat
  - Integrate useChat hook
  - Remove old placeholder chat UI
  - Maintain existing clothing panel logic

## 12. Style Integration

- [ ] Ensure all chat components use black/white theme
  - User messages: #000000 bg, #ffffff text
  - AI messages: #ffffff bg, #000000 text
  - Reasoning: #f4f4f5 bg
  - Tool badges: #000000 bg, #ffffff text
  - No blue, no gradients, no avatars

## Task Dependencies

- Task 3 (Types) must complete before Tasks 4, 6
- Task 4 (Store) must complete before Task 6
- Task 5 (API) must complete before Task 6
- Task 6 (useChat) must complete before Task 11
- Tasks 7, 8, 9, 10 can be parallel
- Task 11 depends on Tasks 7, 8, 9, 10
- Task 12 can be parallel with Task 11
