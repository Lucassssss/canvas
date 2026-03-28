# Checklist: AI Chat Implementation Verification

## Installation

- [ ] react-markdown is installed
- [ ] remark-gfm is installed
- [ ] react-syntax-highlighter is installed
- [ ] @types/react-syntax-highlighter is installed (dev)

## Directory Structure

- [ ] `features/chat/types/index.ts` exists
- [ ] `features/chat/store/index.ts` exists
- [ ] `features/chat/services/api.ts` exists
- [ ] `features/chat/hooks/useChat.ts` exists
- [ ] `features/chat/components/` directory exists

## Type Definitions

- [ ] Message interface has id, role, content, timestamp, blocks
- [ ] MessageBlock interface has reasoning, text, tool-call, tool-result types
- [ ] ChatThread interface has id, title, messages, createdAt

## Chat Store

- [ ] Store has messages state
- [ ] Store has threads state
- [ ] Store has currentThreadId state
- [ ] Store has isLoading state
- [ ] Store has input state
- [ ] sendMessage function works
- [ ] clearMessages function works
- [ ] addThread function works
- [ ] selectThread function works
- [ ] setInput function works
- [ ] Store is independent from canvas store (no shared state)

## API Service

- [ ] API service calls POST /api/chat
- [ ] SSE streaming is implemented
- [ ] reasoning events are parsed
- [ ] text events are parsed
- [ ] tool_call events are parsed
- [ ] tool_result events are parsed
- [ ] tool_error events are parsed

## useChat Hook

- [ ] Hook integrates with chat store
- [ ] Hook handles streaming responses
- [ ] Messages update in real-time
- [ ] Blocks are correctly added to messages

## ChatMessage Component

- [ ] User messages have black background (#000000)
- [ ] User messages have white text (#ffffff)
- [ ] User messages are right-aligned
- [ ] User messages have margin-left: 60px
- [ ] AI messages have white background (#ffffff)
- [ ] AI messages have black text (#000000)
- [ ] AI messages are left-aligned
- [ ] AI messages have margin-right: 60px
- [ ] No avatars displayed
- [ ] Copy button shows on hover (plain text "复制")
- [ ] Timestamp shows relative time
- [ ] Markdown content renders correctly (p, ul, ol, h1-h6, a, blockquote, hr, table)
- [ ] Code blocks render with black background
- [ ] Code blocks use monospace font

## ReasoningContent Component

- [ ] Header shows "AI 思考过程"
- [ ] Content has gray background (#f4f4f5)
- [ ] Content uses monospace font
- [ ] Can be collapsed/expanded
- [ ] Toggle icon rotates

## ToolResultContent Component

- [ ] Tool name displays in black badge
- [ ] Input JSON is formatted and collapsible
- [ ] Output is formatted and collapsible
- [ ] Status "running" shows spinner animation
- [ ] Status "completed" shows checkmark
- [ ] Status "error" shows X mark

## ChatInput Component

- [ ] Textarea auto-resizes (min 52px, max 200px)
- [ ] Border is black
- [ ] Corners are rounded
- [ ] Enter sends message
- [ ] Shift+Enter creates newline
- [ ] Send button has black background
- [ ] Send button has white icon
- [ ] Send button is disabled when input is empty
- [ ] Send button is disabled when isLoading is true

## RightSidebar Integration

- [ ] RightSidebar imports new chat components
- [ ] RightSidebar integrates useChat hook
- [ ] Old placeholder chat UI is removed
- [ ] Clothing panel logic still works
- [ ] Tab switching between chat and clothing works

## Style Verification

- [ ] All colors are black/white/gray only
- [ ] No blue or other colors in chat components
- [ ] No gradients used
- [ ] No avatars used
- [ ] Styles match existing ai_draw theme
- [ ] No breaking changes to existing layout

## Functional Verification

- [ ] User can type and send a message
- [ ] AI response streams in real-time
- [ ] Markdown renders correctly in AI responses
- [ ] Code blocks render correctly
- [ ] Reasoning blocks appear and are collapsible
- [ ] Tool calls appear during streaming
- [ ] Tool results appear after tool execution
- [ ] Conversation maintains message history
- [ ] Can switch between different chat threads
- [ ] Can create new chat threads
- [ ] Can clear current conversation

## Canvas Integration (via Tool Calls)

- [ ] AI can trigger tool calls that interact with canvas
- [ ] Tool results are displayed in chat
- [ ] Chat and canvas states remain independent
