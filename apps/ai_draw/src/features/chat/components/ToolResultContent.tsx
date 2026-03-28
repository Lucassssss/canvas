import React, { useState } from 'react'
import type { MessageBlock } from '../types'

interface ToolResultContentProps {
  block: MessageBlock
}

export const ToolResultContent: React.FC<ToolResultContentProps> = ({ block }) => {
  const [inputCollapsed, setInputCollapsed] = useState(true)
  const [outputCollapsed, setOutputCollapsed] = useState(false)

  const formatJson = (str: string | undefined): string => {
    if (!str) return ''
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200">
      <div className="flex items-center gap-2 px-3 py-2 bg-black text-white text-sm">
        <span className="font-medium">{block.name || 'Tool'}</span>
        <span className="text-neutral-400">•</span>
        {block.status === 'running' && (
          <span className="text-neutral-400">运行中...</span>
        )}
        {block.status === 'completed' && (
          <span className="text-neutral-400">✓</span>
        )}
        {block.status === 'error' && (
          <span className="text-red-400">✗</span>
        )}
      </div>

      {block.input && (
        <div className="border-t border-neutral-200">
          <button
            onClick={() => setInputCollapsed(!inputCollapsed)}
            className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm text-neutral-600"
          >
            <span>输入</span>
            <span className={`transform transition-transform ${inputCollapsed ? '' : 'rotate-180'}`}>
              ▼
            </span>
          </button>
          {!inputCollapsed && (
            <pre className="px-3 py-2 bg-neutral-900 text-neutral-300 font-mono text-xs overflow-x-auto border-t border-neutral-200">
              {formatJson(block.input)}
            </pre>
          )}
        </div>
      )}

      {block.output && (
        <div className="border-t border-neutral-200">
          <button
            onClick={() => setOutputCollapsed(!outputCollapsed)}
            className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm text-neutral-600"
          >
            <span>输出</span>
            <span className={`transform transition-transform ${outputCollapsed ? '' : 'rotate-180'}`}>
              ▼
            </span>
          </button>
          {!outputCollapsed && (
            <pre className="px-3 py-2 bg-neutral-900 text-neutral-300 font-mono text-xs overflow-x-auto border-t border-neutral-200">
              {formatJson(block.output)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
