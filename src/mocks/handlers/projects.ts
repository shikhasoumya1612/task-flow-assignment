import { http, HttpResponse } from 'msw'
import { projects, tasks } from '../data'
import { getUserFromToken } from './auth'

const API = import.meta.env.VITE_API_URL || ''

function requireAuth(request: Request) {
  const userId = getUserFromToken(request.headers.get('Authorization'))
  if (!userId) return { error: true as const, response: HttpResponse.json({ error: 'unauthorized' }, { status: 401 }) }
  return { error: false as const, userId }
}

export const projectHandlers = [
  http.get(`${API}/projects`, ({ request }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const userProjects = projects.filter(
      (p) =>
        p.owner_id === auth.userId ||
        tasks.some((t) => t.project_id === p.id && t.assignee_id === auth.userId),
    )
    return HttpResponse.json({ projects: userProjects })
  }),

  http.post(`${API}/projects`, async ({ request }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const body = (await request.json()) as Record<string, string>
    if (!body.name) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { name: 'is required' } },
        { status: 400 },
      )
    }

    const project = {
      id: `project-${crypto.randomUUID()}`,
      name: body.name,
      description: body.description || undefined,
      owner_id: auth.userId,
      created_at: new Date().toISOString(),
    }
    projects.push(project)
    return HttpResponse.json(project, { status: 201 })
  }),

  http.get(`${API}/projects/:id`, ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const project = projects.find((p) => p.id === params.id)
    if (!project) return HttpResponse.json({ error: 'not found' }, { status: 404 })

    const projectTasks = tasks.filter((t) => t.project_id === project.id)
    return HttpResponse.json({ ...project, tasks: projectTasks })
  }),

  http.patch(`${API}/projects/:id`, async ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const project = projects.find((p) => p.id === params.id)
    if (!project) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    if (project.owner_id !== auth.userId) return HttpResponse.json({ error: 'forbidden' }, { status: 403 })

    const body = (await request.json()) as Record<string, string>
    if (body.name !== undefined) project.name = body.name
    if (body.description !== undefined) project.description = body.description

    return HttpResponse.json(project)
  }),

  http.delete(`${API}/projects/:id`, ({ request, params }) => {
    const auth = requireAuth(request)
    if (auth.error) return auth.response

    const idx = projects.findIndex((p) => p.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    if (projects[idx].owner_id !== auth.userId) return HttpResponse.json({ error: 'forbidden' }, { status: 403 })

    for (let i = tasks.length - 1; i >= 0; i--) {
      if (tasks[i].project_id === params.id) tasks.splice(i, 1)
    }
    projects.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]
