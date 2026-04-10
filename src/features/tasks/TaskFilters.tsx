import type { Task, TaskStatus } from '@/types'

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'all'
  onStatusChange: (status: TaskStatus | 'all') => void
  assigneeFilter: string | 'all'
  onAssigneeChange: (assignee: string | 'all') => void
  tasks: Task[]
}

export function TaskFilters({ statusFilter, onStatusChange, assigneeFilter, onAssigneeChange, tasks }: TaskFiltersProps) {
  const statusOptions: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  const assigneeIds = [...new Set(tasks.map((t) => t.assignee_id).filter(Boolean))] as string[]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1.5 rounded-2xl bg-card p-1.5">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onStatusChange(opt.value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              statusFilter === opt.value
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {assigneeIds.length > 0 && (
        <select
          value={assigneeFilter}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="rounded-xl border border-border bg-transparent px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          <option value="all">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {assigneeIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      )}
    </div>
  )
}
