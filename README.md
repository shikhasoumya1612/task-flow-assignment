# TaskFlow

A task management system built with React, TypeScript, and Vite. Users can register, log in, create projects, and manage tasks via a drag-and-drop Kanban board.

## Tech Stack

React 19, TypeScript, Vite 8, TanStack React Query, React Router DOM 7, Tailwind CSS 4, Axios, MSW (Mock Service Worker), Docker + Nginx

## Architecture Decisions

- **Feature-based structure** — Code organized by feature (`features/auth`, `features/projects`, `features/tasks`), not by type. Shared components in `components/`, hooks in `hooks/`.
- **MSW for API mocking** — Intercepts requests at the service worker level, same URLs as production. Only loaded in dev (`import.meta.env.DEV` guard), tree-shaken from production bundle.
- **React Query** — Caching, background refetching, and optimistic updates. Task drag-and-drop updates UI instantly, reverts on error.
- **Auth** — JWT in localStorage, hydrated into React Context. Axios interceptors handle token injection and 401 redirects.
- **Custom components** — No component library. Built from scratch with Tailwind for full design control and smaller bundle.
- **Docker** — Multi-stage build (Node 20 build, Nginx Alpine serve). `VITE_API_URL` passed as build arg. SPA fallback + asset caching.

## Running Locally

```bash
git clone https://github.com/shikhasoumya1612/task-flow.git
cd task-flow
cp .env.example .env
docker compose up
# App at http://localhost:3000
```

Without Docker:

```bash
npm install
npm run dev
# App at http://localhost:5173
```

## Test Credentials

```
Email:    test@example.com
Password: password123
```

## API Reference

Built against the mock API spec (Appendix A). All endpoints mocked via MSW.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register with name, email, password |
| POST | `/auth/login` | Login, returns JWT + user |
| GET | `/projects` | List user's projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Project details + tasks |
| PATCH | `/projects/:id` | Update project (owner only) |
| DELETE | `/projects/:id` | Delete project + tasks (owner only) |
| GET | `/projects/:id/tasks` | List tasks (`?status=`, `?assignee=`) |
| POST | `/projects/:id/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |

## What I'd Do With More Time

- **Backend** — Go + PostgreSQL with bcrypt auth and migrations. Frontend already structured to swap MSW for real API with zero changes.
- **Tests** — Vitest + RTL for components, Playwright for E2E.
- **Pagination** — Cursor-based for large datasets.
- **Real-time** — SSE/WebSocket for live updates. React Query invalidation pattern already in place.
- **Accessibility** — Keyboard drag-and-drop, ARIA labels, modal focus traps.
- **Mobile drag-and-drop** — HTML5 drag API doesn't work on touch; would use dnd-kit.
