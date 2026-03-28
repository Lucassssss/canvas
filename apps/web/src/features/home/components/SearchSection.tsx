'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Paperclip, Send } from 'lucide-react'

export function SearchSection() {
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
        handleSearch()
      }
    }
  }

  const handleSearch = () => {
    console.log('Searching:', inputValue)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="描述你想要创建的图片，或选择下方快捷功能开始..."
          rows={4}
          className="
            w-full resize-none rounded-xl border border-neutral-200 bg-white 
            px-5 py-3.5 pr-28 shadow-sm
            text-sm text-neutral-800 placeholder-neutral-400
            transition-all
            focus:border-neutral-300 focus:ring-2 focus:ring-black/5 focus:outline-none
          "
          style={{
            minHeight: '48px',
            maxHeight: '160px',
            height: 'auto',
          }}
        />
        
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          <button
            className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-all"
            title="添加附件"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSearch}
            disabled={!inputValue.trim()}
            className={`
              p-2 rounded-lg
              transition-all
              ${inputValue.trim()
                ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
