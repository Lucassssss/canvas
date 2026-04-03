'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  MousePointer2,
  Hand,
  Pencil,
  Eraser,
  ArrowRight,
  Type,
  StickyNote,
  ImageIcon,
  Square,
  Shirt,
  Sparkles,
  ChevronDown,
  Check,
  Undo2,
  Redo2,
  Plus,
  Wand2,
} from 'lucide-react'
import { useCanvasStore } from '../store'
import { useDetailImageStore } from '../detail-image/store'
import { ToolType } from '../shapes/types'
import { combinationRegistry } from '@/ai-combination/registry'
import '@/ai-combination/built-in-types'
import type { CombinationType, SlotContent } from '@/ai-combination/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const baseTools: { type: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { type: 'select', icon: <MousePointer2 size={20} />, label: '选择', shortcut: 'V' },
  { type: 'hand', icon: <Hand size={20} />, label: '手型', shortcut: 'H' },
  { type: 'pen', icon: <Pencil size={20} />, label: '画笔', shortcut: 'P' },
  { type: 'eraser', icon: <Eraser size={20} />, label: '橡皮擦', shortcut: 'E' },
  { type: 'arrow', icon: <ArrowRight size={20} />, label: '箭头', shortcut: 'A' },
  { type: 'text', icon: <Type size={20} />, label: '文本', shortcut: 'T' },
  { type: 'note', icon: <StickyNote size={20} />, label: '便签', shortcut: 'N' },
  { type: 'image', icon: <ImageIcon size={20} />, label: '图片', shortcut: 'I' },
  { type: 'shape', icon: <Square size={20} />, label: '形状', shortcut: 'S' },
  { type: 'clothing', icon: <Shirt size={20} />, label: '服装', shortcut: 'C' },
]

interface ShapeSize {
  width: number
  height: number
}

const SHAPE_SIZES: Record<string, ShapeSize> = {
  text: { width: 200, height: 50 },
  note: { width: 200, height: 150 },
  image: { width: 150, height: 150 },
  shape: { width: 200, height: 200 },
  arrow: { width: 200, height: 50 },
  pen: { width: 200, height: 200 },
  clothing: { width: 800, height: 800 },
}

const SLOT_SIZE = { width: 140, height: 180 }
const ROW_GAP = 80
const COL_GAP = 50
const START_X = 100
const START_Y = 100

let lastCreatedPosition = { x: START_X, y: START_Y }
let lastCreatedSize = { width: 200, height: 50 }

function getNextPosition(width: number, height: number): { x: number; y: number } {
  const screenWidth = window.innerWidth

  const potentialX = lastCreatedPosition.x + lastCreatedSize.width + COL_GAP

  if (potentialX + width <= screenWidth - START_X) {
    lastCreatedPosition = { x: potentialX, y: lastCreatedPosition.y }
  } else {
    const newY = lastCreatedPosition.y + lastCreatedSize.height + ROW_GAP
    lastCreatedPosition = { x: START_X, y: newY }
  }

  lastCreatedSize = { width, height }
  return { ...lastCreatedPosition }
}

function createShape(type: ToolType): void {
  const { addShape, setSelectedIds, focusOnArea } = useCanvasStore.getState()
  
  const size = SHAPE_SIZES[type] || { width: 200, height: 200 }
  const pos = getNextPosition(size.width, size.height)

  let newShape: ReturnType<typeof addShape>

  switch (type) {
    case 'text':
      newShape = addShape({
        type: 'text',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        text: '',
      })
      break

    case 'note':
      newShape = addShape({
        type: 'note',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: '#fef08a',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        text: '',
      })
      break

    case 'image':
      newShape = addShape({
        type: 'image',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        imageUrl: '',
      })
      break

    case 'shape':
      newShape = addShape({
        type: 'rect',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: '#ffffff',
        stroke: '#e4e4e7',
        strokeWidth: 1,
        opacity: 1,
      })
      break

    case 'arrow':
      newShape = addShape({
        type: 'arrow',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: '#18181b',
        strokeWidth: 2,
        opacity: 1,
      })
      break

    case 'pen':
      newShape = addShape({
        type: 'draw',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: '#18181b',
        strokeWidth: 2,
        opacity: 1,
        points: [],
      })
      break

    case 'clothing':
      newShape = addShape({
        type: 'clothing',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        clothingView: 'front',
        clothingColors: {
          body: '#191919',
          sleeveLeft: '#8C8C8E',
          sleeveRight: '#8C8C8E',
          collar: '#8C8C8E',
        },
        logoAreas: [],
        activeLogoId: undefined,
      })
      break

    default:
      return
  }

  setSelectedIds([newShape.id])
  focusOnArea(pos.x, pos.y, size.width, size.height)
}

function createAICombinationShape(categoryId: string): void {
  const { addShape, setSelectedIds, focusOnArea } = useCanvasStore.getState()
  
  const combinationType = combinationRegistry.get(categoryId)
  if (!combinationType) {
    console.warn('No combination type found')
    return
  }

  const inputCount = combinationType.slots.filter((s) => s.role === 'input').length
  const outputCount = combinationType.slots.filter((s) => s.role === 'output').length
  
  const slotWidth = SLOT_SIZE.width
  const slotHeight = SLOT_SIZE.height
  const gap = 16
  const padding = 12
  const buttonWidth = 48
  const equalWidth = 20
  
  const inputWidth = inputCount * slotWidth + (inputCount - 1) * gap
  const outputWidth = outputCount * slotWidth + (outputCount - 1) * gap
  const centerWidth = buttonWidth + equalWidth
  
  const totalWidth = inputWidth + centerWidth + outputWidth + padding * 2
  const totalHeight = slotHeight + 30 + padding * 2
  
  const pos = getNextPosition(totalWidth, totalHeight)
  
  const slotContents: Record<string, SlotContent> = {}
  combinationType.slots.forEach((slot) => {
    slotContents[slot.id] = {
      source: 'none',
      ...(slot.type === 'image' ? { imageUrl: null } : { text: null }),
    }
  })

  const defaultResolution = combinationType.aiConfig.supportedResolutions?.[0] || { width: 768, height: 1024 }

  const newId = addShape({
    type: 'ai-combination',
    x: pos.x,
    y: pos.y,
    width: totalWidth,
    height: totalHeight,
    rotation: 0,
    fill: 'transparent',
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: 1,
    combinationTypeId: categoryId,
    slotContents,
    combinationSettings: {
      prompt: combinationType.aiConfig.promptTemplate || '',
      resolution: defaultResolution,
    },
    combinationStatus: 'idle',
    combinationResults: [],
    resizable: false,
    rotatable: false,
  })
  
  setSelectedIds([newId.id])
  focusOnArea(pos.x, pos.y, totalWidth, totalHeight)
}

function createCustomCombination(): void {
  const { addShape, setSelectedIds, focusOnArea } = useCanvasStore.getState()

  const slotWidth = 140
  const slotHeight = 180
  const gap = 12
  const addButtonSize = 32
  const padding = 24

  const inputSlots = [{ id: `input-${Date.now()}`, label: '输入1', imageUrl: undefined }]
  const outputSlots = [{ id: `output-${Date.now()}`, label: '输出', imageUrl: undefined }]

  const inputWidth = slotWidth + gap + addButtonSize
  const totalWidth = padding * 2 + inputWidth
  const totalHeight = slotHeight + 100 + 200

  const pos = getNextPosition(totalWidth, totalHeight)

  const newId = addShape({
    type: 'custom-combination',
    x: pos.x,
    y: pos.y,
    width: totalWidth,
    height: totalHeight,
    rotation: 0,
    fill: 'transparent',
    stroke: 'transparent',
    strokeWidth: 0,
    opacity: 1,
    customInputSlots: inputSlots,
    customOutputSlots: outputSlots,
    customConfig: {
      model: 'flux-pro',
      resolution: { width: 1024, height: 1024 },
      prompt: '',
    },
    customStatus: 'idle',
    resizable: false,
    rotatable: false,
  })

  setSelectedIds([newId.id])
  focusOnArea(pos.x, pos.y, totalWidth, totalHeight)
}

// 详情图生成按钮
const DetailImageButton: React.FC = () => {
  const { openDetailImage } = useDetailImageStore()

  return (
    <button
      className="toolbar-btn"
      onClick={() => openDetailImage()}
      title="详情图生成"
    >
      <Wand2 size={20} />
    </button>
  )
}

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool, activeAICategory, setActiveAICategory, undo, redo, historyIndex, history } = useCanvasStore()
  const [aiTypes, setAITypes] = useState<CombinationType[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  useEffect(() => {
    setAITypes(combinationRegistry.getAll())

    const unsubscribe = combinationRegistry.subscribe(() => {
      setAITypes(combinationRegistry.getAll())
    })

    return unsubscribe
  }, [])

  const handleAITypeSelect = useCallback((typeId: string) => {
    setActiveAICategory(typeId)
    setDropdownOpen(false)
    createAICombinationShape(typeId)
  }, [setActiveAICategory])

  const handleBaseToolClick = useCallback((type: ToolType) => {
    if (type === 'select' || type === 'hand' || type === 'pen' || type === 'eraser') {
      setActiveTool(type)
    } else {
      createShape(type)
    }
  }, [setActiveTool])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          canRedo && redo()
        } else {
          canUndo && undo()
        }
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        canRedo && redo()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        useCanvasStore.getState().duplicateSelectedShapes()
        return
      }

      const key = e.key.toLowerCase()
      const baseTool = baseTools.find((t) => t.shortcut.toLowerCase() === key)
      if (baseTool) {
        e.preventDefault()
        handleBaseToolClick(baseTool.type)
        return
      }

      if (key === 'u' && aiTypes.length > 0) {
        if (activeAICategory) {
          createAICombinationShape(activeAICategory)
        } else {
          handleAITypeSelect(aiTypes[0].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool, aiTypes, activeAICategory, handleAITypeSelect, handleBaseToolClick, undo, redo, canUndo, canRedo])

  const isAIToolActive = activeTool === 'ai-combination'

  return (
    <div className="toolbar">
      {baseTools.map((tool) => (
        <button
          key={tool.type}
          className={`toolbar-btn ${activeTool === tool.type ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            handleBaseToolClick(tool.type)
          }}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.icon}
        </button>
      ))}

      {aiTypes.length > 0 && (
        <>
          <div className="toolbar-divider" />
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`toolbar-btn ${isAIToolActive ? 'active' : ''}`}
                title="AI组件"
              >
                <Sparkles size={20} />
                <ChevronDown size={12} className="ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56"
            >
              {aiTypes.map((type) => (
                <DropdownMenuItem
                  key={type.id}
                  onSelect={() => handleAITypeSelect(type.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span>{type.name}</span>
                    <span className="text-xs text-muted-foreground">{type.description}</span>
                  </div>
                  {activeAICategory === type.id && <Check size={14} />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setDropdownOpen(false)
                  createCustomCombination()
                }}
                className="flex items-center gap-2 text-blue-600"
              >
                <Plus size={14} />
                <span>创建自定义组合</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}

      <div className="toolbar-divider" />

      <DetailImageButton />

      <div className="toolbar-divider" />

      <button
        className={`toolbar-btn ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => canUndo && undo()}
        disabled={!canUndo}
        title="撤销 (Ctrl+Z)"
      >
        <Undo2 size={20} />
      </button>

      <button
        className={`toolbar-btn ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => canRedo && redo()}
        disabled={!canRedo}
        title="重做 (Ctrl+Y)"
      >
        <Redo2 size={20} />
      </button>
    </div>
  )
}
