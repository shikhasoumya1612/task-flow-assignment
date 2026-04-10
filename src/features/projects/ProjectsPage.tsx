import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects, useCreateProject } from '@/hooks/useProjects'
import { ProjectList } from './ProjectList'
import { CreateProjectModal } from './CreateProjectModal'
import { EmptyState } from '@/components/EmptyState'

export function ProjectsPage() {
  const navigate = useNavigate()
  const { data: projects, isLoading, error } = useProjects()
  const createProject = useCreateProject()
  const [showCreate, setShowCreate] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-card-green border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-card-red/15 px-5 py-4 text-sm font-medium text-card-red">
        Failed to load projects. Please try again.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your work and tasks</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-card-green px-5 py-2.5 text-sm font-bold text-background hover:brightness-110 transition-all"
        >
          + New Project
        </button>
      </div>

      {projects && projects.length > 0 ? (
        <ProjectList projects={projects} onSelect={(id) => navigate(`/projects/${id}`)} />
      ) : (
        <EmptyState
          title="No projects yet"
          description="Create your first project to start organizing tasks."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-card-green px-5 py-2.5 text-sm font-bold text-background hover:brightness-110 transition-all"
            >
              + New Project
            </button>
          }
        />
      )}

      <CreateProjectModal
        open={showCreate}
        loading={createProject.isPending}
        onClose={() => setShowCreate(false)}
        onSubmit={(data) => {
          createProject.mutate(data, { onSuccess: () => setShowCreate(false) })
        }}
      />
    </div>
  )
}
