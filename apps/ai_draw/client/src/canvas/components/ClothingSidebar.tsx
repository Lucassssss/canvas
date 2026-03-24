import React, { useState } from 'react'
import { useCanvasStore } from '../store'
import { ClothingView, ClothingColors } from '../shapes/types'
import { X, RotateCcw, Check } from 'lucide-react'

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
    <div className="mb-4">
      <label className="text-xs text-gray-500 mb-2 block">{label}</label>
      <div className="relative">
        <button
          className="w-full h-10 rounded-lg border-2 border-gray-200 transition-all hover:border-gray-300 hover:shadow-sm flex items-center px-3 gap-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-6 h-6 rounded-md border border-black/10"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-mono text-gray-600 flex-1 text-left">{color.toUpperCase()}</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-2 p-4 bg-white rounded-xl shadow-2xl border border-gray-100 w-64">
            <div className="grid grid-cols-6 gap-2 mb-3">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  className={`w-7 h-7 rounded-md transition-all hover:scale-110 ${color === presetColor ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
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
                className="w-10 h-10 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#000000"
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleApply}
              >
                <Check size={16} />
              </button>
            </div>
            <button
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 rounded-full shadow flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const ClothingSidebar: React.FC = () => {
  const { shapes, selectedIds, updateShape, setSelectedIds } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  if (!selectedClothing) {
    return null
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

  const handleClose = () => {
    setSelectedIds([])
  }

  return (
    <div className="clothing-sidebar">
      <div className="clothing-sidebar-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">服装设计</h3>
            <p className="text-xs text-gray-400">调整颜色和视角</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="clothing-sidebar-content">
        <div className="mb-6">
          <label className="text-xs text-gray-500 mb-3 block font-medium">视角切换</label>
          <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
            {(Object.keys(VIEW_LABELS) as ClothingView[]).map((v) => (
              <button
                key={v}
                className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => handleViewChange(v)}
              >
                {VIEW_LABELS[v]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-gray-500 font-medium">颜色填充</label>
            <button
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              onClick={resetColors}
            >
              <RotateCcw size={12} />
              重置
            </button>
          </div>
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

        <div className="pt-4 border-t border-gray-100">
          <label className="text-xs text-gray-500 mb-3 block font-medium">LOGO 区域</label>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 font-medium mb-1">点击服装上的 LOGO 区域</p>
                <p className="text-xs text-gray-400">选中服装后，点击蓝色虚线框即可放大编辑 LOGO 图案</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}