export type EventHandler<T = unknown> = (payload: T) => void

export interface EditorEvents {
  'shape:create': { shape: unknown }
  'shape:update': { shape: unknown; prevProps: Record<string, unknown> }
  'shape:delete': { shape: unknown }
  'selection:change': { selectedIds: string[] }
  'viewport:change': { viewport: { x: number; y: number; zoom: number } }
  'viewport:zoom': { zoom: number }
  'viewport:pan': { x: number; y: number }
  'history:undo': Record<string, never>
  'history:redo': Record<string, never>
  'history:push': Record<string, never>
  'pointer:down': { x: number; y: number; target: EventTarget | null }
  'pointer:move': { x: number; y: number }
  'pointer:up': { x: number; y: number }
  'keyboard:keydown': { key: string; code: string; metaKey: boolean; shiftKey: boolean }
  'keyboard:keyup': { key: string; code: string }
  [key: string]: unknown
}

export type EditorEventName = keyof EditorEvents
export type EditorEventPayload<K extends EditorEventName> = EditorEvents[K]
