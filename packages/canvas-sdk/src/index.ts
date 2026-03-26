export { Editor } from './core/Editor'
export { Store } from './core/Store'
export { HistoryManager } from './core/History'
export type { 
  EditorOptions, 
  EditorState, 
  ViewportState, 
  HistoryEntry, 
  HistoryOptions 
} from './core/types'

export { ShapeUtil } from './shapes/ShapeUtil'
export { ShapeRegistry } from './shapes/ShapeRegistry'
export type { ShapeProps, ShapeRenderContext } from './shapes/types'

export { EventEmitter } from './events/EventEmitter'
export type { EditorEvents, EditorEventName, EditorEventPayload } from './events/types'

export { Vec, Box, Matrix } from './primitives'

export { generateId, generateUUID } from './utils/id'
export * from './utils/geometry'
export * from './utils/dom'

export { Canvas } from './react/Canvas'
export type { CanvasProps } from './react/Canvas'
export { EditorProvider, EditorContext, useEditorContext } from './react/context/EditorContext'
export { useEditor } from './react/hooks/useEditor'
export { useShape } from './react/hooks/useShape'
export { useShapes } from './react/hooks/useShapes'
export { useSelection } from './react/hooks/useSelection'
export { useViewport } from './react/hooks/useViewport'

export { createEditor } from './createEditor'
