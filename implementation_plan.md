# AI Chat & Canvas Integration Implementation Plan

This document details the strategy for integrating the AI conversation module with the local Canvas capabilities, allowing the AI to perform complex, highly customized drawing and manipulation tasks via tool calls.

## Overview & Current Progress

- **Backend**: We currently have a functional SSE stream logic in `apps/api/src/services/llm.ts` that pipes Vercel AI SDK `fullStream` events directly to the frontend. It supports `tool-call` and `tool-result` events but only has basic tools defined in `tools/index.ts`.
- **Frontend**: The `useChatStore` (`apps/web/src/features/chat/store/index.ts`) effectively parses the SSE `tool_call` and `tool_result` events to render chat blocks. 
- **Canvas State**: The canvas state is managed on the frontend via `useCanvasStore` (`apps/web/src/app/canvas/store.ts`), containing mature APIs like `addShape`, `updateShape`, `batchUpdateShapes`, `deleteShape`, etc.

## Proposed Strategy

Because the Canvas is a client-side state but tool evaluations happen in the backend stream (`streamText`), we will use a **"Client Interception Mode"**. 

1. **Backend Tool Registration**: Register canvas manipulation tools on the backend. When the AI uses these tools, the backend `execute` function simply validates the params and returns success to satisfy the AI loop.
2. **Frontend Interception Execution**: The frontend `useChatStore` will intercept the streaming `tool_call` event and physically execute the side-effect (updating local Canvas State) locally before the backend finishes resolving the tool.

## Implementation Steps

### 1. Introduce Canvas Tool Registry (Backend)
**File**: `apps/api/src/tools/canvas.ts` (NEW), `apps/api/src/tools/index.ts` (MODIFY)

We will define structured tools using `zod` for the AI to interact with the Canvas. Example tools include:
- `canvasAddShape`: Schema includes `type` (text, image, rect, etc.), `x`, `y`, `width`, `height`, and properties.
- `canvasUpdateShape`: Modify existing capabilities by `id`. 
- `canvasRemoveShape`: Delete shapes.
- `canvasClear`: Reset canvas.
- `canvasGenerateLayout`: Complex layout generation for whole artboards.

**Action**: The `execute` function for all these tools will simply be: 
```typescript
execute: async (params) => {
   return { status: 'success', message: 'Client execution triggered.' };
}
```

### 2. Instruct the AI in Prompt (Backend)
**File**: `apps/api/src/prompts/index.ts` (MODIFY)

Extend the system prompt to give the AI context about its drawing capabilities via the new tools. Describe the coordinate system, standard colors, shape properties, and how it should format layouts.

### 3. Canvas Commander Interceptor (Frontend)
**File**: `apps/web/src/features/chat/store/index.ts` (MODIFY)

Inside `sendMessage`'s `streamChat` async iteration:
For `event.type === 'tool_call'`, we will add a secondary proxy that parses the `event.name`. If it matches our canvas tools `canvasAddShape`, etc.:
```typescript
if (event.name === 'canvasAddShape') {
    const params = JSON.parse(event.input);
    useCanvasStore.getState().addShape(params);
} else if (event.name === 'canvasUpdateShape') {
    // execute ...
}
```

### 4. Provide Visual Feedback (Frontend)
**File**: `apps/web/src/features/chat/components/ToolResultContent.tsx` (or new UI)

Ensure that when the canvas is updated via AI, the chat message UI reflects this (e.g., "🎨 Successfully added a rectangle to the canvas.").

## Open Questions
> [!IMPORTANT]
> 1. Should the AI have the ability to read the **current** canvas state before drawing? Currently, the AI context relies on memory, but to modify an existing shape it needs the `id`. We may need a mechanism to attach the current Canvas metadata (Shapes summary JSON) to the chat payload during `sendMessage`, so the AI is aware of what's already on the screen.
> 2. Are there specific highly customized drawing tools you want to prioritize first (e.g. generating specific SVG layouts, or adding predefined template shapes like 'Hero Section')?

## Verification Plan

### Automated Tests
- Validate Zod schemas for Canvas Tools.

### Manual Verification
- Start chat, say "Draw a red rectangle in the center of the canvas", and verify that the backend issues the Tool Call and the frontend successfully executes `addShape`, drawing the rectangle on the active canvas. 
