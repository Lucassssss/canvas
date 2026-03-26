import React from 'react'
import type { ShapeProps, ShapeRenderContext } from './types'
import { Vec, Box } from '../primitives'

export interface IShapeUtil<T extends ShapeProps = ShapeProps> {
  type: string
  defaultProps: Partial<T>
  minSize: { minWidth: number; minHeight: number }
  render(shape: T, context: ShapeRenderContext): React.ReactElement | null
  renderIndicator?(shape: T, context: ShapeRenderContext): React.ReactElement | null
  hitTest?(shape: T, point: Vec): boolean
  getBounds?(shape: T): Box
  onRotate?(shape: T, rotation: number): Partial<T>
  onResize?(shape: T, bounds: Box, handle: string): Partial<T>
}

export abstract class ShapeUtil<T extends ShapeProps = ShapeProps> implements IShapeUtil<T> {
  abstract type: string
  abstract defaultProps: Partial<T>
  abstract minSize: { minWidth: number; minHeight: number }
  abstract render(shape: T, context: ShapeRenderContext): React.ReactElement | null

  renderIndicator(_shape: T, _context: ShapeRenderContext): React.ReactElement | null {
    return null
  }

  hitTest(shape: T, point: Vec): boolean {
    const bounds = this.getBounds(shape)
    return bounds.containsPoint(point)
  }

  getBounds(shape: T): Box {
    return new Box(shape.x, shape.y, shape.width, shape.height)
  }

  onRotate(_shape: T, rotation: number): Partial<T> {
    return { rotation } as Partial<T>
  }

  onResize(_shape: T, bounds: Box, _handle: string): Partial<T> {
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    } as Partial<T>
  }
}

export type { IShapeUtil as ShapeUtilInterface }
