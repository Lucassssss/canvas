import React, { useState, useEffect } from 'react'
import { Send, Plus, ChevronDown, MessageSquare, ArrowRightFromLine, MessageSquarePlus, Shirt } from 'lucide-react'
import { useCanvasStore } from '../store'
import { ClothingPanel } from './ClothingPanel'

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
}

type TabType = 'chat' | 'clothing'

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [currentThreadId, setCurrentThreadId] = useState('thread-1')
  const [activeTab, setActiveTab] = useState<TabType>('chat')

  const { shapes, selectedIds } = useCanvasStore()

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  const showClothingTab = selectedClothing !== undefined

  useEffect(() => {
    if (selectedClothing && activeTab === 'chat') {
      setActiveTab('clothing')
    }
  }, [selectedClothing, activeTab])

  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      title: '新对话',
      messages: []
    },
    {
      id: 'thread-2',
      title: '设计配色方案',
      messages: [
        { id: '1', role: 'user', content: '推荐一个适合电商的设计配色', timestamp: new Date() },
        { id: '2', role: 'assistant', content: '电商设计推荐使用蓝色系配色方案...', timestamp: new Date() }
      ]
    },
    {
      id: 'thread-3',
      title: '首页布局优化',
      messages: []
    }
  ])

  const currentThread = threads.find(t => t.id === currentThreadId) || threads[0]

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setThreads(threads.map(t => {
      if (t.id === currentThreadId) {
        return { ...t, messages: [...t.messages, newMessage] }
      }
      return t
    }))
    setInput('')

    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '我来帮你设计！这个功能正在开发中...',
        timestamp: new Date()
      }
      setThreads(threads.map(t => {
        if (t.id === currentThreadId) {
          return { ...t, messages: [...t.messages, response] }
        }
        return t
      }))
    }, 1000)
  }

  const handleNewChat = () => {
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`,
      title: '新对话',
      messages: []
    }
    setThreads([newThread, ...threads])
    setCurrentThreadId(newThread.id)
    setShowHistory(false)
  }

  const handleSelectThread = (threadId: string) => {
    setCurrentThreadId(threadId)
    setShowHistory(false)
  }

  return (
    <div className={`sidebar-right ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        {showClothingTab && (
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'chat' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={14} />
              助手
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'clothing' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('clothing')}
            >
              <Shirt size={14} />
              服装
            </button>
          </div>
        )}

        {activeTab === 'chat' && !showClothingTab && (
          <div className="relative">
            <div className='flex items-center'>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="chat-header-btn"
                style={{ width: 'auto', paddingLeft: 8, paddingRight: 8, gap: 4, display: 'flex' }}
              >
                <span className="chat-header-title" style={{ maxWidth: 160 }}>{currentThread.title}</span>
                <ChevronDown size={18} />
              </button>
              <button
                onClick={handleNewChat}
                className="chat-header-btn"
                title="新建对话"
              >
                <MessageSquarePlus size={18} />
              </button>
            </div>

            {showHistory && (
              <div className="chat-history-dropdown">
                <div
                  className="chat-history-item"
                  onClick={handleNewChat}
                  style={{ color: 'var(--primary)' }}
                >
                  <span>新建对话</span>
                  <Plus size={14} />
                </div>
                {threads.map(thread => (
                  <div
                    key={thread.id}
                    className="chat-history-item"
                    onClick={() => handleSelectThread(thread.id)}
                    style={{ background: thread.id === currentThreadId ? 'var(--secondary)' : undefined }}
                  >
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {thread.title}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                      {thread.messages.length}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && !showClothingTab && (
          <button
            onClick={onClose}
            className="chat-header-btn"
            title="折叠"
          >
            <ArrowRightFromLine size={18} />
          </button>
        )}
      </div>

      {activeTab === 'clothing' && showClothingTab ? (
        <ClothingPanel />
      ) : (
        <>
          <div className="chat-messages bg-[#f4f4f5]">
            {currentThread.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <MessageSquare size={32} strokeWidth={1.5} />
                <p>你可以问我任何关于设计的问题</p>
              </div>
            ) : (
              currentThread.messages.map((msg) => (
                <div
                  key={msg.id}
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

          <div className="chat-input-container bg-[#f4f4f5]">
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
        </>
      )}
    </div>
  )
}
