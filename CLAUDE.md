# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Package manager:** Bun (not npm/yarn)

```bash
# Development
bun run dev              # Start all apps (Turbo)
bun run dev:desktop      # Start electron only

# Build
bun run build            # Build all apps
bun run build:desktop    # Build electron only

# Lint
bun run lint             # Lint all apps

# Web app (apps/web)
cd apps/web && bun run dev    # Next.js dev server
cd apps/web && bun run build  # Static export

# API (apps/api)
cd apps/api && bun run dev    # Watch + run with bun
cd apps/api && bun run tsc    # Type check only

# Database (run from apps/api)
cd apps/api && bun run db:generate  # Generate Drizzle migrations
cd apps/api && bun run db:migrate   # Run migrations
cd apps/api && bun run db:push      # Push schema to DB
cd apps/api && bun run db:studio    # Open Drizzle Studio UI

# Desktop (apps/electron)
cd apps/electron && bun run dev     # Dev mode
cd apps/electron && bun run dist    # Package all platforms
```

## Architecture

**Monorepo with Turbo** — three main apps plus a shared SDK:

- `apps/web` — Next.js 16 frontend (canvas editor + chat UI)
- `apps/api` — Express + Bun backend (LLM streaming, image gen, auth, payments)
- `apps/electron` — Desktop app that bundles web output + API binary
- `packages/canvas-sdk` — Shared types/utilities

### Frontend (`apps/web`)

**State management via Zustand stores:**
- `useCanvasStore` — Canvas shapes, viewport, undo/redo history, auto-save dirty flag
- `useChatStore` — Chat messages, SSE streaming, tool call interception
- `useProjectStore` — Projects list and active project metadata
- `useAuth` — Authentication state

**Key architectural pattern — Canvas Tool Interception:**
The backend registers canvas tools (e.g. `canvasAddShape`, `canvasUpdateShape`) but their `execute()` returns success without side effects. `useChatStore` intercepts `tool_call` SSE events and executes them directly on `useCanvasStore` client-side. This keeps AI context on the backend while avoiding network round-trips for canvas mutations.

**Auto-save:** Canvas changes trigger a 2-second debounced save. The full `CanvasData` (shapes + viewport + history) is sent to the backend.

**Path alias:** `@/*` maps to `apps/web/src/*`.

### Backend (`apps/api`)

**Express server on port 3001** with these route groups:
- `/api/auth` — Phone SMS OTP + JWT cookie sessions
- `/api/chat` — Conversation CRUD + SSE streaming (`/api/chat/stream`)
- `/api/project` — Canvas data persistence
- `/api/image` — Image generation (Minimax, DALL-E, Gemini via OpenRouter)
- `/api/payment` — WeChat Pay webhooks
- `/api/credit` — Usage tracking and billing

**LLM stack:** Vercel AI SDK 6 + DeepSeek/OpenAI/OpenRouter. System prompts are loaded from markdown files in `apps/api/src/prompts/`. Tool definitions live in `apps/api/src/tools/`.

**Database:** PostgreSQL via Drizzle ORM. Schema in `apps/api/src/db/schema.ts` (tables: users, conversations, messages, projects, transactions).

### Desktop (`apps/electron`)

Bundles `apps/web/out` (static export) and `apps/api/.bin/server` (compiled binary) into an Electron 33 app. Main/preload scripts are in `apps/electron/src/`.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 16, React 19 |
| UI | Tailwind CSS 4, shadcn/ui (radix-ui) |
| State | Zustand 5 |
| Backend runtime | Bun 1.3.10 |
| Backend framework | Express.js |
| Database ORM | Drizzle + PostgreSQL |
| LLM SDK | Vercel AI SDK 6 |
| Desktop | Electron 33 |
| Build orchestration | Turbo 2.8 |
| TypeScript | 6.0 (strict) |
