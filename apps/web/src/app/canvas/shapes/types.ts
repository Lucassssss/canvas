import type { SlotContent } from '@/ai-combination/types'

export type ShapeType = 'rect' | 'circle' | 'text' | 'note' | 'image' | 'arrow' | 'draw' | 'clothing' | 'ai-combination'

export const SHAPE_MIN_SIZE: Record<ShapeType, { minWidth: number; minHeight: number }> = {
  rect: { minWidth: 20, minHeight: 20 },
  circle: { minWidth: 20, minHeight: 20 },
  text: { minWidth: 50, minHeight: 20 },
  note: { minWidth: 150, minHeight: 100 },
  image: { minWidth: 50, minHeight: 50 },
  arrow: { minWidth: 20, minHeight: 2 },
  draw: { minWidth: 1, minHeight: 1 },
  clothing: { minWidth: 100, minHeight: 100 },
  'ai-combination': { minWidth: 400, minHeight: 200 },
}

export type ClothingView = 'front' | 'back' | 'side'

export interface ClothingColors {
  body: string
  sleeveLeft: string
  sleeveRight: string
  collar: string
}

export interface LogoArea {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface ShapeProps {
  id: string
  type: ShapeType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  scaleX?: number
  scaleY?: number
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  text?: string
  imageUrl?: string
  points?: Array<{ x: number; y: number }>
  clothingView?: ClothingView
  clothingColors?: ClothingColors
  logoAreas?: LogoArea[]
  activeLogoId?: string
  logoContent?: Record<string, string>
  combinationTypeId?: string
  slotContents?: Record<string, SlotContent>
  combinationSettings?: {
    prompt: string
    resolution: { width: number; height: number }
  }
  combinationStatus?: 'idle' | 'generating' | 'completed' | 'error'
  combinationResults?: string[]
  combinationError?: string
  resizable?: boolean
  rotatable?: boolean
}

export interface ViewportState {
  x: number
  y: number
  zoom: number
}

export type ToolType = 'select' | 'hand' | 'pen' | 'eraser' | 'arrow' | 'text' | 'note' | 'image' | 'shape' | 'clothing' | 'ai-combination'

export interface HistoryEntry {
  shapes: ShapeProps[]
  selectedIds: string[]
}
