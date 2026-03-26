import type { ShapeProps } from './types'
import type { IShapeUtil } from './ShapeUtil'
import { ShapeUtil } from './ShapeUtil'
import { generateId } from '../utils/id'

export type ShapeChangeListener = (type: string, shapeUtil: ShapeUtil) => void

export class ShapeRegistry {
  private shapeUtils: Map<string, ShapeUtil> = new Map()
  private listeners: Set<ShapeChangeListener> = new Set()

  register(shapeUtil: IShapeUtil): void {
    if (this.shapeUtils.has(shapeUtil.type)) {
      console.warn(`Shape type "${shapeUtil.type}" is already registered. It will be overwritten.`)
    }
    this.shapeUtils.set(shapeUtil.type, shapeUtil as ShapeUtil)
    this.notifyListeners(shapeUtil.type, shapeUtil as ShapeUtil)
  }

  unregister(type: string): void {
    const shapeUtil = this.shapeUtils.get(type)
    if (shapeUtil) {
      this.shapeUtils.delete(type)
      this.notifyListeners(type, shapeUtil)
    }
  }

  getShapeUtil(type: string): ShapeUtil | undefined {
    return this.shapeUtils.get(type)
  }

  hasShape(type: string): boolean {
    return this.shapeUtils.has(type)
  }

  getRegisteredTypes(): string[] {
    return Array.from(this.shapeUtils.keys())
  }

  getAllShapeUtils(): Map<string, ShapeUtil> {
    return new Map(this.shapeUtils)
  }

  clear(): void {
    this.shapeUtils.clear()
    this.listeners.clear()
  }

  subscribe(listener: ShapeChangeListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  createShape<T extends ShapeProps>(type: string, props: Partial<T>): T | null {
    const shapeUtil = this.getShapeUtil(type)
    if (!shapeUtil) {
      console.warn(`Shape type "${type}" is not registered.`)
      return null
    }

    const defaultProps = shapeUtil.defaultProps || {}
    const id = generateId(type)

    const baseShape: ShapeProps = {
      id,
      type,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      rotation: 0,
      opacity: 1,
    }

    const shape = {
      ...baseShape,
      ...defaultProps,
      ...props,
    } as T

    return shape
  }

  private notifyListeners(type: string, shapeUtil: ShapeUtil): void {
    this.listeners.forEach((listener) => {
      try {
        listener(type, shapeUtil)
      } catch (error) {
        console.error('Error in shape change listener:', error)
      }
    })
  }
}
