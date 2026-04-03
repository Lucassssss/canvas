'use client'

import React from 'react'
import { X, RotateCcw, Sparkles } from 'lucide-react'
import { useDetailImageStore } from './store'
import { detailImageService } from './service'

// 渲染 Markdown-like 文本（加粗 ** 和 ## 标题）
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return (
        <p key={i} className="text-sm font-semibold text-neutral-800 mt-3 mb-1">
          {line.replace('## ', '')}
        </p>
      )
    }

    // 解析 **xxx** 加粗
    const parts = line.split(/(\*\*[^*]+\*\*)/g)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>
      }
      return <span key={j}>{part}</span>
    })

    return (
      <p key={i} className="text-sm text-neutral-700 leading-relaxed">
        {rendered}
      </p>
    )
  })
}

export const AIWriteModal: React.FC = () => {
  const {
    aiWriteLoading,
    aiWriteSuggestions,
    aiWriteSelectedIndex,
    productImages,
    requirementText,
    targetLanguage,
    setAIWriteSelectedIndex,
    setShowAIWriteModal,
    setAIWriteSuggestions,
    setAIWriteLoading,
    confirmAIWriteSuggestion,
  } = useDetailImageStore()

  const handleClose = () => setShowAIWriteModal(false)

  const handleRewrite = async () => {
    setAIWriteLoading(true)
    const result = await detailImageService.generateAIWriteSuggestions({
      productImageUrls: productImages,
      initialRequirement: requirementText,
      targetLanguage,
    })
    setAIWriteLoading(false)
    if (result.success && result.suggestions) {
      setAIWriteSuggestions(result.suggestions)
    }
  }

  return (
    <div className="di-modal-overlay" onClick={handleClose}>
      <div
        className="di-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="di-modal-header">
          <div className="flex items-center gap-3">
            <div className="di-modal-icon">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">AI 帮写方案选择</p>
              <p className="text-xs text-neutral-400">选择方案后可自由编辑，确认即可使用</p>
            </div>
          </div>
          <button className="di-modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* 加载态 */}
        {aiWriteLoading ? (
          <div className="di-modal-loading">
            <div className="di-spinner-lg" />
            <p className="text-sm text-neutral-500 mt-3">AI 正在生成方案...</p>
          </div>
        ) : (
          <>
            {/* 方案切换标签 */}
            {aiWriteSuggestions.length > 0 && (
              <div className="di-modal-tabs">
                <span className="text-xs text-neutral-500 mr-2">方案选择：</span>
                {aiWriteSuggestions.map((_, i) => (
                  <button
                    key={i}
                    className={`di-modal-tab ${aiWriteSelectedIndex === i ? 'active' : ''}`}
                    onClick={() => setAIWriteSelectedIndex(i)}
                  >
                    方案 {i + 1}
                  </button>
                ))}
              </div>
            )}

            {/* 方案内容 */}
            <div className="di-modal-content">
              {aiWriteSuggestions.length > 0 ? (
                <div className="di-modal-suggestion">
                  {renderMarkdown(aiWriteSuggestions[aiWriteSelectedIndex] || '')}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400 text-sm">
                  暂无方案，请点击重新帮写
                </div>
              )}
            </div>

            {/* 底部操作 */}
            <div className="di-modal-footer">
              <button
                className="di-btn-primary"
                onClick={confirmAIWriteSuggestion}
                disabled={aiWriteSuggestions.length === 0}
              >
                确认选择
              </button>
              <button
                className="di-modal-rewrite-btn"
                onClick={handleRewrite}
                disabled={aiWriteLoading}
              >
                <RotateCcw size={14} />
                重新帮写
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
