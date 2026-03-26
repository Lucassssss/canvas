import React, { createContext, useContext } from 'react'
import type { Editor } from '../../core/Editor'

const EditorContext = createContext<Editor | null>(null)

export interface EditorProviderProps {
  editor: Editor
  children: React.ReactNode
}

export function EditorProvider({ editor, children }: EditorProviderProps): React.ReactElement {
  return React.createElement(EditorContext.Provider, { value: editor }, children)
}

export function useEditorContext(): Editor | null {
  return useContext(EditorContext)
}

export { EditorContext }
