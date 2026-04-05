'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface AspectRatioOption {
  value: string
  width: number
  height: number
  category: 'portrait' | 'landscape' | 'square'
}

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  // 方形
  { value: '1:1', width: 1024, height: 1024, category: 'square' },
  // 竖向
  { value: '2:3', width: 832, height: 1248, category: 'portrait' },
  { value: '3:4', width: 864, height: 1184, category: 'portrait' },
  { value: '4:5', width: 896, height: 1152, category: 'portrait' },
  { value: '9:16', width: 768, height: 1344, category: 'portrait' },
  // 横向
  { value: '3:2', width: 1248, height: 832, category: 'landscape' },
  { value: '4:3', width: 1184, height: 864, category: 'landscape' },
  { value: '16:9', width: 1344, height: 768, category: 'landscape' },
  { value: '21:9', width: 1536, height: 672, category: 'landscape' },
]

interface AspectRatioIconProps {
  category: 'portrait' | 'landscape' | 'square'
}

const AspectRatioIcon: React.FC<AspectRatioIconProps> = ({ category }) => {
  const maxW = 20
  const maxH = 16

  let w: number, h: number
  if (category === 'square') {
    w = h = 14
  } else if (category === 'portrait') {
    w = 12
    h = 16
  } else {
    w = 20
    h = 12
  }

  return (
    <div
      className="flex items-center justify-center bg-gray-100"
      style={{ width: maxW, height: maxH }}
    >
      <div
        className="bg-gray-400"
        style={{ width: w * 0.6, height: h * 0.6 }}
      />
    </div>
  )
}

interface AspectRatioSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const AspectRatioSelect: React.FC<AspectRatioSelectProps> = ({ value, onChange, className }) => {
  const selectedRatio = ASPECT_RATIO_OPTIONS.find((r) => r.value === value)

  const renderItem = (ratio: AspectRatioOption) => (
    <SelectItem key={ratio.value} value={ratio.value}>
      <span className="flex items-center gap-2">
        <AspectRatioIcon category={ratio.category} />
        <span className="font-mono text-xs">{ratio.value}</span>
      </span>
    </SelectItem>
  )

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedRatio ? (
            <span className="flex items-center gap-2">
              <AspectRatioIcon category={selectedRatio.category} />
              <span className="font-mono text-xs">{selectedRatio.value}</span>
            </span>
          ) : (
            <SelectValue />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[1001]">
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400 py-1">比例</SelectLabel>
          {ASPECT_RATIO_OPTIONS.filter((r) => r.category === 'square').map(renderItem)}
        </SelectGroup>
        <SelectGroup>
          <SelectItem value="__portrait__disabled__" disabled className="text-xs text-gray-400 h-7">
            竖向
          </SelectItem>
          {ASPECT_RATIO_OPTIONS.filter((r) => r.category === 'portrait').map(renderItem)}
        </SelectGroup>
        <SelectGroup>
          <SelectItem value="__landscape__disabled__" disabled className="text-xs text-gray-400 h-7">
            横向
          </SelectItem>
          {ASPECT_RATIO_OPTIONS.filter((r) => r.category === 'landscape').map(renderItem)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
