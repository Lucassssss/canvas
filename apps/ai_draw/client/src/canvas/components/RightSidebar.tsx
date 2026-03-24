import React, { useState } from 'react'
import { Send } from 'lucide-react'

export const RightSidebar: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([...messages, { role: 'user', content: input }])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '我来帮你设计！这个功能正在开发中...' },
      ])
    }, 1000)
  }

  return (
    <div className="sidebar-right">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <p>你可以问我任何关于设计的问题</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-50 ml-8'
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          ))
        )}
      </div>
      <div className="chat-input-container">
        <div className="relative">
          <textarea
            className="chat-input pr-10"
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={1}
          />
          <button
            className="absolute right-2 bottom-2 p-1 text-primary hover:bg-blue-50 rounded"
            onClick={handleSend}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
