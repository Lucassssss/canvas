import React from 'react'
import { ShapeUtil } from '../ShapeUtil'
import type { ShapeProps, ShapeRenderContext } from '../types'

export interface RectangleShapeProps extends ShapeProps {
  type: 'rectangle'
  fill: string
  stroke: string
  strokeWidth: number
  borderRadius?: number
}

export class RectangleShapeUtil extends ShapeUtil<RectangleShapeProps> {
  type = 'rectangle' as const
  
  defaultProps: Partial<RectangleShapeProps> = {
    width: 100,
    height: 100,
    rotation: 0,
    opacity: 1,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    borderRadius: 0,
  }
  
  minSize = { minWidth: 10, minHeight: 10 }
  
  render(shape: RectangleShapeProps, _context: ShapeRenderContext): React.ReactElement {
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: shape.fill,
        border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        borderRadius: shape.borderRadius ? `${shape.borderRadius}px` : 0,
        boxSizing: 'border-box',
      },
    })
  }
}
