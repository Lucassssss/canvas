import React from 'react'
import { ShapeUtil } from '../ShapeUtil'
import type { ShapeProps, ShapeRenderContext } from '../types'

export interface EllipseShapeProps extends ShapeProps {
  type: 'ellipse'
  fill: string
  stroke: string
  strokeWidth: number
}

export class EllipseShapeUtil extends ShapeUtil<EllipseShapeProps> {
  type = 'ellipse' as const
  
  defaultProps: Partial<EllipseShapeProps> = {
    width: 100,
    height: 100,
    rotation: 0,
    opacity: 1,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
  }
  
  minSize = { minWidth: 10, minHeight: 10 }
  
  render(shape: EllipseShapeProps, _context: ShapeRenderContext): React.ReactElement {
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '100%',
        backgroundColor: shape.fill,
        border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        borderRadius: '50%',
        boxSizing: 'border-box',
      },
    })
  }
}
