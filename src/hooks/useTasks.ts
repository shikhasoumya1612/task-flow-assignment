import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '@/api/tasks'
import type { Task } from '@/types'
import { projectKeys } from './useProjects'

export function useCreateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof api.createTask>[1]) =>
      api.createTask(projectId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  })
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assignee_id' | 'due_date'>>) =>
      api.updateTask(id, data),
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: projectKeys.detail(projectId) })
      const prev = qc.getQueryData(projectKeys.detail(projectId))
      qc.setQueryData(projectKeys.detail(projectId), (old: any) => {
        if (!old?.tasks) return old
        return {
          ...old,
          tasks: old.tasks.map((t: Task) =>
            t.id === vars.id ? { ...t, ...vars, updated_at: new Date().toISOString() } : t,
          ),
        }
      })
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(projectKeys.detail(projectId), context.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  })
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.detail(projectId) }),
  })
}
