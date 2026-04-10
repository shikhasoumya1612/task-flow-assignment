import { client } from './client'
import type { Project, ProjectWithTasks } from '@/types'

export function getProjects() {
  return client.get<{ projects: Project[] }>('/projects')
}

export function getProject(id: string) {
  return client.get<ProjectWithTasks>(`/projects/${id}`)
}

export function createProject(data: { name: string; description?: string }) {
  return client.post<Project>('/projects', data)
}

export function updateProject(id: string, data: { name?: string; description?: string }) {
  return client.patch<Project>(`/projects/${id}`, data)
}

export function deleteProject(id: string) {
  return client.delete(`/projects/${id}`)
}
