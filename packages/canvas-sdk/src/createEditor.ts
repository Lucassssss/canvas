import { Editor } from './core/Editor'
import type { EditorOptions } from './core/types'
import { ShapeRegistry, registerDefaultShapes } from './shapes'

export function createEditor(options?: EditorOptions): Editor {
  const editor = new Editor(options)
  registerDefaultShapes(editor.getShapeRegistry())
  return editor
}

export { Editor } from './core/Editor'
export type { EditorOptions, EditorState, ShapeProps, ViewportState } from './core/types'
