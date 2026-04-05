'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'

interface ChatSectionProps {
  onSend?: (message: string) => void
}

export function ChatSection({ onSend }: ChatSectionProps) {
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [inputValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        handleSend()
      }
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      onSend?.(inputValue)
      setInputValue('')
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="描述你想要创建的图片，或选择下方快捷功能开始..."
        rows={4}
        className="
          w-full resize-none border border-neutral-300 
          px-4 py-3 pr-20 bg-white
          font-sans-zh text-sm text-neutral-800 placeholder-neutral-400
          transition-all
          focus:border-neutral-400 focus:ring-1 focus:ring-neutral-900/5 focus:outline-none focus:bg-white
          rounded-2xl
        "
        style={{
          minHeight: '52px',
          maxHeight: '160px',
          height: 'auto',
        }}
      />
      
      <div className="absolute right-3 bottom-3 flex items-center gap-2">
        <button
          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all rounded-lg"
          title="添加附件"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className={`
            p-2 rounded-lg
            transition-all
            ${inputValue.trim()
              ? 'bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }
          `}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
