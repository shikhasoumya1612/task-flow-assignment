import type { Task, TaskStatus } from '@/types'
import { TaskCard } from './TaskCard'
import { useState } from 'react'

interface TaskColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onDropTask: (taskId: string, newStatus: TaskStatus) => void
}

const statusConfig: Record<TaskStatus, { label: string; dotColor: string }> = {
  todo: { label: 'To Do', dotColor: 'bg-card-yellow' },
  in_progress: { label: 'In Progress', dotColor: 'bg-card-orange' },
  done: { label: 'Done', dotColor: 'bg-card-green' },
}

export function TaskColumn({ status, tasks, onEditTask, onDeleteTask, onDropTask }: TaskColumnProps) {
  const [dragOver, setDragOver] = useState(false)
  const config = statusConfig[status]

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) onDropTask(taskId, status)
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-h-40 transition-all rounded-2xl p-1 ${dragOver ? 'bg-card-green/5 ring-1 ring-card-green/30' : ''}`}
    >
      <div className="flex items-center gap-2.5 mb-3 px-1">
        <span className={`h-3 w-3 rounded-full ${config.dotColor}`} />
        <h3 className="text-sm font-bold text-foreground">{config.label}</h3>
        <span className="ml-auto text-xs font-bold text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {tasks.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">No tasks</p>
        )}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
          />
        ))}
      </div>
    </div>
  )
}
