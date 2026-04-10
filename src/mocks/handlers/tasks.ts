import { http, HttpResponse } from 'msw'
import { tasks, projects } from '../data'
import { getUserFromToken } from './auth'

const API = import.meta.env.VITE_API_URL || ''

function requireAuth(request: Request) {
  const userId = getUserFromToken(request.headers.get('Authorization'))
  if (!userId) return { error: true as const, response: HttpResponse.json({ error: 'unauthorized' }, { status: 401 }) }
  return { error: false as const, userId }
}

export const taskHandlers = [
  http.get(`${API}/projects/:id/tasks`, ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const project = projects.find((p) => p.id === params.id)
    if (!project) return HttpResponse.json({ error: 'not found' }, { status: 404 })

    const url = new URL(request.url)
    const statusFilter = url.searchParams.get('status')
    const assigneeFilter = url.searchParams.get('assignee')

    let filtered = tasks.filter((t) => t.project_id === params.id)
    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter)
    if (assigneeFilter) filtered = filtered.filter((t) => t.assignee_id === assigneeFilter)

    return HttpResponse.json({ tasks: filtered })
  }),

  http.post(`${API}/projects/:id/tasks`, async ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const project = projects.find((p) => p.id === params.id)
    if (!project) return HttpResponse.json({ error: 'not found' }, { status: 404 })

    const body = (await request.json()) as Record<string, string>
    if (!body.title) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { title: 'is required' } },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const task = {
      id: `task-${crypto.randomUUID()}`,
      title: body.title,
      description: body.description || undefined,
      status: (body.status as 'todo' | 'in_progress' | 'done') || 'todo',
      priority: (body.priority as 'low' | 'medium' | 'high') || 'medium',
      project_id: params.id as string,
      assignee_id: body.assignee_id || null,
      due_date: body.due_date || null,
      created_at: now,
      updated_at: now,
    }
    tasks.push(task)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch(`${API}/tasks/:id`, async ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const task = tasks.find((t) => t.id === params.id)
    if (!task) return HttpResponse.json({ error: 'not found' }, { status: 404 })

    const body = (await request.json()) as Record<string, string | null>
    if (body.title !== undefined) task.title = body.title as string
    if (body.description !== undefined) task.description = (body.description as string) || undefined
    if (body.status !== undefined) task.status = body.status as 'todo' | 'in_progress' | 'done'
    if (body.priority !== undefined) task.priority = body.priority as 'low' | 'medium' | 'high'
    if (body.assignee_id !== undefined) task.assignee_id = body.assignee_id
    if (body.due_date !== undefined) task.due_date = body.due_date
    task.updated_at = new Date().toISOString()

    return HttpResponse.json(task)
  }),

  http.delete(`${API}/tasks/:id`, ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const idx = tasks.findIndex((t) => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })

    tasks.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
