'use client'

import React from 'react'
import { ArrowRight, BringToFront, SendToBack } from 'lucide-react'
import { ShapeProps } from '../../shapes/types'
import { useCanvasStore } from '../../store'
import { ColorPicker } from './ColorPicker'
import { StrokeConfig } from './StrokeConfig'

export const ArrowBar: React.FC<{ shape: ShapeProps }> = ({ shape }) => {
  const { updateShape, bringToFront, sendToBack } = useCanvasStore()

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium pr-2 border-r border-gray-200">
        <ArrowRight size={16} />
      </div>

      <div className="flex items-center gap-2">
        <ColorPicker
          label="颜色"
          color={shape.stroke || '#18181b'}
          onChange={(stroke) => updateShape(shape.id, { stroke })}
        />
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <StrokeConfig
          strokeWidth={shape.strokeWidth || 2}
          onChange={(strokeWidth) => updateShape(shape.id, { strokeWidth })}
        />
      </div>

      <div className="w-px h-4 bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={() => bringToFront()}
          title="置于顶层"
        >
          <BringToFront size={16} />
        </button>
        <button
          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
          onClick={() => sendToBack()}
          title="置于底层"
        >
          <SendToBack size={16} />
        </button>
      </div>
    </div>
  )
}
