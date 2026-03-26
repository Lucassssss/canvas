import { useState, useEffect } from 'react'
import type { Editor } from '../../core/Editor'
import type { ShapeProps } from '../../shapes/types'

export function useSelection(editor: Editor): {
  selectedIds: string[]
  selectedShapes: ShapeProps[]
} {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => editor.getSelectedIds())
  const [selectedShapes, setSelectedShapes] = useState<ShapeProps[]>(() => editor.getSelectedShapes())
  
  useEffect(() => {
    const updateSelection = () => {
      setSelectedIds(editor.getSelectedIds())
      setSelectedShapes(editor.getSelectedShapes())
    }
    
    updateSelection()
    
    const unsubscribe = editor.on('selection:change', updateSelection)
    
    return unsubscribe
  }, [editor])
  
  return { selectedIds, selectedShapes }
}
