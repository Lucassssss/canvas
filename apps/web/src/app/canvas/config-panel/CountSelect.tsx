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

export type Count = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface CountOption {
  value: Count
  label: string
}

export const COUNT_OPTIONS: CountOption[] = [
  { value: 1, label: '1 张' },
  { value: 2, label: '2 张' },
  { value: 3, label: '3 张' },
  { value: 4, label: '4 张' },
  { value: 5, label: '5 张' },
  { value: 6, label: '6 张' },
  { value: 7, label: '7 张' },
  { value: 8, label: '8 张' },
  { value: 9, label: '9 张' },
  { value: 10, label: '10 张' },
]

interface CountSelectProps {
  value: Count
  onChange: (value: Count) => void
  className?: string
}

export const CountSelect: React.FC<CountSelectProps> = ({ value, onChange, className }) => {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v) as Count)}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="z-[1001]">
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400 py-1">张数</SelectLabel>
          {COUNT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
