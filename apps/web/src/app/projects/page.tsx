'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { ProjectsPage as ProjectsPageContent } from '@/features/projects/ProjectsPage'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <LeftSidebar />
      <main className="pt-20 px-8 ml-24">
        <div className="max-w-7xl mx-auto">
          <ProjectsPageContent />
        </div>
      </main>
    </div>
  )
}
