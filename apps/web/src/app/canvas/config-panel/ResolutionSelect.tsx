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

export type Resolution = string

export interface ResolutionOption {
  value: Resolution
  label: string
}

interface ResolutionSelectProps {
  value: Resolution
  onChange: (value: Resolution) => void
  className?: string
  resolutions?: string[]
}

const RESOLUTION_LABELS: Record<string, string> = {
  '0.5K': '0.5K 低分辨率',
  '1K': '1K 标准',
  '2K': '2K 高清',
  '3K': '3K 超清',
  '4K': '4K 极清',
}

export const ResolutionSelect: React.FC<ResolutionSelectProps> = ({ 
  value, 
  onChange, 
  className,
  resolutions = ['1K', '2K', '4K']
}) => {
  const options: ResolutionOption[] = resolutions.map((res) => ({
    value: res,
    label: RESOLUTION_LABELS[res] || res,
  }))

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[1001]">
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400 py-1">尺寸</SelectLabel>
          {options.map((res) => (
            <SelectItem key={res.value} value={res.value}>
              {res.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
