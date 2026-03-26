import React from 'react'
import { ShapeUtil } from '../ShapeUtil'
import type { ShapeProps, ShapeRenderContext } from '../types'

export interface TextShapeProps extends ShapeProps {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  fontWeight: string
  color: string
  textAlign: 'left' | 'center' | 'right'
  verticalAlign: 'top' | 'middle' | 'bottom'
}

export class TextShapeUtil extends ShapeUtil<TextShapeProps> {
  type = 'text' as const
  
  defaultProps: Partial<TextShapeProps> = {
    width: 200,
    height: 50,
    rotation: 0,
    opacity: 1,
    text: 'Text',
    fontSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
    verticalAlign: 'top',
  }
  
  minSize = { minWidth: 20, minHeight: 20 }
  
  render(shape: TextShapeProps, _context: ShapeRenderContext): React.ReactElement {
    const verticalAlignStyles: Record<string, string> = {
      top: 'flex-start',
      middle: 'center',
      bottom: 'flex-end',
    }
    
    return React.createElement('div', {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: verticalAlignStyles[shape.verticalAlign],
        justifyContent: shape.textAlign,
        fontSize: shape.fontSize,
        fontFamily: shape.fontFamily,
        fontWeight: shape.fontWeight,
        color: shape.color,
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        padding: '4px',
        boxSizing: 'border-box',
      },
    }, shape.text)
  }
}
