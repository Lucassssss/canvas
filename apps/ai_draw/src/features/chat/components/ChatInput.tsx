import React, { useRef, useEffect } from 'react'

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isLoading?: boolean
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, isLoading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(Math.max(textareaRef.current.scrollHeight, 52), 320)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && value.trim()) {
        onSend()
      }
    }
  }

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="输入消息..."
        disabled={isLoading}
        rows={1}
        className={`
          w-full resize-none rounded-2xl border-2 border-neutral-300 bg-white px-4 py-3 pr-14
          text-sm text-black placeholder-neutral-400
          transition-all
          focus:border-black focus:ring-2 focus:ring-black/10 focus:outline-none
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        style={{
          minHeight: '52px',
          maxHeight: '320px',
          height: 'auto',
        }}
      />
      <button
        onClick={onSend}
        disabled={isLoading || !value.trim()}
        className={`
          absolute right-2 bottom-2 p-2 rounded-xl
          transition-all
          ${value.trim() && !isLoading
            ? 'bg-black text-white hover:bg-neutral-800 cursor-pointer'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }
        `}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  )
}
