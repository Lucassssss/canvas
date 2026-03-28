/**
 * 项目列表组件
 * 
 * 功能：
 * 1. 显示所有项目
 * 2. 创建新项目
 * 3. 打开项目
 * 4. 删除项目
 * 5. 重命名项目
 */

import { useEffect, useState } from 'react'
import { useProjectStore } from '../store/project-store'
import { useCanvasStore } from '../canvas/store'
import type { ProjectMetadata } from '../types/project'

export function ProjectList() {
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
  const loadProject = useProjectStore((state) => state.loadProject)
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject)

  // Canvas Store
  const setShapes = useCanvasStore((state) => state.setShapes)
  const setViewport = useCanvasStore((state) => state.setViewport)
  const setSelectedIds = useCanvasStore((state) => state.setSelectedIds)

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
      console.log('[Project List] Project created:', projectId)
      setNewProjectName('')
      
      // 自动打开新项目
      await handleOpenProject(projectId)
    } catch (error) {
      console.error('[Project List] Failed to create project:', error)
      alert('Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  // 打开项目
  const handleOpenProject = async (projectId: string) => {
    try {
      console.log('[Project List] Opening project:', projectId)
      const canvasData = await loadProject(projectId)
      
      if (canvasData) {
        // 加载画布数据
        setShapes(canvasData.shapes)
        setViewport(canvasData.viewport)
        setSelectedIds(canvasData.selectedIds)
        
        console.log('[Project List] Project loaded successfully')
      }
    } catch (error) {
      console.error('[Project List] Failed to open project:', error)
      alert('Failed to open project')
    }
  }

  // 删除项目
  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"?`)) {
      return
    }

    try {
      await deleteProject(projectId)
      console.log('[Project List] Project deleted:', projectId)
    } catch (error) {
      console.error('[Project List] Failed to delete project:', error)
      alert('Failed to delete project')
    }
  }

  // 开始编辑项目名称
  const handleStartEdit = (project: ProjectMetadata) => {
    setEditingId(project.id)
    setEditingName(project.name)
  }

  // 保存项目名称
  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) {
      return
    }

    try {
      await updateProjectName(editingId, editingName)
      console.log('[Project List] Project name updated')
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      console.error('[Project List] Failed to update project name:', error)
      alert('Failed to update project name')
    }
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  // 格式化日期
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  if (isLoadingProjects) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    )
  }

  if (projectsError) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500">Error: {projectsError}</div>
        <button
          onClick={() => loadProjects()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题和创建按钮 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="New project name"
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCreateProject}
              disabled={isCreating || !newProjectName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>

        {/* 项目列表 */}
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No projects yet. Create your first project!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  currentProjectId === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                {/* 项目名称 */}
                {editingId === project.id ? (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit()
                        if (e.key === 'Escape') handleCancelEdit()
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3
                    className="font-semibold mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => handleStartEdit(project)}
                    title="Click to rename"
                  >
                    {project.name}
                  </h3>
                )}

                {/* 项目信息 */}
                <div className="text-sm text-gray-500 space-y-1 mb-3">
                  <div>Created: {formatDate(project.createdAt)}</div>
                  <div>Updated: {formatDate(project.updatedAt)}</div>
                  <div>Conversations: {project.conversationCount}</div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenProject(project.id)}
                    className="flex-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id, project.name)}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>

                {/* 当前项目标记 */}
                {currentProjectId === project.id && (
                  <div className="mt-2 text-xs text-blue-600 font-medium">
                    ✓ Current Project
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
