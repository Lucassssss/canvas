'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { PageHeader } from '@/components/PageHeader'
import { ProjectsPage as ProjectsPageContent } from '@/features/projects/ProjectsPage'

export default function ProjectsPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      <LeftSidebar />
      <main className="w-full pb-20 md:pl-20">
        <PageHeader breadcrumbs={[{ label: '我的项目' }]} />
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
          <ProjectsPageContent />
        </div>
      </main>
    </div>
  )
}
