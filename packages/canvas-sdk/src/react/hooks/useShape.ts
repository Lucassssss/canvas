import { useState, useEffect } from 'react'
import type { Editor } from '../../core/Editor'
import type { ShapeProps } from '../../shapes/types'

export function useShape(editor: Editor, id: string): ShapeProps | undefined {
  const [shape, setShape] = useState<ShapeProps | undefined>(() => editor.getShape(id))
  
  useEffect(() => {
    setShape(editor.getShape(id))
    
    const unsubscribe = editor.on('shape:update', (payload) => {
      const updatedShape = payload.shape as ShapeProps
      if (updatedShape.id === id) {
        setShape(updatedShape)
      }
    })
    
    return unsubscribe
  }, [editor, id])
  
  return shape
}
