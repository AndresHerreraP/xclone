import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStoredUser } from "../services/authService";
import { getNotifications } from "../services/notifications";
import { Pagination } from "../components/Pagination";

export function Notifications() {
  const me = getStoredUser();
  const [data, setData] = useState({ items: [], page: 1, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("Cargando notificaciones...");

  useEffect(() => {
    getNotifications(page).then((result) => { setData(result); setStatus(""); })
      .catch((error) => setStatus(error.message));
  }, [page]);

  return (
    <div className="feed-page">
      <div className="feed-shell notifications-shell">
        <aside className="feed-sidebar">
          <div className="feed-x-mark">X</div>
          <nav className="feed-navigation" aria-label="Navegación principal">
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-house-door-fill" /><span>Inicio</span></Link>
            <Link className="feed-nav-item" to="/search"><i className="bi bi-search" /><span>Explorar</span></Link>
            <Link className="feed-nav-item active" to="/notifications"><i className="bi bi-bell-fill" /><span>Notificaciones</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}`}><i className="bi bi-person" /><span>Perfil</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/followers`}><i className="bi bi-people" /><span>Seguidores</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/following`}><i className="bi bi-person-check" /><span>Seguidos</span></Link>
            <Link className="feed-post-button" to="/feed">Postear</Link>
          </nav>
        </aside>
        <main className="notifications-main">
          <header className="notifications-header"><h1>Notificaciones</h1></header>
          <section className="notifications-list">
            {status && <p role="status">{status}</p>}
            {!status && data.items.length === 0 && <p className="list-empty">Todavía no tienes notificaciones.</p>}
            {!status && data.items.map((notification) => {
              const actor = notification.actor;
              return (
                <article className="notification-item" key={`${notification.type}-${actor.id}-${notification.createdAt}`}>
                  <i className="notification-type bi bi-person-plus-fill" />
                  <span className="avatar">{actor.fullName.slice(0, 1).toUpperCase()}</span>
                  <div><p><Link to={`/users/${actor.username}`}>{actor.fullName}</Link> {notification.message}</p><span>{new Date(notification.createdAt).toLocaleString("es-CO")}</span></div>
                </article>
              );
            })}
            {!status && <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />}
          </section>
        </main>
      </div>
    </div>
  );
}
