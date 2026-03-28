'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { useProjectStore } from '@/store/project-store'

export function RecentProjects() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  
  const projects = useProjectStore((state) => state.projects)
  const loadProjects = useProjectStore((state) => state.loadProjects)
  const createProject = useProjectStore((state) => state.createProject)

  // 加载项目列表
  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // 获取最近的 5 个项目
  const recentProjects = projects.slice(0, 5)

  // 创建新项目
  const handleNewProject = async () => {
    if (isCreating) return
    
    setIsCreating(true)
    try {
      const projectId = await createProject('新项目')
      console.log('[Recent Projects] Project created:', projectId)
      
      // 跳转到画布
      router.push(`/canvas?projectId=${projectId}`)
    } catch (error) {
      console.error('[Recent Projects] Failed to create project:', error)
      alert('创建项目失败，请重试')
    } finally {
      setIsCreating(false)
    }
  }

  // 打开项目
  const handleOpenProject = (projectId: string) => {
    router.push(`/canvas?projectId=${projectId}`)
  }

  // 查看全部项目
  const handleViewAll = () => {
    router.push('/projects')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-neutral-700">最近项目</h2>
        <button 
          onClick={handleViewAll}
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <span>查看全部</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
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
              title: project.name,
              lastModified: formatDate(project.updatedAt),
              thumbnail: project.thumbnail
            }}
            onClick={() => handleOpenProject(project.id)}
          />
        ))}
      </div>
    </div>
  )
}

// 格式化日期
function formatDate(timestamp: number): string {
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
