'use client'

import React from 'react'
import {
  Type, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, Strikethrough, Baseline
} from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'
import { ColorPicker } from './ColorPicker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
        <Select
          value={shape.fontFamily || 'Inter'}
          onValueChange={(value) => updateShape(shape.id, { fontFamily: value } as any)}
        >
          <SelectTrigger className="h-8 px-2 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 focus:ring-offset-0 text-gray-700 w-[100px] shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top" sideOffset={12} position="popper">
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="system-ui">系统默认</SelectItem>
            <SelectItem value="serif">衬线体</SelectItem>
            <SelectItem value="monospace">等宽字体</SelectItem>
            <SelectItem value="cursive">手写体</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(shape.fontSize || 16)}
          onValueChange={(value) => updateShape(shape.id, { fontSize: Number(value) } as any)}
        >
          <SelectTrigger className="h-8 px-2 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 focus:ring-offset-0 text-gray-700 w-[75px] shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="top" sideOffset={12} position="popper">
            {[12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map(size => (
              <SelectItem key={String(size)} value={String(size)}>{size}px</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center ml-1" title="行高">
          <Baseline size={16} className="text-gray-500 mr-1" />
          <Select
            value={String(shape.lineHeight || 1.2)}
            onValueChange={(value) => updateShape(shape.id, { lineHeight: Number(value) } as any)}
          >
            <SelectTrigger className="h-8 px-2 text-sm bg-transparent border-none rounded hover:bg-gray-100 cursor-pointer outline-none focus:ring-0 focus:ring-offset-0 text-gray-700 w-[60px] shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" sideOffset={12} position="popper">
              {[1, 1.2, 1.5, 2, 2.5].map(lh => (
                <SelectItem key={String(lh)} value={String(lh)}>{lh.toFixed(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
