'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { useProjectStore } from '@/store/project-store'

export function RecentProjects() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const hasLoaded = useRef(false)
  
  const projects = useProjectStore((state) => state.projects)
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const createProject = useProjectStore((state) => state.createProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const updateProjectName = useProjectStore((state) => state.updateProjectName)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    loadProjects()
  }, [loadProjects])

  const recentProjects = projects.slice(0, 5)

  const handleNewProject = async () => {
    if (isCreating) return
    
    setIsCreating(true)
    try {
      const projectId = await createProject('新项目')
      console.log('[Recent Projects] Project created:', projectId)
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[Recent Projects] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  const handleOpenProject = (projectId: string) => {
    router.push(`/canvas?projectId=${projectId}`)
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId)
      console.log('[Recent Projects] Project deleted:', projectId)
    } catch (error) {
      console.error('[Recent Projects] Failed to delete project:', error)
      alert('删除项目失败，请重试')
    }
  }

  const handleRenameProject = async (projectId: string, name: string) => {
    try {
      await updateProjectName(projectId, name)
      console.log('[Recent Projects] Project renamed')
    } catch (error) {
      console.error('[Recent Projects] Failed to rename project:', error)
      alert('重命名失败，请重试')
    }
  }

  const handleViewAll = () => {
    router.push('/projects')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans-zh text-sm font-medium text-neutral-700">最近项目</h2>
        <button 
          onClick={handleViewAll}
          className="flex items-center gap-1 font-sans-zh text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <span>查看全部</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <ProjectCard 
          isNew 
          onClick={handleNewProject}
          disabled={isCreating}
        />
        
        {recentProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              id: project.id,
              name: project.name,
              updatedAt: project.updatedAt,
              thumbnail: project.thumbnail,
            }}
            showMenu
            onClick={() => handleOpenProject(project.id)}
            onDelete={handleDeleteProject}
            onRename={handleRenameProject}
          />
        ))}
      </div>
    </div>
  )
}
