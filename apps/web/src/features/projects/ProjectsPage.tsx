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
import { Folder, Plus, Trash2, Edit2, MessageSquare, Calendar } from 'lucide-react'
import type { ProjectMetadata } from '@/types/project'

export function ProjectsPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

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
    e.stopPropagation() // 防止触发打开项目
    
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
    e.stopPropagation() // 防止触发打开项目
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
    
    if (days === 0) {
      return '今天'
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days} 天前`
    } else {
      return date.toLocaleDateString('zh-CN')
    }
  }

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">加载项目中...</p>
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
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
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
          <h1 className="text-2xl font-semibold text-foreground">我的项目</h1>
          <p className="text-muted-foreground mt-1">管理你的所有设计项目</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            placeholder="输入项目名称"
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
          />
          <button
            onClick={handleCreateProject}
            disabled={isCreating || !newProjectName.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus size={18} />
            {isCreating ? '创建中...' : '创建项目'}
          </button>
        </div>
      </div>

      {/* 项目列表 */}
      {projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg">
          <Folder size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-2">还没有项目</p>
          <p className="text-sm text-muted-foreground">创建你的第一个项目开始设计吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenProject(project.id)}
              className={`group relative border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer ${
                currentProjectId === project.id 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {/* 缩略图区域 */}
              <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
                {project.thumbnail ? (
                  <img 
                    src={project.thumbnail} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Folder size={32} className="text-muted-foreground" />
                )}
              </div>

              {/* 项目信息 */}
              <div className="space-y-2">
                {/* 项目名称 */}
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
                      className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:opacity-90"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                )}

                {/* 项目元数据 */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={12} />
                    <span>{project.conversationCount}</span>
                  </div>
                </div>
              </div>

              {/* 操作按钮（悬停显示） */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={(e) => handleStartEdit(e, project)}
                  className="p-1.5 bg-background border border-border rounded hover:bg-accent transition-colors"
                  title="重命名"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                  className="p-1.5 bg-background border border-border rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  title="删除"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* 当前项目标记 */}
              {currentProjectId === project.id && (
                <div className="absolute bottom-2 right-2">
                  <div className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                    当前
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
