'use client'

import React from 'react'
import {
  Type, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Strikethrough, Baseline
} from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'
import { ColorPicker } from './ColorPicker'

export const TextBar: React.FC<{ shape: ShapeProps }> = ({ shape }) => {
  const { updateShape } = useCanvasStore()

  const isNote = shape.type === 'note'

  // Since ShapeProps didn't have these originally, verify casting is done sparingly.

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium pr-2 border-r border-gray-200">
        <Type size={16} />
        {isNote && <span className="ml-1 text-xs">便签</span>}
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker
          label={isNote ? '字体色' : '颜色'}
          color={shape.textColor || '#18181b'}
          onChange={(color) => updateShape(shape.id, { textColor: color } as any)}
        />
        
        {isNote && (
          <>
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <ColorPicker
              label="背景"
              color={shape.fill || '#fef08a'}
              onChange={(fill) => updateShape(shape.id, { fill })}
            />
          </>
        )}
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <select
          className="h-8 px-1 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 text-gray-700"
          value={shape.fontFamily || 'Inter'}
          onChange={(e) => updateShape(shape.id, { fontFamily: e.target.value } as any)}
          style={{ width: '90px' }}
        >
          <option value="Inter">Inter</option>
          <option value="system-ui">系统默认</option>
          <option value="serif">衬线体</option>
          <option value="monospace">等宽字体</option>
          <option value="cursive">手写体</option>
        </select>

        <select
          className="h-8 px-1 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 text-gray-700"
          value={shape.fontSize || 16}
          onChange={(e) => updateShape(shape.id, { fontSize: Number(e.target.value) } as any)}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        <div className="flex items-center ml-1" title="行高">
          <Baseline size={16} className="text-gray-500 mr-1" />
          <select
            className="h-8 px-1 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 text-gray-700"
            value={shape.lineHeight || 1.5}
            onChange={(e) => updateShape(shape.id, { lineHeight: Number(e.target.value) } as any)}
          >
            {[1, 1.2, 1.5, 2, 2.5].map(lh => (
              <option key={lh} value={lh}>{lh.toFixed(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          className={`p-1.5 rounded transition-colors ${shape.fontWeight === 'bold' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => updateShape(shape.id, { fontWeight: shape.fontWeight === 'bold' ? 'normal' : 'bold' } as any)}
        >
          <Bold size={16} />
        </button>
        <button
           className={`p-1.5 rounded transition-colors ${shape.fontStyle === 'italic' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => updateShape(shape.id, { fontStyle: shape.fontStyle === 'italic' ? 'normal' : 'italic' } as any)}
        >
          <Italic size={16} />
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          className={`p-1.5 rounded transition-colors ${shape.textAlign === 'left' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
           onClick={() => updateShape(shape.id, { textAlign: 'left' } as any)}
        >
          <AlignLeft size={16} />
        </button>
        <button
           className={`p-1.5 rounded transition-colors ${shape.textAlign === 'center' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
           onClick={() => updateShape(shape.id, { textAlign: 'center' } as any)}
        >
          <AlignCenter size={16} />
        </button>
        <button
           className={`p-1.5 rounded transition-colors ${shape.textAlign === 'right' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
           onClick={() => updateShape(shape.id, { textAlign: 'right' } as any)}
        >
          <AlignRight size={16} />
        </button>
      </div>
    </div>
  )
}
