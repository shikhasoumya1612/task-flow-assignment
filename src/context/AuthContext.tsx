import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authApi from '@/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

function loadPersistedState(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadPersistedState().user)
  const [token, setToken] = useState<string | null>(() => loadPersistedState().token)

  const persist = useCallback((token: string, user: User) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi.login(email, password)
    persist(data.token, data.user)
  }, [persist])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await authApi.register(name, email, password)
    persist(data.token, data.user)
  }, [persist])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
