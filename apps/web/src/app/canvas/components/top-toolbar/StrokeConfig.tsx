'use client'

import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface StrokeConfigProps {
  strokeWidth: number
  onChange: (width: number) => void
  icon?: React.ReactNode
}

export const StrokeConfig: React.FC<StrokeConfigProps> = ({ strokeWidth, onChange, icon }) => {
  const STROKE_OPTIONS = [0, 1, 2, 4, 6, 8, 12]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
          {icon}
          <span>{strokeWidth}px</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 backdrop-blur-md bg-white/90" align="start">
        <div className="flex flex-col gap-1">
          {STROKE_OPTIONS.map((w) => (
            <button
              key={w}
              className={`flex items-center gap-3 px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors ${strokeWidth === w ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-700'}`}
              onClick={() => onChange(w)}
            >
              <div className="w-6 text-xs text-right text-gray-500">{w}px</div>
              <div className="flex-1 flex items-center h-4">
                {w === 0 ? (
                  <div className="w-full h-px border-t border-gray-300 border-dashed" />
                ) : (
                  <div className="w-full bg-current rounded-full" style={{ height: `${Math.min(w, 8)}px` }} />
                )}
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
