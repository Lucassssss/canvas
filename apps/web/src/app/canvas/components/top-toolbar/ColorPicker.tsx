'use client'

import React, { useState } from 'react'
import { Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const PRESET_COLORS = [
  'transparent', '#191919', '#FFFFFF', '#8C8C8E', '#E53935', '#D81B60', '#8E24AA',
  '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B',
  '#43A047', '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00',
  '#F4511E', '#6D4C41', '#757575', '#546E7A', '#D32F2F', '#C62828',
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label?: string
  icon?: React.ReactNode
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label, icon }) => {
  const [customColor, setCustomColor] = useState(color !== 'transparent' ? color : '#000000')

  const isTransparent = color === 'transparent'

  const handleApply = () => {
    onChange(customColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-sm text-gray-700">
          {icon && <span className="text-gray-500">{icon}</span>}
          <div
            className={`w-4 h-4 rounded-full border border-gray-200 ${isTransparent ? 'bg-stripes' : ''}`}
            style={!isTransparent ? { backgroundColor: color } : {
              backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
              backgroundSize: '8px 8px',
              backgroundPosition: '0 0, 4px 4px'
            }}
          />
          {label && <span>{label}</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 backdrop-blur-md bg-white/90" align="start">
        <div className="grid grid-cols-6 gap-1.5 mb-3">
          {PRESET_COLORS.map((presetColor) => (
            <button
              key={presetColor}
              className={`w-7 h-7 rounded-md transition-all hover:scale-110 border border-gray-100 ${color === presetColor ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
              style={presetColor !== 'transparent' ? { backgroundColor: presetColor } : {
                backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px'
              }}
              onClick={() => {
                onChange(presetColor)
                if (presetColor !== 'transparent') setCustomColor(presetColor)
              }}
              title={presetColor === 'transparent' ? '无颜色' : presetColor}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value)
              onChange(e.target.value)
            }}
            className="w-8 h-8 rounded cursor-pointer border border-gray-200 p-0"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value)
            }}
            onBlur={() => onChange(customColor)}
            className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="#000000"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
