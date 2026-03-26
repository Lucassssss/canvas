import { useContext } from 'react'
import { EditorContext } from '../context/EditorContext'
import type { Editor } from '../../core/Editor'

export function useEditor(): Editor {
  const editor = useContext(EditorContext)
  if (!editor) {
    throw new Error('useEditor must be used within an EditorProvider')
  }
  return editor
}
