'use client'

import React, { useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useModels, type ModelConfig } from '../hooks/useModels'

const MODEL_ICONS: Record<string, string> = {
  '火山引擎': '/model_provider/seedream_3.svg',
  'OpenRouter': '/model_provider/nano_banana.svg',
  'APIMart': '/model_provider/nano_banana.svg',
  '腾讯云': '/model_provider/nano_banana.svg',
  'MiniMax': '/model_provider/nano_banana.svg',
  '本地': '/model_provider/nano_banana.svg',
  'default': '/model_provider/nano_banana.svg',
}

function getModelIcon(provider: string): string {
  return MODEL_ICONS[provider] || MODEL_ICONS['default']
}

interface ModelSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

function groupModelsByProvider(models: ModelConfig[]): Record<string, ModelConfig[]> {
  return models.reduce((acc, model) => {
    const provider = model.provider
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, ModelConfig[]>)
}

export const ModelSelect: React.FC<ModelSelectProps> = ({ value, onChange, className }) => {
  const { models, loading } = useModels()

  const groupedModels = useMemo(() => groupModelsByProvider(models), [models])

  const selectedModel = useMemo(() => {
    return models.find((m) => m.id === value || m.modelId === value)
  }, [models, value])

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="加载中..." />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {selectedModel ? (
            <span className="flex items-center gap-1.5">
              <img 
                src={getModelIcon(selectedModel.provider)} 
                alt={selectedModel.provider} 
                className="w-4 h-4" 
              />
              <span>{selectedModel.name}</span>
            </span>
          ) : (
            <SelectValue placeholder="选择模型" />
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="z-[1001] max-h-80">
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <SelectGroup key={provider}>
            <SelectLabel className="text-xs text-gray-400 py-1 flex items-center gap-1.5">
              <img src={getModelIcon(provider)} alt={provider} className="w-3.5 h-3.5" />
              {provider}
            </SelectLabel>
            {providerModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <span className="flex items-center gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded shrink-0">
                    {model.credits === 0 ? '免费' : `${model.credits}积分`}
                  </span>
                  <span>{model.name}</span>
                  {model.recommended && (
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">推荐</span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

export type { ModelConfig }
