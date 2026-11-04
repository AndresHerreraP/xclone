
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "../components/Pagination";
import { UserList } from "../components/UserList";
import { getFollowers, getFollowing } from "../services/users";
import { getStoredUser } from "../services/authService";

export function FollowList({ type }) {
  const { username } = useParams();
  const [data, setData] = useState({ items: [], page: 1, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("Cargando lista...");

  useEffect(() => {
    async function run() {
      try {
        const request = type === "followers" ? getFollowers : getFollowing;
        const result = await request(username, page);
        setData(result);
        setStatus("");
      } catch (error) {
        setStatus(error.message);
      }
    }
    run();
  }, [page, type, username]);

  const title = type === "followers" ? "Seguidores" : "Seguidos";
  const me = getStoredUser();

  return (
    <div className="feed-page">
      <div className="feed-shell list-shell">
        <aside className="feed-sidebar">
          <div className="feed-x-mark">X</div>
          <nav className="feed-navigation" aria-label="Navegación principal">
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-house-door-fill" /><span>Inicio</span></Link>
            <Link className="feed-nav-item" to="/search"><i className="bi bi-search" /><span>Explorar</span></Link>
            <Link className="feed-nav-item" to="/notifications"><i className="bi bi-bell" /><span>Notificaciones</span></Link>
            <Link className="feed-nav-item active" to={`/users/${me?.username}`}><i className="bi bi-person" /><span>Perfil</span></Link>
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-three-dots" /><span>Mas</span></Link>
            <Link className="feed-post-button" to="/feed">Publicar</Link>
          </nav>
        </aside>
        <main className="follow-page">
          <header className="follow-page-header">
            <Link to={`/users/${username}`} className="back-link" aria-label="Volver al perfil">Volve</Link>
            <div><h1>Seguidores y seguidos</h1><p>Lista paginada · 10 cuentas por pagina A· orden alfabetico</p></div>
          </header>
          <div className="follow-tabs">
            <Link className={type === "followers" ? "active" : ""} to={`/users/${username}/followers`}>Seguidores</Link>
            <Link className={type === "following" ? "active" : ""} to={`/users/${username}/following`}>Seguidos</Link>
          </div>
          <div className="follow-list-toolbar">
            <span>{title} de @{username} · {data.totalItems || 0} cuentas</span>
            <input type="search" placeholder="@usuario para seguir" aria-label="Buscar usuario" />
          </div>
          {status ? <p role="status">{status}</p> : (
            <>
              <UserList
                key={`${type}-${page}-${data.items.map((user) => user.id).join("-")}`}
                users={data.items}
                emptyMessage={type === "followers" ? "Este usuario todavía no tiene seguidores." : "Este usuario todavía no sigue a nadie."}
                showFollowButton={
                  type === "followers"
                  || (type === "following" && username.toLowerCase() === me?.username?.toLowerCase())
                }
                initiallyFollowed={type === "following" && username.toLowerCase() === me?.username?.toLowerCase()}
              />
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
              <p className="list-footnote">La API ofrece paginacion; la lista se ordena alfabeticamente.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
