import React, { useState, memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { ReasoningContent } from './ReasoningContent'
import { ToolResultContent } from './ToolResultContent'
import type { Message } from '../types'
import { getOptimizedImageUrl } from '@/app/canvas/utils/imageOptimization'

function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`

  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

interface ChatMessageProps {
  message: Message
  isStreaming?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const darkStyle: any = oneDark

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const match = /language-(\w+)/.exec(className || '')
  const inline = !match

  if (inline) {
    return (
      <code className="px-1 py-0.5 bg-neutral-100 rounded text-sm font-mono text-black">
        {children}
      </code>
    )
  }

  return (
    <SyntaxHighlighter
      style={darkStyle}
      language={match?.[1] || 'text'}
      PreTag="div"
      className="rounded text-sm my-3 overflow-x-scroll w-full max-w-full"
      customStyle={{
        margin: 0,
        padding: '1rem',
        borderRadius: '4px',
        background: '#1a1a1a',
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

export const ChatMessage = memo(function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = message.blocks
      ?.filter((b) => b.type === 'text' || b.type === 'reasoning')
      .map((b) => b.content)
      .join('\n') || message.content
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start w-full'}>
      <div
        className={`flex gap-2 max-w-full min-w-0 ${
          isUser ? 'flex-row-reverse max-w-[90%]' : 'w-full'
        }`}
      >
        <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`group relative min-w-0 max-w-full rounded ${
              isUser
                // ? 'bg-black text-white px-4 py-3'
                ? ''
                : 'bg-white'
            }`}
          >
            {isUser ? (
              <div className="flex flex-col gap-1.5 items-end">
                {message.images && message.images.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {message.images.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={getOptimizedImageUrl(url, 200)} 
                        alt={`参考图 ${idx + 1}`} 
                        className="w-14 h-14 object-cover rounded-md shadow-sm border border-neutral-200 bg-white" 
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words overflow-hidden bg-black text-white px-3 py-2 text-sm rounded-lg rounded-tr-md">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="space-y-3 min-w-0 w-full">
                {message.blocks && message.blocks.length > 0 ? (
                  message.blocks.map((block) => {
                    if (block.type === 'reasoning') {
                      return (
                        <ReasoningContent
                          key={block.id}
                          block={block}
                        />
                      )
                    }
                    if (block.type === 'tool-call' || block.type === 'tool-result') {
                      return (
                        <ToolResultContent
                          key={block.id}
                          block={block}
                        />
                      )
                    }
                    if (block.type === 'text') {
                      return (
                        <div key={block.id} className="leading-relaxed min-w-0 w-full">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code(props) {
                                const { className, children } = props
                                return <CodeBlock className={className}>{children}</CodeBlock>
                              },
                              p({ children }) {
                                return <p className="mb-2 last:mb-0 text-sm text-black">{children}</p>
                              },
                              ul({ children }) {
                                return <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-black">{children}</ul>
                              },
                              ol({ children }) {
                                return <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-black">{children}</ol>
                              },
                              li({ children }) {
                                return <li className="mb-0.5 text-black">{children}</li>
                              },
                              h1({ children }) {
                                return <h1 className="text-lg font-semibold mb-2 mt-3 text-black">{children}</h1>
                              },
                              h2({ children }) {
                                return <h2 className="text-base font-semibold mb-2 mt-2 text-black">{children}</h2>
                              },
                              h3({ children }) {
                                return <h3 className="font-semibold mb-1 mt-2 text-black">{children}</h3>
                              },
                              a({ href, children }) {
                                return (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 text-black"
                                  >
                                    {children}
                                  </a>
                                )
                              },
                              blockquote({ children }) {
                                return (
                                  <blockquote className="border-l-2 border-neutral-300 pl-3 italic text-neutral-600 my-2">
                                    {children}
                                  </blockquote>
                                )
                              },
                              hr() {
                                return <hr className="my-3 border-neutral-200" />
                              },
                              table({ children }) {
                                return (
                                  <div className="overflow-x-auto my-3">
                                    <table className="min-w-full border border-neutral-200 rounded text-sm">
                                      {children}
                                    </table>
                                  </div>
                                )
                              },
                              th({ children }) {
                                return <th className="border border-neutral-200 px-3 py-1 text-left font-medium text-black bg-neutral-50">{children}</th>
                              },
                              td({ children }) {
                                return <td className="border border-neutral-200 px-3 py-1 text-black">{children}</td>
                              },
                              strong({ children }) {
                                return <strong className="font-semibold text-black">{children}</strong>
                              },
                              em({ children }) {
                                return <em className="italic">{children}</em>
                              },
                            }}
                          >
                            {block.content || ''}
                          </ReactMarkdown>
                        </div>
                      )
                    }
                    return null
                  })
                ) : null}

                {message.content && (
                  <div className="leading-relaxed min-w-0 w-full">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code(props) {
                          const { className, children } = props
                          return <CodeBlock className={className}>{children}</CodeBlock>
                        },
                        p({ children }) {
                          return <p className="mb-2 last:mb-0 text-sm text-black">{children}</p>
                        },
                        ul({ children }) {
                          return <ul className="list-disc list-inside mb-2 space-y-1 text-sm text-black">{children}</ul>
                        },
                        ol({ children }) {
                          return <ol className="list-decimal list-inside mb-2 space-y-1 text-sm text-black">{children}</ol>
                        },
                        li({ children }) {
                          return <li className="mb-0.5 text-black">{children}</li>
                        },
                        h1({ children }) {
                          return <h1 className="text-lg font-semibold mb-2 mt-3 text-black">{children}</h1>
                        },
                        h2({ children }) {
                          return <h2 className="text-base font-semibold mb-2 mt-2 text-black">{children}</h2>
                        },
                        h3({ children }) {
                          return <h3 className="font-semibold mb-1 mt-2 text-black">{children}</h3>
                        },
                        a({ href, children }) {
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-2 text-black"
                            >
                              {children}
                            </a>
                          )
                        },
                        blockquote({ children }) {
                          return (
                            <blockquote className="border-l-2 border-neutral-300 pl-3 italic text-neutral-600 my-2">
                              {children}
                            </blockquote>
                          )
                        },
                        hr() {
                          return <hr className="my-3 border-neutral-200" />
                        },
                        table({ children }) {
                          return (
                            <div className="overflow-x-auto my-3">
                              <table className="min-w-full border border-neutral-200 rounded text-sm">
                                {children}
                              </table>
                            </div>
                          )
                        },
                        th({ children }) {
                          return <th className="border border-neutral-200 px-3 py-1 text-left font-medium text-black bg-neutral-50">{children}</th>
                        },
                        td({ children }) {
                          return <td className="border border-neutral-200 px-3 py-1 text-black">{children}</td>
                        },
                        strong({ children }) {
                          return <strong className="font-semibold text-black">{children}</strong>
                        },
                        em({ children }) {
                          return <em className="italic">{children}</em>
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2">
              <p className={`text-xs ${isUser ? 'text-neutral-400' : 'text-neutral-400'}`}>
                {formatMessageTime(message.timestamp)}
                {isStreaming && ' · 生成中...'}
              </p>
              {!isUser && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-neutral-500 hover:text-black transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied ? '已复制' : '复制'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
