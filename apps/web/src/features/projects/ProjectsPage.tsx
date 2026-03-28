/**
 * 项目列表页面
 * 
 * 功能：
 * 1. 显示所有项目
 * 2. 创建新项目
 * 3. 打开项目
 * 4. 删除项目
 * 5. 重命名项目
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/project-store'
import { Plus, Trash2, Edit2, MessageSquare, MoreVertical } from 'lucide-react'
import type { ProjectMetadata } from '@/types/project'

export function ProjectsPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  // Project Store
  const projects = useProjectStore((state) => state.projects)
  const isLoadingProjects = useProjectStore((state) => state.isLoadingProjects)
  const projectsError = useProjectStore((state) => state.projectsError)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const createProject = useProjectStore((state) => state.createProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const updateProjectName = useProjectStore((state) => state.updateProjectName)

  // 加载项目列表
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // 创建新项目
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      return
    }

    setIsCreating(true)
    try {
      const projectId = await createProject(newProjectName)
      console.log('[Projects Page] Project created:', projectId)
      setNewProjectName('')
      setShowNewProjectDialog(false)
      
      // 自动跳转到画布页面
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[Projects Page] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  // 打开项目
  const handleOpenProject = (projectId: string) => {
    console.log('[Projects Page] Opening project:', projectId)
    router.push(`/canvas?projectId=${projectId}`)
  }

  // 删除项目
  const handleDeleteProject = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.stopPropagation()
    setMenuOpenId(null)
    
    if (!confirm(`确定要删除项目 "${projectName}" 吗？此操作无法撤销。`)) {
      return
    }

    try {
      await deleteProject(projectId)
      console.log('[Projects Page] Project deleted:', projectId)
    } catch (error) {
      console.error('[Projects Page] Failed to delete project:', error)
      alert('删除项目失败，请重试')
    }
  }

  // 开始编辑项目名称
  const handleStartEdit = (e: React.MouseEvent, project: ProjectMetadata) => {
    e.stopPropagation()
    setMenuOpenId(null)
    setEditingId(project.id)
    setEditingName(project.name)
  }

  // 保存项目名称
  const handleSaveEdit = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!editingId || !editingName.trim()) {
      return
    }

    try {
      await updateProjectName(editingId, editingName)
      console.log('[Projects Page] Project name updated')
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      console.error('[Projects Page] Failed to update project name:', error)
      alert('更新项目名称失败，请重试')
    }
  }

  // 取消编辑
  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
    setEditingName('')
  }

  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      return '刚刚'
    } else if (hours < 24) {
      return `${hours} 小时前`
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days} 天前`
    } else if (days < 30) {
      return `${Math.floor(days / 7)} 周前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          <p className="mt-4 text-neutral-500 text-sm">加载项目中...</p>
        </div>
      </div>
    )
  }

  if (projectsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">加载失败: {projectsError}</p>
          <button
            onClick={() => loadProjects()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 标题和创建按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">我的项目</h1>
          <p className="text-neutral-500 mt-1 text-sm">共 {projects.length} 个项目</p>
        </div>
        <button
          onClick={() => setShowNewProjectDialog(true)}
          className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Plus size={18} />
          新建项目
        </button>
      </div>

      {/* 项目网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {/* 新建项目卡片 */}
        <button
          onClick={() => setShowNewProjectDialog(true)}
          className="group relative aspect-[4/3] rounded-lg border-2 border-dashed border-neutral-200 hover:border-neutral-400 bg-neutral-50 hover:bg-white transition-all hover:scale-105 hover:shadow-md flex flex-col items-center justify-center gap-2"
        >
          <div className="p-3 rounded-full bg-neutral-200 group-hover:bg-neutral-300 transition-colors">
            <Plus className="w-6 h-6 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
          </div>
          <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors">
            新建项目
          </span>
        </button>

        {/* 项目卡片 */}
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleOpenProject(project.id)}
            className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all hover:scale-105 hover:shadow-md flex flex-col cursor-pointer ${
              currentProjectId === project.id 
                ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' 
                : 'border-neutral-200 hover:border-neutral-400'
            }`}
          >
            {/* 缩略图区域 */}
            <div className="flex-1 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center relative">
              {project.thumbnail ? (
                <img 
                  src={project.thumbnail} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-neutral-400 text-3xl font-medium">
                  {project.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* 当前项目标记 */}
              {currentProjectId === project.id && (
                <div className="absolute top-2 left-2">
                  <div className="px-2 py-0.5 bg-neutral-900 text-white text-xs rounded-full font-medium">
                    当前
                  </div>
                </div>
              )}

              {/* 操作菜单按钮 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpenId(menuOpenId === project.id ? null : project.id)
                  }}
                  className="p-1.5 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <MoreVertical size={14} />
                </button>
                
                {/* 下拉菜单 */}
                {menuOpenId === project.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={(e) => handleStartEdit(e, project)}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Edit2 size={12} />
                      重命名
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={12} />
                      删除
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* 项目信息 */}
            <div className="p-2.5 bg-white border-t border-neutral-100">
              {editingId === project.id ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(e as any)
                      if (e.key === 'Escape') handleCancelEdit(e as any)
                    }}
                    className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                    autoFocus
                  />
                  <div className="flex gap-1 mt-1.5">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 px-2 py-1 text-xs bg-neutral-900 text-white rounded hover:bg-neutral-800"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xs font-medium text-neutral-800 truncate group-hover:text-neutral-600">
                    {project.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-neutral-400">
                      {formatDate(project.updatedAt)}
                    </p>
                    {project.conversationCount > 0 && (
                      <div className="flex items-center gap-1 text-xs text-neutral-400">
                        <MessageSquare size={10} />
                        <span>{project.conversationCount}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 新建项目对话框 */}
      {showNewProjectDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowNewProjectDialog(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">新建项目</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="输入项目名称"
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-sm"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNewProjectDialog(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !newProjectName.trim()}
                className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isCreating ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
