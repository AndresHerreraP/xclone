
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatTweetDate } from "../utils/helpers";

export function TweetItem({ tweet }) {
  const storageKey = `xclone_like_${tweet.id}`;
  const [liked, setLiked] = useState(() => localStorage.getItem(storageKey) === "true");
  const [likes, setLikes] = useState(tweet.likes || 0);

  function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    localStorage.setItem(storageKey, String(nextLiked));
  }

  return (
    <article className="tweet-item">
      <header>
        <strong>{tweet.author.fullName}</strong>
        <span>
          , <Link className="tweet-author" to={`/users/${tweet.author.username}`}>
            @{tweet.author.username}
          </Link>{" "}
          - {formatTweetDate(tweet.createdAt)}
        </span>
      </header>
      <p>{tweet.content}</p>
      <div className="tweet-actions" aria-label="Acciones de la publicación">
        <button type="button" aria-label="Responder"><i className="bi bi-chat" /><span>0</span></button>
        <button type="button" aria-label="Republicar"><i className="bi bi-repeat" /><span>0</span></button>
        <button type="button" className={liked ? "liked" : ""} onClick={toggleLike} aria-label={liked ? "Quitar me gusta" : "Dar me gusta"} aria-pressed={liked}>
          <i className={liked ? "bi bi-heart-fill" : "bi bi-heart"} /><span>{likes}</span>
        </button>
        <button type="button" aria-label="Compartir"><i className="bi bi-upload" /></button>
      </div>
    </article>
  );
}
