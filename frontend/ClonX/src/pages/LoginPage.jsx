import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Login screen: username + password, required-field validation and real API login. */
export function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [apiError, setApiError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = {}
    if (!username.trim()) {
      errors.username = 'Ingresa tu nombre de usuario'
    }
    if (!password) {
      errors.password = 'Ingresa tu contraseña'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    setSubmitting(true)
    setApiError(null)
    try {
      await login({ username: username.trim(), password })
      const from = location.state?.from?.pathname
      navigate(from && from !== '/login' ? from : '/', { replace: true })
    } catch (err) {
      if (err.status === 401) {
        setApiError('Usuario o contraseña incorrectos')
      } else {
        setApiError(err.message || 'No se pudo iniciar sesión. Comprueba tu conexión e inténtalo de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-screen d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="login-card w-100">
        <div className="text-center mb-4">
          <i className="bi bi-twitter-x fs-1" aria-hidden="true" />
          <h1 className="h3 fw-bold mt-2 mb-1">Inicia sesión en XClone</h1>
          <p className="text-secondary mb-0">Usa tu cuenta de prueba para entrar.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              autoFocus
            />
            {fieldErrors.username && <div className="text-danger small mt-1">{fieldErrors.username}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              type="password"
              className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            {fieldErrors.password && <div className="text-danger small mt-1">{fieldErrors.password}</div>}
          </div>
          {apiError && (
            <div className="alert alert-danger py-2" role="alert">
              {apiError}
            </div>
          )}
          <button type="submit" className="btn btn-x w-100" disabled={submitting}>
            {submitting && <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />}
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
