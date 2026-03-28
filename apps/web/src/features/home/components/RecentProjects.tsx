'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { ProjectCard } from './ProjectCard'

const recentProjects = [
  { id: '1', title: '品牌 logo 设计', lastModified: '2 小时前' },
  { id: '2', title: '产品海报', lastModified: '昨天' },
  { id: '3', title: '社交媒体配图', lastModified: '3 天前' },
  { id: '4', title: '网站 banner', lastModified: '上周' },
]

export function RecentProjects() {
  const router = useRouter()

  const handleNewProject = () => {
    router.push('/canvas')
  }

  const handleOpenProject = (_projectId: string) => {
    router.push('/canvas')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-neutral-700">最近项目</h2>
        <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
          <span>查看全部</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <ProjectCard isNew onClick={handleNewProject} />
        
        {recentProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleOpenProject(project.id)}
          />
        ))}
      </div>
    </div>
  )
}
