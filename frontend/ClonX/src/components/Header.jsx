
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getStoredUser } from "../services/authService";

export function Header() {
  const navigate = useNavigate();
  const user = getStoredUser();

  function handleLogOut() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <header className="app-header">
      <Link to="/feed" className="app-brand" aria-label="Ir al inicio">
        <img src="/x-logo.png" alt="Logo de X" />
      </Link>
      <div className="app-header-right">
        <span className="app-username">{user?.fullName}</span>
        <button type="button" className="header-link" onClick={handleLogOut}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
