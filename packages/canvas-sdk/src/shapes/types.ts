import { Box, Vec } from '../primitives'

export interface ShapeProps {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked?: boolean
  meta?: Record<string, unknown>
}

export interface ShapeRenderContext {
  isSelected: boolean
  isEditing: boolean
  zoom: number
  editor: unknown
}
