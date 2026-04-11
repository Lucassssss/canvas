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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DIMENSIONS } from '../constants/dimensions'

const baseTools: { type: ToolType; icon: React.ReactNode; label: string; shortcut: string; requiresAlt?: boolean }[] = [
  { type: 'select', icon: <MousePointer2 size={20} />, label: '选择', shortcut: 'V' },
  { type: 'hand', icon: <Hand size={20} />, label: '移动画布', shortcut: 'H' },
  { type: 'pen', icon: <Pencil size={20} />, label: '画笔', shortcut: 'P', requiresAlt: true },
  { type: 'eraser', icon: <Eraser size={20} />, label: '橡皮擦', shortcut: 'E', requiresAlt: true },
  { type: 'arrow', icon: <ArrowRight size={20} />, label: '箭头', shortcut: 'A', requiresAlt: true },
  { type: 'text', icon: <Type size={20} />, label: '文本', shortcut: 'T', requiresAlt: true },
  { type: 'note', icon: <StickyNote size={20} />, label: '便签', shortcut: 'N', requiresAlt: true },
  { type: 'image', icon: <ImageIcon size={20} />, label: '图片', shortcut: 'I', requiresAlt: true },
  { type: 'shape', icon: <Square size={20} />, label: '形状', shortcut: 'S', requiresAlt: true },
  { type: 'clothing', icon: <Shirt size={20} />, label: '服装', shortcut: 'C', requiresAlt: true },
  { type: 'detail-image', icon: <Wand2 size={20} />, label: '详情图', shortcut: 'D', requiresAlt: true },
]

interface ShapeSize {
  width: number
  height: number
}

const SHAPE_SIZES: Record<string, ShapeSize> = {
  text: DIMENSIONS.TEXT,
  note: DIMENSIONS.NOTE,
  image: DIMENSIONS.IMAGE,
  shape: DIMENSIONS.SHAPE,
  arrow: DIMENSIONS.TEXT,
  pen: DIMENSIONS.SHAPE,
  clothing: DIMENSIONS.CLOTHING,
  'detail-image': DIMENSIONS.DETAIL_IMAGE,
}

function getSmartSpawnPosition(width: number, height: number): { x: number; y: number } {
  const state = useCanvasStore.getState()
  const { shapes, selectedIds } = state

  if (selectedIds.length > 0) {
    const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id))
    if (selectedShapes.length > 0) {
      const minX = Math.min(...selectedShapes.map((s) => s.x))
      const maxY = Math.max(...selectedShapes.map((s) => s.y + s.height))
      return { x: minX, y: maxY + DIMENSIONS.COMBINATION.CREATE_GAP }
    }
  }

  // Fallback to viewport center
  const sidebarWidth = 320
  const topOffset = 56
  
  const screenCenterX = (window.innerWidth - sidebarWidth) / 2
  const screenCenterY = (window.innerHeight - topOffset) / 2

  const canvasPt = state.screenToCanvas(screenCenterX, screenCenterY)
  
  return {
    x: canvasPt.x - width / 2,
    y: canvasPt.y - height / 2
  }
}

function ensureVisible(x: number, y: number, width: number, height: number): void {
  const state = useCanvasStore.getState()
  const { viewport, setViewport, canvasToScreen } = state
  
  const bottomScreenTarget = canvasToScreen(x, y + height)
  
  const bottomOffset = 80
  const screenBottom = window.innerHeight - bottomOffset
  
  if (bottomScreenTarget.y > screenBottom) {
    const overflowDiff = bottomScreenTarget.y - screenBottom
    setViewport({ y: viewport.y - overflowDiff }) 
  }
}

function createShape(type: ToolType): void {
  const { addShape, setSelectedIds } = useCanvasStore.getState()
  
  const size = SHAPE_SIZES[type] || DIMENSIONS.SHAPE
  const pos = getSmartSpawnPosition(size.width, size.height)
  ensureVisible(pos.x, pos.y, size.width, size.height)

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

    case 'detail-image':
      newShape = addShape({
        type: 'detail-image',
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        rotation: 0,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        imageConfig: {
          model: 'gemini-3-pro-image-preview',
          resolution: '2K' as const,
          aspectRatio: '3:4',
          count: 1,
          prompt: '',
        },
        resizable: true,
        rotatable: false,
      })
      break

    default:
      return
  }

  setSelectedIds([newShape.id])
}

function createAICombinationShape(categoryId: string): void {
  const { addShape, setSelectedIds } = useCanvasStore.getState()
  
  const combinationType = combinationRegistry.get(categoryId)
  if (!combinationType) {
    console.warn('No combination type found')
    return
  }

  const inputCount = combinationType.slots.filter((s) => s.role === 'input').length
  const outputCount = combinationType.slots.filter((s) => s.role === 'output').length
  
  const slotWidth = DIMENSIONS.SLOT.width
  const slotHeight = DIMENSIONS.SLOT.height
  const gap = DIMENSIONS.COMBINATION.GAP
  const padding = DIMENSIONS.COMBINATION.PADDING
  const buttonWidth = 48
  const equalWidth = 20
  
  const inputWidth = inputCount * slotWidth + (inputCount - 1) * gap
  const outputWidth = outputCount * slotWidth + (outputCount - 1) * gap
  const centerWidth = buttonWidth + equalWidth
  
  const totalWidth = inputWidth + centerWidth + outputWidth + padding * 2
  const totalHeight = slotHeight + 30 + padding * 2
  
  const pos = getSmartSpawnPosition(totalWidth, totalHeight)
  ensureVisible(pos.x, pos.y, totalWidth, totalHeight)
  
  const slotContents: Record<string, SlotContent> = {}
  combinationType.slots.forEach((slot) => {
    slotContents[slot.id] = {
      source: 'none',
      ...(slot.type === 'image' ? { imageUrl: null } : { text: null }),
    }
  })

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
    combinationStatus: 'idle',
    combinationResults: [],
    imageConfig: {
      model: 'gemini-3-pro-image-preview',
      resolution: '2K' as const,
      aspectRatio: '1:1',
      count: 1,
      prompt: combinationType.aiConfig.promptTemplate || '',
    },
    resizable: false,
    rotatable: false,
  })
  
  setSelectedIds([newId.id])
}

function createCustomCombination(): void {
  const { addShape, setSelectedIds } = useCanvasStore.getState()

  const slotWidth = DIMENSIONS.SLOT.width
  const slotHeight = DIMENSIONS.SLOT.height
  const gap = DIMENSIONS.COMBINATION.GAP
  const padding = DIMENSIONS.COMBINATION.PADDING
  const addButtonSize = 32

  const inputSlots = [{ id: `input-${Date.now()}`, label: '输入1', imageUrl: undefined }]
  const outputSlots = [{ id: `output-${Date.now()}`, label: '输出', imageUrl: undefined }]

  const inputWidth = slotWidth + gap + addButtonSize
  const totalWidth = padding * 2 + inputWidth
  const totalHeight = slotHeight + 100 + 200

  const pos = getSmartSpawnPosition(totalWidth, totalHeight)
  ensureVisible(pos.x, pos.y, totalWidth, totalHeight)

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
    imageConfig: {
      model: 'gemini-3-pro-image-preview',
      resolution: '2K' as const,
      aspectRatio: '1:1',
      count: 1,
      prompt: '',
    },
    customStatus: 'idle',
    resizable: false,
    rotatable: false,
  })

  setSelectedIds([newId.id])
}

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool, activeAICategory, setActiveAICategory, undo, redo, historyIndex, history, isSpacePressed } = useCanvasStore()
  const [aiTypes, setAITypes] = useState<CombinationType[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const effectiveTool = isSpacePressed ? 'hand' : activeTool

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
        if (baseTool.requiresAlt && !e.altKey) {
          return
        }
        e.preventDefault()
        handleBaseToolClick(baseTool.type)
        return
      }

      if (key === 'u' && e.altKey && aiTypes.length > 0) {
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

  const isAIToolActive = effectiveTool === 'ai-combination'

  return (
    <div className="toolbar">
      {baseTools.map((tool) => (
        <Tooltip key={tool.type}>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-btn ${effectiveTool === tool.type ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                handleBaseToolClick(tool.type)
              }}
            >
              {tool.icon}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tool.label} ({tool.requiresAlt ? `Alt+${tool.shortcut}` : tool.shortcut})</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {aiTypes.length > 0 && (
        <>
          <div className="toolbar-divider" />
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`toolbar-btn ${isAIToolActive ? 'active' : ''}`}
                  >
                    <Sparkles size={20} />
                    <ChevronDown size={12} className="ml-0.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="w-42"
                >
                  {aiTypes.map((type) => (
                    <Tooltip key={type.id}>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          onSelect={() => handleAITypeSelect(type.id)}
                          className="flex items-center justify-between"
                        >
                          <span className="whitespace-nowrap">{type.name}</span>
                          {activeAICategory === type.id && <Check size={14} />}
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      {type.description && (
                        <TooltipContent side="right">
                          <p>{type.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
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
            </TooltipTrigger>
            <TooltipContent>
              <p>AI组件</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}

      <div className="toolbar-divider" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`toolbar-btn ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => canUndo && undo()}
            disabled={!canUndo}
          >
            <Undo2 size={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>撤销 (Ctrl+Z)</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={`toolbar-btn ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => canRedo && redo()}
            disabled={!canRedo}
          >
            <Redo2 size={20} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>重做 (Ctrl+Y)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
