'use client'

import React, { useState } from 'react'
import { useCanvasStore } from '../store'
import { ClothingView, ClothingColors } from '../shapes/types'
import { RotateCcw, ZoomIn, Check, X } from 'lucide-react'

const PRESET_COLORS = [
  '#191919', '#FFFFFF', '#8C8C8E', '#E53935', '#D81B60', '#8E24AA',
  '#5E35B1', '#3949AB', '#1E88E5', '#039BE5', '#00ACC1', '#00897B',
  '#43A047', '#7CB342', '#C0CA33', '#FDD835', '#FFB300', '#FB8C00',
  '#F4511E', '#6D4C41', '#757575', '#546E7A', '#D32F2F', '#C62828',
]

const VIEW_LABELS: Record<ClothingView, string> = {
  front: '前幅',
  back: '后幅',
  side: '侧幅',
}

const COLOR_LABELS: Record<keyof ClothingColors, string> = {
  body: '主体',
  sleeveLeft: '左袖',
  sleeveRight: '右袖',
  collar: '领口',
}

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [customColor, setCustomColor] = useState(color)

  const handleApply = () => {
    onChange(customColor)
    setIsOpen(false)
  }

  return (
    <div className="mb-3">
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded-lg border-2 border-gray-200 transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <span className="text-xs font-mono text-gray-600">{color.toUpperCase()}</span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="grid grid-cols-6 gap-1.5 mb-3">
            {PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${color === presetColor ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor)
                  setCustomColor(presetColor)
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border border-gray-200 rounded"
              placeholder="#000000"
            />
            <button
              className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleApply}
            >
              <Check size={14} />
            </button>
            <button
              className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const ClothingPanel: React.FC = () => {
  const { shapes, selectedIds, updateShape } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  if (!selectedClothing) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        选择服装组件以编辑
      </div>
    )
  }

  const view = selectedClothing.clothingView || 'front'
  const colors = selectedClothing.clothingColors || {
    body: '#191919',
    sleeveLeft: '#8C8C8E',
    sleeveRight: '#8C8C8E',
    collar: '#8C8C8E',
  }

  const handleViewChange = (newView: ClothingView) => {
    updateShape(selectedClothing.id, { clothingView: newView })
  }

  const handleColorChange = (key: keyof ClothingColors, newColor: string) => {
    updateShape(selectedClothing.id, {
      clothingColors: {
        ...colors,
        [key]: newColor,
      },
    })
  }

  const resetColors = () => {
    updateShape(selectedClothing.id, {
      clothingColors: {
        body: '#191919',
        sleeveLeft: '#8C8C8E',
        sleeveRight: '#8C8C8E',
        collar: '#8C8C8E',
      },
    })
  }

  return (
    <div className="p-4">
      <div className="mb-5">
        <label className="text-xs text-gray-500 mb-2 block">视角</label>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {(Object.keys(VIEW_LABELS) as ClothingView[]).map((v) => (
            <button
              key={v}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleViewChange(v)}
            >
              {VIEW_LABELS[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-gray-500">颜色</label>
          <button
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            onClick={resetColors}
          >
            <RotateCcw size={12} />
            重置
          </button>
        </div>
        <div className="relative">
          <ColorPicker
            label={COLOR_LABELS.body}
            color={colors.body}
            onChange={(c) => handleColorChange('body', c)}
          />
          <ColorPicker
            label={COLOR_LABELS.sleeveLeft}
            color={colors.sleeveLeft}
            onChange={(c) => handleColorChange('sleeveLeft', c)}
          />
          <ColorPicker
            label={COLOR_LABELS.sleeveRight}
            color={colors.sleeveRight}
            onChange={(c) => handleColorChange('sleeveRight', c)}
          />
          <ColorPicker
            label={COLOR_LABELS.collar}
            color={colors.collar}
            onChange={(c) => handleColorChange('collar', c)}
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="text-xs text-gray-500 mb-2 block">LOGO 区域</label>
        <p className="text-xs text-gray-400 mb-3">
          点击服装上的 LOGO 区域框可直接编辑
        </p>
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ZoomIn size={14} />
            <span>点击服装上的虚线区域开始编辑 LOGO</span>
          </div>
        </div>
      </div>
    </div>
  )
}
