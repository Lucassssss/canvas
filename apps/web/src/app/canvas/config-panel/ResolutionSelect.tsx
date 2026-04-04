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

export type Resolution = '1K' | '2K' | '4K'

export interface ResolutionOption {
  value: Resolution
  label: string
}

export const RESOLUTION_OPTIONS: ResolutionOption[] = [
  { value: '1K', label: '1K 标准' },
  { value: '2K', label: '2K 高清' },
  { value: '4K', label: '4K 超清' },
]

interface ResolutionSelectProps {
  value: Resolution
  onChange: (value: Resolution) => void
  className?: string
}

export const ResolutionSelect: React.FC<ResolutionSelectProps> = ({ value, onChange, className }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[1001]">
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400 py-1">尺寸</SelectLabel>
          {RESOLUTION_OPTIONS.map((res) => (
            <SelectItem key={res.value} value={res.value}>
              {res.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
