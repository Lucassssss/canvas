export type SlotType = 'image' | 'text'

export type SlotRole = 'input' | 'output'

export interface SlotDefinition {
  id: string
  name: string
  type: SlotType
  role: SlotRole
  placeholder?: string
  acceptDrop?: boolean
  defaultValue?: string
  required?: boolean
}

export interface ResolutionOption {
  width: number
  height: number
  label: string
}

export interface AIConfig {
  model?: string | string[]
  promptTemplate?: string
  supportedResolutions?: ResolutionOption[]
  customConfig?: Record<string, unknown>
}

export interface CombinationType {
  id: string
  name: string
  icon?: string
  description: string
  slots: SlotDefinition[]
  aiConfig: AIConfig
}

export interface SlotContent {
  imageUrl?: string | null
  text?: string | null
  source: 'none' | 'upload' | 'canvas' | 'drag' | 'text'
}

export type AICombinationStatus = 'idle' | 'generating' | 'completed' | 'error'

export interface AICombinationShapeProps {
  id: string
  type: 'ai-combination'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  combinationTypeId: string
  slotContents: Record<string, SlotContent>
  settings: {
    prompt: string
    resolution: { width: number; height: number }
    model?: string
  }
  status: AICombinationStatus
  results: string[]
  error?: string
}

export interface ToolDefinition {
  type: string
  icon: React.ReactNode
  label: string
  shortcut: string
  combinationTypeId: string
}
