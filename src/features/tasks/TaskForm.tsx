import { useState } from 'react'
import type { TaskPriority, TaskStatus } from '@/types'

interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string
}

interface TaskFormProps {
  data: TaskFormData
  onChange: (data: TaskFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  loading: boolean
  isEditing: boolean
}

type FieldErrors = Partial<Record<keyof TaskFormData, string>>

function validate(data: TaskFormData): FieldErrors {
  const errors: FieldErrors = {}
  if (!data.title.trim()) errors.title = 'Title is required'
  if (!data.description.trim()) errors.description = 'Description is required'
  if (!data.due_date) errors.due_date = 'Due date is required'
  return errors
}

export function TaskForm({ data, onChange, onSubmit, onCancel, loading, isEditing }: TaskFormProps) {
  const [errors, setErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof TaskFormData, boolean>>>({})

  const update = (field: keyof TaskFormData, value: string) => {
    const next = { ...data, [field]: value }
    onChange(next)
    if (touched[field]) {
      const fieldError = validate(next)[field]
      setErrors((prev) => {
        const copy = { ...prev }
        if (fieldError) copy[field] = fieldError
        else delete copy[field]
        return copy
      })
    }
  }

  const blur = (field: keyof TaskFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldError = validate(data)[field]
    setErrors((prev) => {
      const copy = { ...prev }
      if (fieldError) copy[field] = fieldError
      else delete copy[field]
      return copy
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const allErrors = validate(data)
    setErrors(allErrors)
    setTouched({ title: true, description: true, due_date: true })
    if (Object.keys(allErrors).length > 0) return
    onSubmit(e)
  }

  const inputClass = (field: keyof TaskFormData) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors bg-transparent ${
      errors[field]
        ? 'border-card-red focus:ring-card-red/20 focus:border-card-red'
        : 'border-border focus:ring-foreground/10 focus:border-foreground/30'
    }`

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-semibold text-foreground mb-2">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          onBlur={() => blur('title')}
          autoFocus
          className={inputClass('title')}
          placeholder="What needs to be done?"
        />
        {errors.title && <p className="mt-1.5 text-xs font-medium text-card-red">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="task-desc" className="block text-sm font-semibold text-foreground mb-2">
          Description
        </label>
        <textarea
          id="task-desc"
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          onBlur={() => blur('description')}
          rows={3}
          className={`${inputClass('description')} resize-none`}
          placeholder="Add more details..."
        />
        {errors.description && <p className="mt-1.5 text-xs font-medium text-card-red">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label htmlFor="task-status" className="block text-sm font-semibold text-foreground mb-2">
            Status
          </label>
          <select
            id="task-status"
            value={data.status}
            onChange={(e) => update('status', e.target.value)}
            className={inputClass('status')}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-priority" className="block text-sm font-semibold text-foreground mb-2">
            Priority
          </label>
          <select
            id="task-priority"
            value={data.priority}
            onChange={(e) => update('priority', e.target.value)}
            className={inputClass('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-due" className="block text-sm font-semibold text-foreground mb-2">
            Due Date
          </label>
          <input
            id="task-due"
            type="date"
            value={data.due_date}
            onChange={(e) => update('due_date', e.target.value)}
            onBlur={() => blur('due_date')}
            className={inputClass('due_date')}
          />
          {errors.due_date && <p className="mt-1.5 text-xs font-medium text-card-red">{errors.due_date}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  )
}
