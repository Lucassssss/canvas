import React, { useEffect, useRef } from 'react'
import { Plus, ChevronDown, MessageSquare, ArrowRightFromLine, MessageSquarePlus, Shirt } from 'lucide-react'
import { useCanvasStore } from '../store'
import { ClothingPanel } from './ClothingPanel'
import { ChatMessage } from '../../features/chat/components/ChatMessage'
import { ChatInput } from '../../features/chat/components/ChatInput'
import { useChat } from '../../features/chat/hooks/useChat'

interface RightSidebarProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = 'chat' | 'clothing'

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose }) => {
  const [showHistory, setShowHistory] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<TabType>('chat')

  const { shapes, selectedIds } = useCanvasStore()
  const {
    messages,
    threads,
    currentThread,
    currentThreadId,
    isLoading,
    input,
    setInput,
    sendMessage,
    addThread,
    selectThread,
  } = useChat()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedClothing = shapes.find(
    (s) => s.type === 'clothing' && selectedIds.includes(s.id)
  )

  const showClothingTab = selectedClothing !== undefined

  useEffect(() => {
    if (selectedClothing && activeTab === 'chat') {
      setActiveTab('clothing')
    }
  }, [selectedClothing, activeTab])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    await sendMessage(input)
  }

  const handleNewChat = () => {
    addThread()
    setShowHistory(false)
  }

  const handleSelectThread = (threadId: string) => {
    selectThread(threadId)
    setShowHistory(false)
  }

  return (
    <div className={`sidebar-right ${isOpen ? 'open' : ''}`}>
      <div className="chat-header flex justify-between items-center p-3">
        {showClothingTab && (
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg mb-3">
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'chat' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageSquare size={14} />
              助手
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'clothing' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setActiveTab('clothing')}
            >
              <Shirt size={14} />
              服装
            </button>
          </div>
        )}

        {activeTab === 'chat' && !showClothingTab && (
          <div className="relative">
            <div className="flex items-center">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="chat-header-btn"
                style={{ width: 'auto', paddingLeft: 8, paddingRight: 8, gap: 4, display: 'flex' }}
              >
                <span className="chat-header-title" style={{ maxWidth: 160 }}>
                  {currentThread?.title || '新对话'}
                </span>
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
                {threads.map((thread) => (
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
          <div className="chat-messages bg-white overflow-y-auto flex-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 text-sm gap-3 px-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center">
                  <MessageSquare size={28} strokeWidth={1.5} />
                </div>
                <p className="text-center">你好，我是 AI 助手</p>
                <p className="text-center text-xs text-neutral-300">你可以问我任何关于设计的问题</p>
              </div>
            ) : (
              <div className="p-3 space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isStreaming={isLoading && msg.id === messages[messages.length - 1].id && msg.role === 'assistant'}
                  />
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-neutral-200 px-4 py-3" style={{ borderRadius: '16px' }}>
                      <p className="text-sm text-neutral-500">思考中...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="chat-input-container bg-white border-t border-neutral-200">
            <div className="p-3">
              <ChatInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                isLoading={isLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
