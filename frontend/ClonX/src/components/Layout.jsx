import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/** Common shell for internal screens: header with brand, current user and logout. */
export function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="app-navbar fixed-top">
        <nav className="app-shell d-flex align-items-center justify-content-between px-3 py-2">
          <Link to="/" className="text-decoration-none text-body d-flex align-items-center gap-2 fw-bold">
            <i className="bi bi-twitter-x text-body fs-4" aria-hidden="true" />
            <span className="d-none d-sm-inline">XClone</span>
          </Link>
          <div className="d-flex align-items-center gap-3">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link px-2 ${isActive ? 'fw-bold text-body' : 'text-secondary'}`}
            >
              <i className="bi bi-house-door me-1" aria-hidden="true" />
              Inicio
            </NavLink>
            <NavLink
              to={`/users/${user.username}`}
              className={({ isActive }) => `nav-link px-2 ${isActive ? 'fw-bold text-body' : 'text-secondary'}`}
            >
              <i className="bi bi-person me-1" aria-hidden="true" />
              Perfil
            </NavLink>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <i className="bi bi-box-arrow-right me-1" aria-hidden="true" />
              Salir
            </button>
          </div>
        </nav>
      </header>
      <main className="app-shell app-main">
        <Outlet />
      </main>
    </>
  )
}
