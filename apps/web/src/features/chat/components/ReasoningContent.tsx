import React, { useState } from 'react'
import type { MessageBlock } from '../types'

interface ReasoningContentProps {
  block: MessageBlock
}

export const ReasoningContent: React.FC<ReasoningContentProps> = ({ block }) => {
  const [isCollapsed, setIsCollapsed] = useState(block.isCollapsed ?? true)

  return (
    <div className="rounded-lg overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between px-3 py-2 bg-neutral-100 hover:bg-neutral-200 transition-colors text-sm text-neutral-600"
      >
        <span className="font-medium">AI 思考过程</span>
        <span className={`transform transition-transform ${isCollapsed ? '' : 'rotate-180'}`}>
          ▼
        </span>
      </button>
      {!isCollapsed && (
        <div className="p-3 bg-neutral-50 font-mono text-sm text-neutral-700 whitespace-pre-wrap border-t border-neutral-200">
          {block.content}
        </div>
      )}
    </div>
  )
}
