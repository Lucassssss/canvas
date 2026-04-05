'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectStore } from '@/store/project-store'
import { ProjectCard } from '@/components/ProjectCard'
import { Plus } from 'lucide-react'

export function ProjectsPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')

  const projects = useProjectStore((state) => state.projects)
  const isLoadingProjects = useProjectStore((state) => state.isLoadingProjects)
  const projectsError = useProjectStore((state) => state.projectsError)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const createProject = useProjectStore((state) => state.createProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const updateProjectName = useProjectStore((state) => state.updateProjectName)

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return

    setIsCreating(true)
    try {
      const projectId = await createProject(newProjectName)
      console.log('[Projects Page] Project created:', projectId)
      setNewProjectName('')
      setShowNewProjectDialog(false)
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[Projects Page] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenProject = (projectId: string) => {
    console.log('[Projects Page] Opening project:', projectId)
    router.push(`/canvas?projectId=${projectId}`)
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      console.log('[Projects Page] Project deleted:', projectId)
    } catch (error) {
      console.error('[Projects Page] Failed to delete project:', error)
      alert('删除项目失败，请重试')
    }
  }

  const handleRenameProject = async (projectId: string, name: string) => {
    try {
      await updateProjectName(projectId, name)
      console.log('[Projects Page] Project name updated')
    } catch (error) {
      console.error('[Projects Page] Failed to update project name:', error)
      alert('更新项目名称失败，请重试')
    }
  }

  if (isLoadingProjects) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          <p className="mt-4 font-sans-zh text-sm text-neutral-500">加载项目中...</p>
        </div>
      </div>
    )
  }

  if (projectsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-sans-zh text-sm">{projectsError}</p>
          <button
            onClick={() => loadProjects()}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-sans-zh text-sm"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans-zh text-sm font-medium text-neutral-700">我的项目</h2>
          <p className="font-sans-zh text-xs text-neutral-400 mt-1">共 {projects.length} 个项目</p>
        </div>
        <button
          onClick={() => setShowNewProjectDialog(true)}
          className="px-4 py-2 bg-neutral-950 text-white rounded hover:bg-neutral-800 transition-colors flex items-center gap-2 font-sans-zh text-sm"
        >
          <Plus size={16} />
          新建项目
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <ProjectCard
          isNew
          onClick={() => setShowNewProjectDialog(true)}
          disabled={isCreating}
        />

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              name: project.name,
              thumbnail: project.thumbnail,
              updatedAt: project.updatedAt,
              conversationCount: project.conversationCount,
            }}
            isCurrent={currentProjectId === project.id}
            showMenu
            onClick={() => handleOpenProject(project.id)}
            onDelete={handleDeleteProject}
            onRename={handleRenameProject}
          />
        ))}
      </div>

      {showNewProjectDialog && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowNewProjectDialog(false)}
        >
          <div 
            className="bg-white p-6 w-full max-w-sm border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif-display text-xl text-neutral-950 mb-4">新建项目</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="输入项目名称"
              className="w-full px-4 py-2.5 border border-neutral-200 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/10 font-sans-zh text-sm"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowNewProjectDialog(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200 transition-colors font-sans-zh text-sm"
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !newProjectName.trim()}
                className="flex-1 px-4 py-2.5 bg-neutral-950 text-white rounded hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans-zh text-sm"
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
