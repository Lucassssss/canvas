import React from 'react'
import { ShapeUtil } from '../ShapeUtil'
import type { ShapeProps, ShapeRenderContext } from '../types'

export interface ImageShapeProps extends ShapeProps {
  type: 'image'
  src: string
  objectFit: 'fill' | 'contain' | 'cover' | 'none'
  borderRadius?: number
}

export class ImageShapeUtil extends ShapeUtil<ImageShapeProps> {
  type = 'image' as const
  
  defaultProps: Partial<ImageShapeProps> = {
    width: 200,
    height: 200,
    rotation: 0,
    opacity: 1,
    src: '',
    objectFit: 'cover',
  }
  
  minSize = { minWidth: 20, minHeight: 20 }
  
  render(shape: ImageShapeProps, _context: ShapeRenderContext): React.ReactElement | null {
    if (!shape.src) {
      return React.createElement('div', {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#999',
          fontSize: '12px',
          borderRadius: shape.borderRadius ? `${shape.borderRadius}px` : 0,
        },
      }, 'No Image')
    }
    
    return React.createElement('img', {
      src: shape.src,
      alt: '',
      style: {
        width: '100%',
        height: '100%',
        objectFit: shape.objectFit,
        borderRadius: shape.borderRadius ? `${shape.borderRadius}px` : 0,
        display: 'block',
      },
      draggable: false,
    })
  }
}
