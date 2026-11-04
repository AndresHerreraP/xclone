
import { useState } from "react";
import { Link } from "react-router-dom";
import { followUser, unfollowUser } from "../services/social";

export function UserList({ users, emptyMessage, showFollowButton = false, initiallyFollowed = false }) {
  const [followedUsers, setFollowedUsers] = useState(() =>
    Object.fromEntries(users.map((user) => [user.username, initiallyFollowed || Boolean(user.isFollowing)]))
  );
  const [message, setMessage] = useState("");

  async function handleFollow(user) {
    setMessage("");
    try {
      const isFollowed = followedUsers[user.username];
      const result = isFollowed
        ? await unfollowUser(user.username)
        : await followUser(user.username);
      setFollowedUsers((current) => ({ ...current, [user.username]: !isFollowed }));
      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
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
            >
              {followedUsers[user.username] ? "Dejar de seguir" : "Seguir"}
            </button>
          )}
        </div>
      ))}
      {message && <p className="follow-form-message" role="status">{message}</p>}
    </div>
  );
}
