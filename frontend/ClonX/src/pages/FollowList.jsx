
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
  const [search, setSearch] = useState("");

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
  const normalizedSearch = search.trim().toLowerCase();
  const filteredUsers = data.items.filter((user) =>
    !normalizedSearch
    || (user.fullName || "").toLowerCase().includes(normalizedSearch)
    || (user.username || "").toLowerCase().includes(normalizedSearch)
  );

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
            <Link className="feed-nav-item" to={`/users/${me?.username}/followers`}><i className="bi bi-people" /><span>Seguidores</span></Link>
            <Link className="feed-nav-item" to={`/users/${me?.username}/following`}><i className="bi bi-person-check" /><span>Seguidos</span></Link>
            <Link className="feed-post-button" to="/feed">Publicar</Link>
          </nav>
        </aside>
        <main className="follow-page">
          <header className="follow-page-header">
            <Link to={`/users/${username}`} className="back-link" aria-label="Volver al perfil">Volve</Link>
            <div><h1>{title}</h1><p>{type === "followers" ? "Personas que siguen a" : "Personas que sigue"} @{username} · 10 cuentas por página</p></div>
          </header>
          <div className="follow-tabs">
            <Link className={type === "followers" ? "active" : ""} to={`/users/${username}/followers`}>Seguidores</Link>
            <Link className={type === "following" ? "active" : ""} to={`/users/${username}/following`}>Seguidos</Link>
          </div>
          <div className="follow-list-toolbar">
            <span>{title} de @{username} · {data.totalItems || 0} cuentas</span>
            <input
              type="search"
              placeholder="Buscar por nombre o @usuario"
              aria-label={`Filtrar ${title.toLowerCase()}`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          {status ? <p role="status">{status}</p> : (
            <>
              <UserList
                key={`${type}-${page}-${data.items.map((user) => user.id).join("-")}`}
                users={filteredUsers}
                emptyMessage={normalizedSearch
                  ? "No hay coincidencias para esa búsqueda."
                  : type === "followers" ? "Este usuario todavía no tiene seguidores." : "Este usuario todavía no sigue a nadie."}
                showFollowButton={
                  type === "followers"
                  || (type === "following" && username.toLowerCase() === me?.username?.toLowerCase())
                }
                initiallyFollowed={type === "following" && username.toLowerCase() === me?.username?.toLowerCase()}
                onUnfollow={(unfollowedUsername) => {
                  if (type !== "following" || username.toLowerCase() !== me?.username?.toLowerCase()) return;
                  setData((current) => ({
                    ...current,
                    items: current.items.filter((user) => user.username !== unfollowedUsername),
                    totalItems: Math.max(0, current.totalItems - 1),
                  }));
                }}
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
