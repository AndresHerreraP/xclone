import { useEffect, useState } from "react";
import { FollowForm } from "../components/FollowForm";
import { Pagination } from "../components/Pagination";
import { TweetComposer } from "../components/TweetComposer";
import { TweetItem } from "../components/TweetItem";
import { getFeed } from "../services/tweets";
import { clearSession, getStoredUser } from "../services/authService";
import { Link } from "react-router-dom";
import { Trends } from "../components/Trends";

export function Feed() {
  const me = getStoredUser();
  const [feed, setFeed] = useState({ items: [], page: 1, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("Cargando feed...");
  const initials = (me?.fullName || me?.username || "X").slice(0, 1).toUpperCase();

  useEffect(() => {
    async function run() {
      try {
        setFeed(await getFeed(page));
        setStatus("");
      } catch (error) {
        setStatus(error.message);
      }
    }
    run();
  }, [page]);

  function focusComposer() {
    document.querySelector("#tweet-composer textarea")?.focus();
  }

  function handlePublished(tweet) {
    setFeed((current) => ({ ...current, items: [tweet, ...current.items] }));
  }

  return (
    <div className="feed-page">
      <div className="feed-shell">
        <aside className="feed-sidebar">
          <div className="feed-x-mark">X</div>
          <nav className="feed-navigation" aria-label="Navegación principal">
            <a className="feed-nav-item active" href="/feed"><i className="bi bi-house-door-fill" /><span>Inicio</span></a>
            <Link className="feed-nav-item" to="/search"><i className="bi bi-search" /><span>Explorar</span></Link>
            <Link className="feed-nav-item" to="/notifications"><i className="bi bi-bell" /><span>Notificaciones</span></Link>
            <a className="feed-nav-item" href={`/users/${me?.username}`}><i className="bi bi-person" /><span>Perfil</span></a>
            <Link className="feed-nav-item" to={`/users/${me?.username}/followers`}><i className="bi bi-people" /><span>Seguidores</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/following`}><i className="bi bi-person-check" /><span>Seguidos</span></Link>
            <button type="button" className="feed-post-button" onClick={focusComposer}>Postear</button>
          </nav>
          <div className="feed-account">
            <div className="avatar">{initials}</div>
            <div><strong>{me?.fullName || "Usuario"}</strong><span>@{me?.username}</span></div>
            <button type="button" onClick={() => { clearSession(); window.location.href = "/login"; }} aria-label="Cerrar sesión">Salir</button>
          </div>
        </aside>

        <main className="feed-main">
          <header className="feed-header">
            <h1>Inicio</h1>
            <div className="feed-tabs">
              <button type="button" className="active">Para ti</button>
              <button type="button">Siguiendo</button>
            </div>
          </header>
          <div className="feed-content">
            <TweetComposer onPublished={handlePublished} />
            {status && <p role="status">{status}</p>}
            {!status && feed.items.length === 0 && <p className="list-empty">No hay tweets en tu feed. Sigue a alguien o publica el primero.</p>}
            {feed.items.map((tweet) => <TweetItem key={tweet.id} tweet={tweet} />)}
            <Pagination page={feed.page} totalPages={feed.totalPages} onPageChange={setPage} />
          </div>
        </main>

        <aside className="feed-right">
          <label className="feed-search"><i className="bi bi-search" /><input type="search" placeholder="Buscar en X" aria-label="Buscar en X" /></label>
          <div className="feed-card premium-card">
            <h2>Suscri­bete a Premium</h2>
            <p>Disfruta de lo mejor de X, contenido exclusivo y una experiencia sin anuncios.</p>
            <button type="button">Suscribirse</button>
          </div>
          <Trends />
          <div className="feed-card follow-card"><h2>A quien seguir</h2><FollowForm /></div>
        </aside>
      </div>
    </div>
  );
}
