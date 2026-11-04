import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "../components/Pagination";
import { TweetItem } from "../components/TweetItem";
import { getUserTweets } from "../services/tweets";
import { getProfile } from "../services/users";
import { followUser, unfollowUser } from "../services/social";
import { clearSession, getStoredUser } from "../services/authService";
import { Trends } from "../components/Trends";

export function Profile() {
  const { username } = useParams();
  const me = getStoredUser();
  const myUsername = me?.username ?? "";
  const isOwnProfile = myUsername.toLowerCase() === username.toLowerCase();
  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState({ items: [], page: 1, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState(false);
  const [status, setStatus] = useState("Cargando perfil...");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const [profileData, tweetsData] = await Promise.all([
          getProfile(username),
          getUserTweets(username, page),
        ]);
        setProfile(profileData);
        setFollowing(Boolean(profileData.isFollowing));
        setTweets(tweetsData);
        setStatus("");
      } catch (error) {
        setStatus(error.message);
      }
    }
    loadProfile();
  }, [page, username]);

  async function toggleFollow() {
    setActionMessage("");
    try {
      const result = following ? await unfollowUser(username) : await followUser(username);
      setFollowing(!following);
      setProfile((current) => ({ ...current, followers: current.followers + (following ? -1 : 1) }));
      setActionMessage(result.message);
    } catch (error) {
      setActionMessage(error.message);
    }
  }

  const initials = (profile?.fullName || profile?.username || "X").slice(0, 1).toUpperCase();

  return (
    <div className="feed-page">
      <div className="feed-shell profile-shell">
        <aside className="feed-sidebar">
          <div className="feed-x-mark">X</div>
          <nav className="feed-navigation" aria-label="Navegación principal">
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-house-door-fill" /><span>Inicio</span></Link>
            <Link className="feed-nav-item" to="/search"><i className="bi bi-search" /><span>Explorar</span></Link>
            <Link className="feed-nav-item" to="/notifications"><i className="bi bi-bell" /><span>Notificaciones</span></Link>
            <Link className="feed-nav-item active" to={`/users/${username}`}><i className="bi bi-person" /><span>Perfil</span></Link>
            <Link className="feed-nav-item" to="/feed"><i className="bi bi-three-dots" /><span>Mas opciones</span></Link>
            <Link className="feed-post-button" to="/feed">Postear</Link>
          </nav>
          <button type="button" className="profile-logout" onClick={() => { clearSession(); window.location.href = "/login"; }}>Cerrar sesión</button>
        </aside>

        <main className="profile-main">
          <header className="profile-topbar">
            <Link to="/feed" className="back-link" aria-label="Volver al feed">Regresar</Link>
            <div><strong>{profile?.fullName || "Perfil"}</strong><span>{tweets.totalItems || 0} posts</span></div>
          </header>
          {status ? <p className="profile-status" role="status">{status}</p> : profile && (
            <>
              <div className="profile-cover" />
              <section className="profile-summary">
                <div className="profile-avatar">{initials}</div>
                <div className="profile-actions">
                  {!isOwnProfile && <button type="button" className={`profile-follow-button ${following ? "is-following" : ""}`} onClick={toggleFollow}>{following ? "Dejar de seguir" : "Seguir"}</button>}
                </div>
                <h1>{profile.fullName}</h1>
                <p className="profile-handle">@{profile.username}</p>
                <p className="profile-bio">Usuario de ClonX compartiendo ideas y publicaciones.</p>
                <p className="profile-joined"><i className="bi bi-calendar3" /> Se unido recientemente</p>
                <div className="profile-links">
                  <Link to={`/users/${profile.username}/following`}><strong>{profile.following}</strong> Siguiendo</Link>
                  <Link to={`/users/${profile.username}/followers`}><strong>{profile.followers}</strong> Seguidores</Link>
                </div>
                {actionMessage && <p className="follow-form-message" role="status">{actionMessage}</p>}
              </section>
              <nav className="profile-tabs" aria-label="Contenido del perfil">
                <button type="button" className="active">Posts</button>
                <button type="button">Respuestas</button>
                <button type="button">Multimedia</button>
              </nav>
              <section className="profile-tweets">
                {tweets.items.length === 0 && <p className="list-empty">Este usuario aún no tiene tweets.</p>}
                {tweets.items.map((tweet) => <TweetItem key={tweet.id} tweet={tweet} />)}
                <Pagination page={tweets.page} totalPages={tweets.totalPages} onPageChange={setPage} />
              </section>
            </>
          )}
        </main>

        <aside className="feed-right profile-right">
          <label className="feed-search"><i className="bi bi-search" /><input type="search" placeholder="Buscar en X" aria-label="Buscar en X" /></label>
          <div className="feed-card"><h2>A quién seguir</h2><p>Encuentra cuentas para seguir y ver sus publicaciones.</p></div>
          <Trends />
        </aside>
      </div>
    </div>
  );
}
