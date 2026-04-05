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

export interface ModelOption {
  value: string
  label: string
  icon: string
}

const MODEL_ICONS: Record<string, string> = {
  'google': '/model_provider/nano_banana.svg',
  'flux': '/model_provider/flux.svg',
  'riverflow': '/model_provider/flux.svg',
  'seedream': '/model_provider/seedream_3.svg',
  'default': '/model_provider/nano_banana.svg',
}

function getModelIcon(modelValue: string): string {
  const lower = modelValue.toLowerCase()
  if (lower.includes('gemini')) return MODEL_ICONS['google']
  if (lower.includes('flux')) return MODEL_ICONS['flux']
  if (lower.includes('riverflow')) return MODEL_ICONS['riverflow']
  if (lower.includes('seedream')) return MODEL_ICONS['seedream']
  return MODEL_ICONS['default']
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    value: 'gemini-3-pro-image-preview',
    label: 'Nano Banana Pro',
    icon: 'google',
  },
  {
    value: 'gemini-3.1-flash-image-preview',
    label: 'Nano Banana 2',
    icon: 'google',
  },
  {
    value: 'gemini-2.5-flash-image',
    label: 'Nano Banana',
    icon: 'google',
  },
  {
    value: 'seedream-4.5',
    label: 'Seedream 4.5',
    icon: 'seedream',
  },
]

interface ModelSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ value, onChange, className }) => {
  const selectedModel = MODEL_OPTIONS.find((m) => m.value === value)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedModel ? (
            <span className="flex items-center gap-1.5">
              <img src={getModelIcon(selectedModel.icon)} alt="" className="w-4 h-4" />
              <span>{selectedModel.label}</span>
            </span>
          ) : (
            <SelectValue />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[1001]">
        <SelectGroup>
          <SelectLabel className="text-xs text-gray-400 py-1">模型</SelectLabel>
          {MODEL_OPTIONS.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <img src={getModelIcon(model.icon)} alt="" className="w-4 h-4" />
                <span>{model.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
