'use client'

import React from 'react'
import {
  AlignLeft, AlignCenterHorizontal, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  Group, Ungroup, Trash2
} from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'

export const MultiActionBar: React.FC<{ selectedShapes: ShapeProps[] }> = ({ selectedShapes }) => {
  const { deleteSelectedShapes, groupShapes, ungroupShapes } = useCanvasStore()

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium pr-2 border-r border-gray-200">
        已选 {selectedShapes.length} 项
      </div>

      <div className="flex items-center gap-1">
        <button
          className="flex items-center justify-center p-1.5 px-2 rounded hover:bg-gray-100 text-gray-600 transition-colors text-sm gap-1.5"
          onClick={groupShapes}
          title="成组 (Ctrl+G)"
        >
          <Group size={16} />
          <span>成组</span>
        </button>
        <button
          className="flex items-center justify-center p-1.5 px-2 rounded hover:bg-gray-100 text-gray-600 transition-colors text-sm gap-1.5"
          onClick={ungroupShapes}
          title="打散 (Ctrl+Shift+G)"
          disabled={!selectedShapes.some(s => s.type === 'group')}
        >
          <Ungroup size={16} />
          <span>打散</span>
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="左对齐">
          <AlignLeft size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="水平居中对齐">
          <AlignCenterHorizontal size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="右对齐">
          <AlignRight size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="顶对齐">
          <AlignStartVertical size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="垂直居中对齐">
          <AlignCenterVertical size={16} />
        </button>
        <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors" title="底对齐">
          <AlignEndVertical size={16} />
        </button>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
          onClick={deleteSelectedShapes}
          title="删除所选"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}
