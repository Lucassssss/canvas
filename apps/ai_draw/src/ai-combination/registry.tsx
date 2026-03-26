import React from 'react'
import { Sparkles } from 'lucide-react'
import { CombinationType, ToolDefinition } from './types'

type ToolIconResolver = (iconName?: string) => React.ReactNode

const defaultIconResolver: ToolIconResolver = () => <Sparkles size={20} />

class CombinationTypeRegistry {
  private types: Map<string, CombinationType> = new Map()
  private toolDefinitions: Map<string, ToolDefinition> = new Map()
  private iconResolver: ToolIconResolver = defaultIconResolver
  private listeners: Set<() => void> = new Set()

  register(type: CombinationType): void {
    if (this.types.has(type.id)) {
      console.warn(`CombinationType ${type.id} already registered, overwriting`)
    }
    this.types.set(type.id, type)

    const toolDef: ToolDefinition = {
      type: `ai-combination-${type.id}`,
      icon: this.iconResolver(type.icon),
      label: type.name,
      shortcut: '',
      combinationTypeId: type.id,
    }
    this.toolDefinitions.set(type.id, toolDef)

    this.notifyListeners()
  }

  registerBatch(types: CombinationType[]): void {
    types.forEach((type) => this.register(type))
  }

  setIconResolver(resolver: ToolIconResolver): void {
    this.iconResolver = resolver
  }

  get(id: string): CombinationType | undefined {
    return this.types.get(id)
  }

  getAll(): CombinationType[] {
    return Array.from(this.types.values())
  }

  unregister(id: string): void {
    this.types.delete(id)
    this.toolDefinitions.delete(id)
    this.notifyListeners()
  }

  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.toolDefinitions.values())
  }

  getToolDefinition(id: string): ToolDefinition | undefined {
    return this.toolDefinitions.get(id)
  }

  getInputSlots(typeId: string) {
    const type = this.types.get(typeId)
    return type?.slots.filter((slot) => slot.role === 'input') || []
  }

  getOutputSlots(typeId: string) {
    const type = this.types.get(typeId)
    return type?.slots.filter((slot) => slot.role === 'output') || []
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }
}

export const combinationRegistry = new CombinationTypeRegistry()
