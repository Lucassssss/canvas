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
import { useChatModels, type ChatModel } from '../hooks/useChatModels'

const MODEL_ICONS: Record<string, string> = {
  'deepseek': '/model_provider/nano_banana.svg',
  'minimax': '/model_provider/nano_banana.svg',
  'openrouter': '/model_provider/nano_banana.svg',
  'default': '/model_provider/nano_banana.svg',
}

function getModelIcon(provider: string): string {
  return MODEL_ICONS[provider.toLowerCase()] || MODEL_ICONS['default']
}

function groupModelsByProvider(models: ChatModel[]): Record<string, ChatModel[]> {
  return models.reduce((acc, model) => {
    const provider = model.provider
    if (!acc[provider]) {
      acc[provider] = []
    }
    acc[provider].push(model)
    return acc
  }, {} as Record<string, ChatModel[]>)
}

interface ChatModelSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export const ChatModelSelect: React.FC<ChatModelSelectProps> = ({ value, onChange, disabled, className }) => {
  const { models, loading } = useChatModels()

  const groupedModels = useMemo(() => groupModelsByProvider(models), [models])

  const selectedModel = useMemo(() => {
    return models.find((m) => m.id === value)
  }, [models, value])

  React.useEffect(() => {
    if (!selectedModel && models.length > 0 && !value) {
      onChange(models[0].id)
    }
  }, [selectedModel, models, value, onChange])

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
    <Select value={selectedModel?.id || value} onValueChange={onChange} disabled={disabled}>
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
            <SelectValue placeholder="选择对话模型" />
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
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
