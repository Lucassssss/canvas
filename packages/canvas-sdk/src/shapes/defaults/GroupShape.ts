import React from 'react'
import { ShapeUtil } from '../ShapeUtil'
import type { ShapeProps, ShapeRenderContext } from '../types'
import { Box } from '../../primitives'

export interface GroupShapeProps extends ShapeProps {
  type: 'group'
  childIds: string[]
}

export class GroupShapeUtil extends ShapeUtil<GroupShapeProps> {
  type = 'group' as const
  
  defaultProps: Partial<GroupShapeProps> = {
    width: 100,
    height: 100,
    rotation: 0,
    opacity: 1,
    childIds: [],
  }
  
  minSize = { minWidth: 1, minHeight: 1 }
  
  render(shape: GroupShapeProps, _context: ShapeRenderContext): React.ReactElement {
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      },
      'data-group-id': shape.id,
      'data-child-ids': shape.childIds.join(','),
    })
  }
  
  getBounds(shape: GroupShapeProps): Box {
    return new Box(shape.x, shape.y, shape.width, shape.height)
  }
}
