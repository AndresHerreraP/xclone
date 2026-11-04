
import { useState } from "react";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../services/social";

export function UserList({ users, emptyMessage, showFollowButton = false, initiallyFollowed = false, onUnfollow }) {
  const [followedUsers, setFollowedUsers] = useState(() =>
    Object.fromEntries(users.map((user) => [user.username, initiallyFollowed || Boolean(user.isFollowing)]))
  );
  const [pendingUsers, setPendingUsers] = useState({});
  const [message, setMessage] = useState("");

  async function handleFollow(user) {
    setMessage("");
    setPendingUsers((current) => ({ ...current, [user.username]: true }));
    try {
      const isFollowed = followedUsers[user.username];
      const result = isFollowed
        ? await unfollowUser(user.username)
        : await followUser(user.username);
      setFollowedUsers((current) => ({ ...current, [user.username]: !isFollowed }));
      if (isFollowed) onUnfollow?.(user.username);
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setPendingUsers((current) => ({ ...current, [user.username]: false }));
    }
  }

  if (users.length === 0) {
    return <p className="list-empty">{emptyMessage}</p>;
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-list-item">
          <Link to={`/users/${user.username}`} className="user-list-info">
            <span className="avatar">{(user.fullName || user.username).slice(0, 1).toUpperCase()}</span>
            <span className="user-list-copy">
            <strong>{user.fullName}</strong>
            <span>@{user.username} Usuario de ClonX</span>
            </span>
          </Link>
          {showFollowButton && (
            <button
              type="button"
              className={`btn follow-btn ${followedUsers[user.username] ? "is-following" : ""}`}
              onClick={() => handleFollow(user)}
              disabled={pendingUsers[user.username]}
            >
              {pendingUsers[user.username] ? "Procesando..." : followedUsers[user.username] ? "Dejar de seguir" : "Seguir"}
            </button>
          )}
        </div>
      ))}
      {message && <p className="follow-form-message" role="status">{message}</p>}
    </div>
  );
}
