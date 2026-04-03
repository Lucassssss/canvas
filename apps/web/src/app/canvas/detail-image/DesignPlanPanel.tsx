'use client'

import React from 'react'
import {
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Sparkles,
  Download,
  Plus,
} from 'lucide-react'
import { useDetailImageStore } from './store'

// 渲染简单 Markdown（加粗、## 标题）
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2" />

    if (line.startsWith('## ')) {
      return (
        <p key={i} className="text-sm font-semibold text-neutral-800 mt-4 mb-1.5">
          {line.replace('## ', '')}
        </p>
      )
    }

    if (line.startsWith('### ')) {
      return (
        <p key={i} className="text-xs font-medium text-neutral-700 mt-2 mb-1">
          {line.replace('### ', '')}
        </p>
      )
    }

    if (line.startsWith('- ') || line.startsWith('• ')) {
      const content = line.replace(/^[-•]\s/, '')
      return (
        <div key={i} className="flex items-start gap-1.5 py-0.5">
          <span className="text-neutral-400 mt-0.5">•</span>
          <span className="text-sm text-neutral-700 leading-relaxed">{renderInline(content)}</span>
        </div>
      )
    }

    const parts = line.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={j} className="font-semibold text-neutral-800">
            {part.slice(2, -2)}
          </strong>
        )
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

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-neutral-800">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

// ───────────────────────────────────────────────
// 整体设计规范卡片
// ───────────────────────────────────────────────
const DesignSpecCard: React.FC = () => {
  const { designSpec, toggleDesignSpecExpanded, setDesignSpec } = useDetailImageStore()
  const [isEditing, setIsEditing] = React.useState(false)
  const [editValue, setEditValue] = React.useState(designSpec.content)

  const handleSave = () => {
    setDesignSpec({ content: editValue })
    setIsEditing(false)
  }

  return (
    <div className="di-plan-card">
      <div className="di-plan-card-header">
        <div className="flex items-center gap-2.5">
          <div className="di-plan-icon">
            <Sparkles size={14} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">整体设计规范</p>
            <p className="text-xs text-neutral-400">所有图片遵循的统一视觉标准</p>
          </div>
          {!isEditing && (
            <button
              className="di-icon-btn ml-1"
              onClick={() => {
                setEditValue(designSpec.content)
                setIsEditing(true)
              }}
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
        <button
          className="di-icon-btn"
          onClick={toggleDesignSpecExpanded}
        >
          {designSpec.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {designSpec.isExpanded && (
        <div className="di-plan-card-body">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="di-plan-textarea"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={10}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  className="di-btn-outline text-xs"
                  onClick={() => setIsEditing(false)}
                >
                  取消
                </button>
                <button
                  className="di-btn-primary text-xs"
                  onClick={handleSave}
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div className="di-plan-spec-content">
              <div className="di-plan-spec-border" />
              <div className="di-plan-spec-text">
                {renderMarkdown(designSpec.content)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// 图片规划条目
// ───────────────────────────────────────────────
const ImagePlanItemCard: React.FC<{ id: string; index: number }> = ({ id, index }) => {
  const { imagePlanItems, updateImagePlanItem, removeImagePlanItem, toggleImagePlanItemExpanded } =
    useDetailImageStore()

  const item = imagePlanItems.find((it) => it.id === id)
  if (!item) return null

  const [editingTitle, setEditingTitle] = React.useState(false)
  const [editingDesc, setEditingDesc] = React.useState(false)
  const [titleValue, setTitleValue] = React.useState(item.title)
  const [descValue, setDescValue] = React.useState(item.description)

  const saveTitle = () => {
    updateImagePlanItem(id, { title: titleValue })
    setEditingTitle(false)
  }

  const saveDesc = () => {
    updateImagePlanItem(id, { description: descValue })
    setEditingDesc(false)
  }

  return (
    <div className="di-plan-item">
      <div className="di-plan-item-header">
        <div className="di-plan-item-num">{index}</div>
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              autoFocus
              className="di-plan-item-input"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
            />
          ) : (
            <button
              className="di-plan-item-title"
              onClick={() => {
                setTitleValue(item.title)
                setEditingTitle(true)
              }}
            >
              {item.title}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="di-icon-btn"
            onClick={() => {
              setTitleValue(item.title)
              setEditingTitle(true)
            }}
          >
            <Pencil size={13} />
          </button>
          <button
            className="di-icon-btn text-red-400 hover:text-red-600"
            onClick={() => removeImagePlanItem(id)}
          >
            <Trash2 size={13} />
          </button>
          <button
            className="di-icon-btn"
            onClick={() => toggleImagePlanItemExpanded(id)}
          >
            {item.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {item.isExpanded && (
        <div className="di-plan-item-body">
          {editingDesc ? (
            <div className="flex flex-col gap-2">
              <textarea
                autoFocus
                className="di-plan-textarea"
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                rows={4}
                onBlur={saveDesc}
              />
            </div>
          ) : (
            <p
              className="text-sm text-neutral-600 leading-relaxed cursor-pointer hover:text-neutral-800"
              onClick={() => {
                setDescValue(item.description)
                setEditingDesc(true)
              }}
            >
              {item.description}
            </p>
          )}
        </div>
      )}

      {/* 展开时显示描述预览 */}
      {!item.isExpanded && (
        <p
          className="text-xs text-neutral-400 mt-1 px-10 leading-relaxed line-clamp-2 cursor-pointer"
          onClick={() => {
            setDescValue(item.description)
            setEditingDesc(true)
            toggleImagePlanItemExpanded(id)
          }}
        >
          {item.description}
        </p>
      )}
    </div>
  )
}

// ───────────────────────────────────────────────
// 生成完成态：结果展示
// ───────────────────────────────────────────────
const GeneratedResultPanel: React.FC = () => {
  const { generatedImages } = useDetailImageStore()

  if (generatedImages.length === 0) {
    return (
      <div className="di-plan-panel-wrap">
        <div className="di-plan-done-header">
          <div className="flex items-center gap-2.5">
            <div className="di-plan-icon-done">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.2" />
                <path d="M4.5 7l1.5 1.5L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">生成完成</p>
              <p className="text-xs text-neutral-400">所有图片已生成完成</p>
            </div>
          </div>
          <button className="di-btn-outline text-xs flex items-center gap-1.5">
            <Download size={12} />
            批量下载
          </button>
        </div>

        <div className="di-plan-placeholder">
          <div className="di-spinner-lg" />
          <p className="text-sm text-neutral-400 mt-3">图片已添加到画布</p>
        </div>
      </div>
    )
  }

  return (
    <div className="di-plan-panel-wrap">
      <div className="di-plan-done-header">
        <div className="flex items-center gap-2.5">
          <div className="di-plan-icon-done">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" fill="currentColor" opacity="0.2" />
              <path d="M4.5 7l1.5 1.5L9.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">生成完成</p>
            <p className="text-xs text-neutral-400">所有图片已生成完成</p>
          </div>
        </div>
        <button className="di-btn-outline text-xs flex items-center gap-1.5">
          <Download size={12} />
          批量下载
        </button>
      </div>

      <div className="di-result-grid">
        {generatedImages.map((url, i) => (
          <img key={i} src={url} alt={`生成图 ${i + 1}`} className="di-result-image" />
        ))}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────
// 主设计规划面板（右侧展示）
// ───────────────────────────────────────────────
export const DesignPlanPanel: React.FC = () => {
  const { step, imagePlanItems, addImagePlanItem, generatedImages } = useDetailImageStore()

  // 生成完成时展示结果
  if (step === 'done') {
    return <GeneratedResultPanel />
  }

  // 生成中
  if (step === 'generating') {
    return (
      <div className="di-plan-panel-wrap">
        <div className="di-plan-generating">
          <div className="di-plan-icon">
            <Sparkles size={14} />
          </div>
          <p className="text-sm font-medium text-neutral-800 mt-3">生成中</p>
          <p className="text-xs text-neutral-400 mt-1">AI 正在为您生成详情图...</p>
          <div className="di-generating-bar mt-4">
            <div className="di-generating-progress" />
          </div>
        </div>
      </div>
    )
  }

  // 分析中或规划确认阶段
  if (step === 'analyzing' || step === 'planning') {
    return (
      <div className="di-plan-panel-wrap">
        <div className="di-plan-panel-header">
          <div className="di-plan-icon">
            <Sparkles size={14} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              {step === 'analyzing' ? '分析中...' : '设计规划预览'}
            </p>
            <p className="text-xs text-neutral-400">
              {step === 'analyzing' ? 'AI 正在分析您的产品' : '请确认设计规范和图片规划'}
            </p>
          </div>
        </div>

        {step === 'analyzing' ? (
          <div className="di-plan-placeholder">
            <div className="di-spinner-lg" />
            <p className="text-sm text-neutral-400 mt-3">AI 正在分析产品特征...</p>
          </div>
        ) : (
          <div className="di-plan-scroll">
            {/* 整体设计规范 */}
            <DesignSpecCard />

            {/* 图片规划 */}
            <div className="di-plan-card mt-3">
              <div className="di-plan-card-header">
                <div className="flex items-center gap-2.5">
                  <div className="di-plan-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                      <circle cx="4.5" cy="4.5" r="1" fill="currentColor" />
                      <path d="M1 9.5l3-3 2.5 2.5 2-2L13 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800">图片规划</p>
                    <p className="text-xs text-neutral-400">
                      共 {imagePlanItems.length} 张图片，点击可编辑标题和描述
                    </p>
                  </div>
                </div>
              </div>

              <div className="di-plan-card-body space-y-2">
                {imagePlanItems.map((item, i) => (
                  <ImagePlanItemCard key={item.id} id={item.id} index={i + 1} />
                ))}
                <button
                  className="di-plan-add-btn"
                  onClick={addImagePlanItem}
                >
                  <Plus size={14} />
                  添加场景
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // 默认：输入阶段，右侧展示空白引导
  return (
    <div className="di-plan-panel-wrap di-plan-empty">
      <div className="di-plan-empty-content">
        <div className="di-plan-icon-lg">
          <Sparkles size={20} />
        </div>
        <p className="text-sm font-medium text-neutral-700 mt-3">AI 设计规划</p>
        <p className="text-xs text-neutral-400 mt-1 text-center leading-relaxed">
          上传产品图片并填写需求后，<br />AI 将为您生成专属设计规划
        </p>
      </div>
    </div>
  )
}
