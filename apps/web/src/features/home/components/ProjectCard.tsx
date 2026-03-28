import React from 'react'
import { Plus } from 'lucide-react'

interface Project {
  id: string
  title: string
  thumbnail?: string
  lastModified: string
}

interface ProjectCardProps {
  project?: Project
  isNew?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function ProjectCard({ project, isNew, onClick, disabled }: ProjectCardProps) {
  if (isNew) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="
          group relative aspect-[4/3] rounded-lg border-2 border-dashed border-neutral-200
          hover:border-neutral-400
          bg-neutral-50 hover:bg-white
          transition-all hover:scale-105 hover:shadow-md
          flex flex-col items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        "
      >
        <div className="p-3 rounded-full bg-neutral-200 group-hover:bg-neutral-300 transition-colors">
          <Plus className="w-6 h-6 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
        </div>
        <span className="text-xs font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors">
          {disabled ? '创建中...' : '新建项目'}
        </span>
      </button>
    )
  }

  if (!project) return null

  return (
    <button
      onClick={onClick}
      className="
        group relative aspect-[4/3] rounded-lg overflow-hidden
        border border-neutral-200 hover:border-neutral-400
        transition-all hover:scale-105 hover:shadow-md
        flex flex-col
      "
    >
      <div className="flex-1 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-neutral-400 text-3xl font-medium">
            {project.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="p-2 bg-white border-t border-neutral-100 text-left">
        <h3 className="text-xs font-medium text-neutral-800 truncate group-hover:text-neutral-600">
          {project.title}
        </h3>
        <p className="text-xs text-neutral-400 mt-0.5">
          {project.lastModified}
        </p>
      </div>
    </button>
  )
}
