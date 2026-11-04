
import { useState } from "react";
import { followUser } from "../services/social";

export function FollowForm({ onFollowed }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const result = await followUser(username);
      setMessage(result.message);
      setUsername("");
      if (onFollowed) onFollowed();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="follow-form" onSubmit={handleSubmit}>
      <label className="follow-form-title" htmlFor="follow-username">
        Seguir a un usuario
      </label>
      <div className="follow-form-row">
        <input
          id="follow-username"
          type="text"
          placeholder="@nombredeusuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          aria-label="Nombre de usuario a seguir"
        />
        <button type="submit" className="btn btn-light" disabled={loading || !username.trim()}>
          {loading ? "..." : "Seguir"}
        </button>
      </div>
      {message && <p className="follow-form-message" role="status">{message}</p>}
    </form>
  );
}
