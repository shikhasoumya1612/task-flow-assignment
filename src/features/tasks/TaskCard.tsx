import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
}

const priorityConfig = {
  low: { bg: 'bg-[#e8f5e9]', label: 'Low' },
  medium: { bg: 'bg-[#fef9e7]', label: 'Medium' },
  high: { bg: 'bg-[#fce4ec]', label: 'High' },
}

export function TaskCard({ task, onEdit, onDelete, draggable, onDragStart }: TaskCardProps) {
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
  const priority = priorityConfig[task.priority]

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={`rounded-2xl ${priority.bg} p-4 hover:brightness-105 transition-all cursor-grab active:cursor-grabbing group h-32 flex flex-col`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-black leading-snug">{task.title}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={onEdit}
            className="rounded-lg p-1.5 text-black/40 hover:text-black hover:bg-black/10 transition-colors"
            aria-label="Edit task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg p-1.5 text-black/40 hover:text-black hover:bg-black/10 transition-colors"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mt-1.5 text-xs text-black/50 line-clamp-2">{task.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-lg bg-black/10 px-2.5 py-1 text-xs font-bold text-black/70">
          {priority.label}
        </span>

        {task.due_date && (
          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold ${isOverdue ? 'bg-black/20 text-black' : 'bg-black/10 text-black/60'}`}>
            {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </div>
  )
}
