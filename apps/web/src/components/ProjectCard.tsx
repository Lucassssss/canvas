'use client'

import React, { useState } from 'react'
import { Plus, MoreVertical, Edit2, Trash2, MessageSquare, Check, X } from 'lucide-react'

interface Project {
  id: string
  name: string
  thumbnail?: string
  updatedAt: number
  conversationCount?: number
}

interface ProjectCardProps {
  project?: Project
  isNew?: boolean
  isCurrent?: boolean
  showMenu?: boolean
  onClick?: () => void
  onDelete?: (id: string) => void
  onRename?: (id: string, name: string) => void
  disabled?: boolean
}

export function ProjectCard({
  project,
  isNew,
  isCurrent,
  showMenu = false,
  onClick,
  onDelete,
  onRename,
  disabled,
}: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

  if (isNew) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="
          group relative aspect-[4/3] border border-dashed border-neutral-300
          hover:border-neutral-500 hover:bg-neutral-50
          transition-all bg-white
          flex flex-col items-center justify-center gap-1.5
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Plus className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
        <span className="text-[10px] text-neutral-400 group-hover:text-neutral-600 transition-colors">
          {disabled ? '创建中...' : '新建项目'}
        </span>
      </button>
    )
  }

  if (!project) return null

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    setIsEditing(true)
    setEditName(project.name)
  }

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editName.trim() && onRename) {
      onRename(project.id, editName.trim())
    }
    setIsEditing(false)
    setEditName('')
  }

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(false)
    setEditName('')
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    if (onDelete && confirm(`确定要删除项目 "${project.name}" 吗？此操作无法撤销。`)) {
      onDelete(project.id)
    }
  }

  const formatDate = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours} 小时前`
    if (days === 1) return '昨天'
    if (days < 7) return `${days} 天前`
    if (days < 30) return `${Math.floor(days / 7)} 周前`
    
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      onClick={onClick}
      className={`
        group relative aspect-[4/3] overflow-hidden
        border transition-all hover:shadow-md cursor-pointer
        flex flex-col
        ${isCurrent 
          ? 'border-neutral-400 bg-white' 
          : 'border-neutral-200 hover:border-neutral-400 bg-white'
        }
      `}
    >
      {/* 缩略图区域 */}
      <div className="flex-1 bg-neutral-50 flex items-center justify-center relative">
        {project.thumbnail ? (
          <img 
            src={project.thumbnail} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-neutral-400 text-2xl font-medium">
            {project.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* 当前项目标记 */}
        {isCurrent && (
          <div className="absolute top-2 left-2">
            <div className="px-2 py-0.5 bg-neutral-900 text-white text-[10px] rounded font-medium">
              当前
            </div>
          </div>
        )}

        {/* 操作菜单按钮 */}
        {showMenu && (
          <div 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(!menuOpen)
              }}
              className="p-1.5 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded hover:bg-white transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            
            {/* 下拉菜单 */}
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-neutral-200 rounded shadow-lg py-1 z-10">
                <button
                  onClick={handleStartEdit}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-50 flex items-center gap-2 text-neutral-700"
                >
                  <Edit2 size={12} />
                  重命名
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={12} />
                  删除
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 项目信息 */}
      <div className="p-2 border-t border-neutral-100">
        {isEditing ? (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit(e as unknown as React.MouseEvent)
                if (e.key === 'Escape') handleCancelEdit(e as unknown as React.MouseEvent)
              }}
              className="w-full px-2 py-1 text-[10px] border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-1 mt-1.5">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-2 py-1 text-[10px] bg-neutral-900 text-white rounded hover:bg-neutral-800 flex items-center justify-center"
              >
                <Check size={10} />
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-2 py-1 text-[10px] bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 flex items-center justify-center"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-[10px] text-neutral-700 truncate group-hover:text-neutral-900 transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[10px] text-neutral-400">
                {formatDate(project.updatedAt)}
              </p>
              {project.conversationCount !== undefined && project.conversationCount > 0 && (
                <div className="flex items-center gap-0.5 text-[10px] text-neutral-400">
                  <MessageSquare size={10} />
                  <span>{project.conversationCount}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
