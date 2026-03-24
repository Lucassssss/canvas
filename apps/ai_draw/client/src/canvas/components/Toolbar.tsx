import React from 'react'
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
} from 'lucide-react'
import { useCanvasStore } from '../store'
import { ToolType } from '../shapes/types'

const tools: { type: ToolType; icon: React.ReactNode; label: string; shortcut: string }[] = [
  { type: 'select', icon: <MousePointer2 size={20} />, label: '选择', shortcut: 'V' },
  { type: 'hand', icon: <Hand size={20} />, label: '手型', shortcut: 'H' },
  { type: 'pen', icon: <Pencil size={20} />, label: '画笔', shortcut: 'P' },
  { type: 'eraser', icon: <Eraser size={20} />, label: '橡皮擦', shortcut: 'E' },
  { type: 'arrow', icon: <ArrowRight size={20} />, label: '箭头', shortcut: 'A' },
  { type: 'text', icon: <Type size={20} />, label: '文本', shortcut: 'T' },
  { type: 'note', icon: <StickyNote size={20} />, label: '便签', shortcut: 'N' },
  { type: 'image', icon: <ImageIcon size={20} />, label: '图片', shortcut: 'I' },
  { type: 'shape', icon: <Square size={20} />, label: '形状', shortcut: 'S' },
]

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useCanvasStore()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const key = e.key.toLowerCase()
      const tool = tools.find((t) => t.shortcut.toLowerCase() === key)
      if (tool) {
        setActiveTool(tool.type)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveTool])

  return (
    <div className="toolbar">
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={`toolbar-btn ${activeTool === tool.type ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            setActiveTool(tool.type)
          }}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}
