import { http, HttpResponse } from 'msw'
import { users, passwords } from '../data'

const API = import.meta.env.VITE_API_URL || ''

function generateToken(userId: string, email: string): string {
  const payload = { user_id: userId, email, exp: Date.now() + 86400000 }
  return `mock.${btoa(JSON.stringify(payload))}.signature`
}

export function getUserFromToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  try {
    const payload = JSON.parse(atob(authHeader.split('.')[1]))
    if (payload.exp < Date.now()) return null
    return payload.user_id
  } catch {
    return null
  }
}

export const authHandlers = [
  http.post(`${API}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const errors: Record<string, string> = {}

    if (!body.name) errors.name = 'is required'
    if (!body.email) errors.email = 'is required'
    if (!body.password) errors.password = 'is required'
    if (body.password && body.password.length < 6) errors.password = 'must be at least 6 characters'

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields: errors }, { status: 400 })
    }

    if (passwords[body.email]) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { email: 'already exists' } },
        { status: 400 },
      )
    }

    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      name: body.name,
      email: body.email,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    passwords[body.email] = body.password

    return HttpResponse.json(
      { token: generateToken(newUser.id, newUser.email), user: newUser },
      { status: 201 },
    )
  }),

  http.post(`${API}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>
    const errors: Record<string, string> = {}

    if (!body.email) errors.email = 'is required'
    if (!body.password) errors.password = 'is required'

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields: errors }, { status: 400 })
    }

    const storedPassword = passwords[body.email]
    if (!storedPassword || storedPassword !== body.password) {
      return HttpResponse.json({ error: 'invalid email or password' }, { status: 401 })
    }

    const user = users.find((u) => u.email === body.email)!
    return HttpResponse.json({ token: generateToken(user.id, user.email), user })
  }),
]
