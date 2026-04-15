'use client'

import React from 'react'
import { Ungroup, Trash2 } from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'

export const GroupBar: React.FC<{ shape: ShapeProps }> = ({ shape }) => {
  const { ungroupShapes, deleteShape } = useCanvasStore()

  if (shape.type !== 'group') return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700 px-2 border-r border-gray-200">
        编组
      </span>
      <button
        className="flex items-center justify-center p-1.5 px-2 rounded hover:bg-gray-100 text-gray-600 transition-colors text-sm gap-1.5"
        onClick={ungroupShapes}
        title="打散 (Ctrl+Shift+G)"
      >
        <Ungroup size={16} />
        <span>打散</span>
      </button>

      <div className="w-px h-4 bg-gray-200 mx-1" />

      <button
        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
        onClick={() => deleteShape(shape.id)}
        title="删除所选"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
