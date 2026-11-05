import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../services/authService";
import { getUsers } from "../services/users";
import { followUser, unfollowUser } from "../services/social";
import { Trends } from "../components/Trends";

export function Search() {
  const me = getStoredUser();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Cargando usuarios...");
  const [following, setFollowing] = useState({});
  const [followMessage, setFollowMessage] = useState("");

  useEffect(() => {
    getUsers(query)
      .then((items) => {
        setUsers(items);
        setFollowing(Object.fromEntries(items.map((user) => [user.username, Boolean(user.isFollowing)])));
        setStatus("");
      })
      .catch((error) => setStatus(error.message));
  }, [query]);

  const suggestions = useMemo(
    () => users.filter((user) => user.username !== me?.username).slice(0, 4),
    [me?.username, users]
  );

  async function handleFollow(username) {
    setFollowMessage("");
    try {
      if (following[username]) {
        await unfollowUser(username);
        setFollowing((current) => ({ ...current, [username]: false }));
      } else {
        await followUser(username);
        setFollowing((current) => ({ ...current, [username]: true }));
      }
    } catch (error) {
      setFollowMessage(error.message);
    }
  }

  return (
    <div className="feed-page">
      <div className="feed-shell search-shell">
        <aside className="feed-sidebar">
          <div className="feed-x-mark">X</div>
          <nav className="feed-navigation" aria-label="Navegación principal">
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-house-door-fill" /><span>Inicio</span></Link>
            <Link className="feed-nav-item active" to="/search"><i className="bi bi-search" /><span>Explorar</span></Link>
            <Link className="feed-nav-item" to="/notifications"><i className="bi bi-bell" /><span>Notificaciones</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}`}><i className="bi bi-person" /><span>Perfil</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/followers`}><i className="bi bi-people" /><span>Seguidores</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/following`}><i className="bi bi-person-check" /><span>Seguidos</span></Link>
            <Link className="feed-post-button" to="/feed">Postear</Link>
          </nav>
          <div className="feed-account">
            <div className="avatar">{(me?.fullName || "X").slice(0, 1).toUpperCase()}</div>
            <div><strong>{me?.fullName || "Usuario"}</strong><span>@{me?.username}</span></div>
            <span className="account-more">···</span>
          </div>
        </aside>

        <main className="search-main">
          <header className="search-header">
            <label className="search-input">
              <i className="bi bi-search" />
              <input type="search" placeholder="Buscar" aria-label="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} autoFocus />
            </label>
            <button type="button" className="search-settings" aria-label="Configuración de búsqueda">
              <i className="bi bi-gear-fill" />
            </button>
          </header>
          <nav className="search-tabs" aria-label="Secciones de explorar">
            <button type="button" className="active">Explorar</button>
            <button type="button">Tendencias</button>
            <button type="button">Noticias</button>
            <button type="button">Deportes</button>
          </nav>
          <Trends className="search-trends" />
        </main>

        <aside className="search-right">
          <div className="search-card">
            <div className="search-card-heading">
              <h2>A quién seguir</h2>
              <Link to={`/users/${me?.username}/following`}>Ver seguidos</Link>
            </div>
            {status && <p role="status">{status}</p>}
            {!status && suggestions.map((suggestion) => (
              <div className="search-suggestion" key={suggestion.username}>
                <Link
                  to={`/users/${suggestion.username}`}
                  className="search-suggestion-profile"
                  aria-label={`Ver el perfil de ${suggestion.fullName || suggestion.username}`}
                >
                  <span className="avatar">{(suggestion.fullName || suggestion.username).slice(0, 1).toUpperCase()}</span>
                  <span className="search-suggestion-copy">
                    <strong>{suggestion.fullName}</strong>
                    <span>@{suggestion.username}</span>
                  </span>
                </Link>
                <button type="button" className={following[suggestion.username] ? "is-following" : ""} onClick={() => handleFollow(suggestion.username)}>
                  {following[suggestion.username] ? "Dejar de seguir" : "Seguir"}
                </button>
              </div>
            ))}
            {!status && suggestions.length === 0 && <p>No hay usuarios para mostrar.</p>}
            {followMessage && <p className="follow-form-message" role="status">{followMessage}</p>}
            <Link to="/feed" className="show-more">Mostrar más</Link>
          </div>
          <p className="search-footer">Términos de Servicio · Política de Privacidad · Política de cookies<br />© 2025 ClonX</p>
        </aside>
      </div>
    </div>
  );
}
