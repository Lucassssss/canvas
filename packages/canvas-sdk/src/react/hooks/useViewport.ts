import { useState, useEffect } from 'react'
import type { Editor } from '../../core/Editor'
import type { ViewportState } from '../../core/types'

export function useViewport(editor: Editor): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(() => editor.getViewport())
  
  useEffect(() => {
    const updateViewport = () => {
      setViewport(editor.getViewport())
    }
    
    updateViewport()
    
    const unsubscribe = editor.on('viewport:change', updateViewport)
    
    return unsubscribe
  }, [editor])
  
  return viewport
}
