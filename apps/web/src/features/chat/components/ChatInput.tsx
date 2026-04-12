import React, { useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { ArrowUp, Square } from 'lucide-react'
import { ModelSelect } from '@/app/canvas/config-panel/ModelSelect'
import { AspectRatioSelect } from '@/app/canvas/config-panel/AspectRatioSelect'
import { ResolutionSelect, type Resolution } from '@/app/canvas/config-panel/ResolutionSelect'
import { useModelsStore } from '@/app/canvas/store/models'
import { useCanvasStore } from '@/app/canvas/store'
import { Image as ImageIcon } from 'lucide-react'
import { getOptimizedImageUrl } from '@/app/canvas/utils/imageOptimization'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (options?: { model?: string, resolution?: string, aspectRatio?: string, images?: string[] }) => void
  onStop?: () => void
  isLoading?: boolean
}

let cachedModel = ''
let cachedResolution = '1K'
let cachedAspectRatio = '1:1'

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, onStop, isLoading }) => {
  const { models } = useModelsStore()
  const { shapes, selectedIds } = useCanvasStore()
  
  const [selectedModel, setSelectedModel] = React.useState(cachedModel || (models.length > 0 ? models[0].id : ''))
  const [resolution, setResolution] = React.useState<Resolution>(cachedResolution)
  const [aspectRatio, setAspectRatio] = React.useState(cachedAspectRatio)

  const selectedImages = React.useMemo(() => {
    return shapes
      .filter(s => selectedIds.includes(s.id))
      .filter(s => s.imageUrl) // 只提取带图片的 shapes
      .map(s => ({ 
        id: s.id, 
        url: getOptimizedImageUrl(s.imageUrl!, 2048), // Resize to at most 2K for AI reasoning
        name: s.imageName || '参考图' 
      }))
  }, [shapes, selectedIds])

  useEffect(() => {
    if (!selectedModel && models.length > 0) {
      setSelectedModel(models[0].id)
      cachedModel = models[0].id
    }
  }, [models, selectedModel])

  const handleModelChange = (val: string) => {
    setSelectedModel(val)
    cachedModel = val
  }
  
  const handleResolutionChange = (val: Resolution) => {
    setResolution(val)
    cachedResolution = val
  }
  
  const handleAspectRatioChange = (val: string) => {
    setAspectRatio(val)
    cachedAspectRatio = val
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && value.trim()) {
        onSend({ 
          model: selectedModel, 
          resolution, 
          aspectRatio,
          images: selectedImages.map(img => img.url)
        })
      }
    }
  }

  const handleSend = () => {
    onSend({ 
      model: selectedModel, 
      resolution, 
      aspectRatio,
      images: selectedImages.map(img => img.url)
    })
  }

  return (
    <InputGroup className="h-auto flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-black/5 !bg-white !opacity-100">
      <div className="w-full relative px-0 flex flex-col">
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
            {selectedImages.map((img) => (
              <div key={img.id} className="group relative flex items-center gap-1.5 px-2 py-1 bg-blue-50 border border-blue-100 rounded-md shadow-sm max-w-[150px]">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="text-xs text-blue-700 font-medium truncate">{img.name}</span>
              </div>
            ))}
          </div>
        )}
        <TextareaAutosize
          className={`w-full resize-none bg-transparent ${selectedImages.length > 0 ? 'py-1 mb-2' : 'py-3'} px-4 text-sm outline-none placeholder:text-gray-400 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="输入消息..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          minRows={3}
          maxRows={8}
        />
      </div>

      <InputGroupAddon align="block-end" className="w-full pt-1 pb-2 px-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            <ModelSelect
              value={selectedModel}
              onChange={handleModelChange}
              disabled={isLoading}
              className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 max-w-[150px]"
            />
            <AspectRatioSelect
              value={aspectRatio}
              onChange={handleAspectRatioChange}
              className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 w-auto min-w-[70px]"
            />
            <ResolutionSelect
              value={resolution}
              onChange={handleResolutionChange}
              className="h-8 text-sm bg-transparent border-0 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 w-auto min-w-[70px]"
            />
          </div>

          <Button
            size="sm"
            onClick={isLoading ? onStop : handleSend}
            disabled={!isLoading && !value.trim()}
            className={`shrink-0 ml-4 pb-0 h-8 w-8 px-0 rounded-full transition-all ${
              isLoading 
                ? 'bg-neutral-800 text-white hover:bg-black' 
                : value.trim() 
                  ? 'bg-black text-white hover:bg-neutral-800' 
                  : 'bg-neutral-200 text-neutral-400'
            }`}
          >
            {isLoading ? (
              <Square className="h-3 w-3 fill-current" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </InputGroupAddon>
    </InputGroup>
  )
}
