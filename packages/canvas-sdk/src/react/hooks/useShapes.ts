import { useState, useEffect } from 'react'
import type { Editor } from '../../core/Editor'
import type { ShapeProps } from '../../shapes/types'

export function useShapes(editor: Editor, filter?: (shape: ShapeProps) => boolean): ShapeProps[] {
  const [shapes, setShapes] = useState<ShapeProps[]>(() => {
    const allShapes = editor.getShapes()
    return filter ? allShapes.filter(filter) : allShapes
  })
  
  useEffect(() => {
    const updateShapes = () => {
      const allShapes = editor.getShapes()
      setShapes(filter ? allShapes.filter(filter) : allShapes)
    }
    
    updateShapes()
    
    const unsubCreate = editor.on('shape:create', updateShapes)
    const unsubUpdate = editor.on('shape:update', updateShapes)
    const unsubDelete = editor.on('shape:delete', updateShapes)
    
    return () => {
      unsubCreate()
      unsubUpdate()
      unsubDelete()
    }
  }, [editor, filter])
  
  return shapes
}
