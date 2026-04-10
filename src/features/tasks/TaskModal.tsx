import { useState, useEffect } from 'react'
import type { Task, TaskStatus, TaskPriority } from '@/types'
import { TaskForm } from './TaskForm'

interface TaskModalProps {
  open: boolean
  task: Task | null
  loading: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    due_date?: string
  }) => void
}

const defaultForm = {
  title: '',
  description: '',
  status: 'todo' as TaskStatus,
  priority: 'medium' as TaskPriority,
  due_date: '',
}

export function TaskModal({ open, task, loading, onClose, onSubmit }: TaskModalProps) {
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ?? '',
      })
    } else {
      setForm(defaultForm)
    }
  }, [task, open])

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-foreground mb-5">
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <TaskForm
          data={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          isEditing={!!task}
        />
      </div>
    </div>
  )
}
