import { useCallback, useEffect, useState } from 'react'
import { setToken, setUnauthorizedHandler, getToken } from '../services/apiClient'
import * as authService from '../services/authService'
import * as userService from '../services/userService'
import { AuthContext } from '../hooks/useAuth'

const USER_KEY = 'xclone_user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Session state for the whole app.
 * - Keeps the token in localStorage (project requirement).
 * - On load, validates the stored token against GET /api/users/me.
 * - On a 401 from any service call, the token is dropped and the user must log in again.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [initializing, setInitializing] = useState(() => Boolean(getToken()))

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      try {
        const me = await userService.getMe()
        if (!cancelled) {
          setUser(me)
          localStorage.setItem(USER_KEY, JSON.stringify(me))
        }
      } catch {
        // apiClient already cleared the token on 401; network errors keep the stored user.
        if (!cancelled && !getToken()) {
          setUser(null)
          localStorage.removeItem(USER_KEY)
        }
      } finally {
        if (!cancelled) {
          setInitializing(false)
        }
      }
    }

    if (getToken()) {
      restoreSession()
    }

    return () => {
      cancelled = true
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const login = useCallback(async ({ username, password }) => {
    const auth = await authService.login({ username, password })
    setToken(auth.token)
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
    setUser(auth.user)
    return auth.user
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  const value = { user, initializing, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
