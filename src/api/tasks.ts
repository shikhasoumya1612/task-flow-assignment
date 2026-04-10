import { client } from './client'
import type { Task, TaskStatus } from '@/types'

export function getTasks(projectId: string, filters?: { status?: TaskStatus; assignee?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.assignee) params.set('assignee', filters.assignee)
  const query = params.toString()
  return client.get<{ tasks: Task[] }>(`/projects/${projectId}/tasks${query ? `?${query}` : ''}`)
}

export function createTask(projectId: string, data: {
  title: string
  description?: string
  priority?: string
  assignee_id?: string
  due_date?: string
}) {
  return client.post<Task>(`/projects/${projectId}/tasks`, data)
}

export function updateTask(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee_id' | 'due_date'>>) {
  return client.patch<Task>(`/tasks/${id}`, data)
}

export function deleteTask(id: string) {
  return client.delete(`/tasks/${id}`)
}
