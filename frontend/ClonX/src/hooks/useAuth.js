import { createContext, useContext } from 'react'

/** Session context: { user, initializing, login, logout }. Created here (a plain .js file,
 * no components) so react-refresh can hot-reload the AuthProvider cleanly. */
export const AuthContext = createContext(null)

/** Access to the session state. */
export function useAuth() {
  return useContext(AuthContext)
}
