import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProject, useDeleteProject, useUpdateProject } from '@/hooks/useProjects'
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { TaskColumn } from '@/features/tasks/TaskColumn'
import { TaskModal } from '@/features/tasks/TaskModal'
import { TaskFilters } from '@/features/tasks/TaskFilters'
import { EmptyState } from '@/components/EmptyState'
import type { Task, TaskStatus } from '@/types'

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: project, isLoading, error } = useProject(id!)

  const createTask = useCreateTask(id!)
  const updateTask = useUpdateTask(id!)
  const deleteTask = useDeleteTask(id!)
  const deleteProject = useDeleteProject()
  const updateProject = useUpdateProject()

  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all')
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-card-green border-t-transparent" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="rounded-2xl bg-card-red/15 px-5 py-4 text-sm font-medium text-card-red">
        Project not found or failed to load.
      </div>
    )
  }

  const tasks = project.tasks ?? []
  const columns: TaskStatus[] = ['todo', 'in_progress', 'done']

  const filteredTasks = tasks
    .filter((t) => statusFilter === 'all' || t.status === statusFilter)
    .filter((t) => {
      if (assigneeFilter === 'all') return true
      if (assigneeFilter === 'unassigned') return !t.assignee_id
      return t.assignee_id === assigneeFilter
    })

  const handleDropTask = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status !== newStatus) {
      updateTask.mutate({ id: taskId, status: newStatus })
    }
  }

  const handleDeleteProject = () => {
    if (window.confirm('Delete this project and all its tasks?')) {
      deleteProject.mutate(id!, { onSuccess: () => navigate('/') })
    }
  }

  const handleEditProject = () => {
    setProjectName(project.name)
    setProjectDesc(project.description ?? '')
    setIsEditingProject(true)
  }

  const handleSaveProject = () => {
    updateProject.mutate(
      { id: id!, name: projectName, description: projectDesc || undefined },
      { onSuccess: () => setIsEditingProject(false) },
    )
  }

  const inputClass = "w-full rounded-xl border border-border bg-transparent px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"

  return (
    <div>
      {/* Project header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to projects
        </button>

        {isEditingProject ? (
          <div className="space-y-3">
            <input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`${inputClass} text-xl font-bold`}
            />
            <input
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Description (optional)"
              className={`${inputClass} text-sm`}
            />
            <div className="flex gap-2">
              <button onClick={handleSaveProject} className="rounded-xl bg-card-green px-4 py-2 text-sm font-bold text-background hover:brightness-110 transition-all">
                Save
              </button>
              <button onClick={() => setIsEditingProject(false)} className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-foreground">{project.name}</h1>
              {project.description && (
                <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleEditProject}
                className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteProject}
                className="rounded-xl px-4 py-2 text-sm font-bold text-card-red hover:bg-card-red/10 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <TaskFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          assigneeFilter={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          tasks={tasks}
        />
        <button
          onClick={() => { setEditingTask(null); setTaskModalOpen(true) }}
          className="rounded-xl bg-card-green px-5 py-2.5 text-sm font-bold text-background hover:brightness-110 transition-all"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban board */}
      {tasks.length === 0 ? (
        <EmptyState
          title="No tasks yet"
          description="Add your first task to get started."
          action={
            <button
              onClick={() => { setEditingTask(null); setTaskModalOpen(true) }}
              className="rounded-xl bg-card-green px-5 py-2.5 text-sm font-bold text-background hover:brightness-110 transition-all"
            >
              + Add Task
            </button>
          }
        />
      ) : statusFilter === 'all' ? (
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              tasks={filteredTasks.filter((t) => t.status === status)}
              onEditTask={(task) => { setEditingTask(task); setTaskModalOpen(true) }}
              onDeleteTask={(taskId) => {
                if (window.confirm('Delete this task?')) deleteTask.mutate(taskId)
              }}
              onDropTask={handleDropTask}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <TaskColumn
            status={statusFilter}
            tasks={filteredTasks}
            onEditTask={(task) => { setEditingTask(task); setTaskModalOpen(true) }}
            onDeleteTask={(taskId) => {
              if (window.confirm('Delete this task?')) deleteTask.mutate(taskId)
            }}
            onDropTask={handleDropTask}
          />
        </div>
      )}

      {/* Task create/edit modal */}
      <TaskModal
        open={taskModalOpen}
        task={editingTask}
        loading={createTask.isPending || updateTask.isPending}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null) }}
        onSubmit={(data) => {
          if (editingTask) {
            updateTask.mutate({ id: editingTask.id, ...data }, {
              onSuccess: () => { setTaskModalOpen(false); setEditingTask(null) },
            })
          } else {
            createTask.mutate(data, {
              onSuccess: () => { setTaskModalOpen(false) },
            })
          }
        }}
      />
    </div>
  )
}
