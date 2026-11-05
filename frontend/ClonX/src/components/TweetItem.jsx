
import { Link } from "react-router-dom";
import { useState } from "react";
import { formatTweetDate } from "../utils/helpers";
import { likeTweet, repostTweet } from "../services/tweets";

export function TweetItem({ tweet }) {
  const [liked, setLiked] = useState(Boolean(tweet.likedByMe));
  const [likes, setLikes] = useState(Number(tweet.likes) || 0);
  const [reposted, setReposted] = useState(Boolean(tweet.repostedByMe));
  const [reposts, setReposts] = useState(Number(tweet.reposts) || 0);
  const [pending, setPending] = useState("");
  const [message, setMessage] = useState("");

  async function toggle(action) {
    if (pending) return;
    setMessage("");
    setPending(action);
    if (action === "like") {
      const previousLiked = liked;
      setLiked(!liked);
      setLikes((current) => Math.max(0, current + (liked ? -1 : 1)));
      try {
        const result = await likeTweet(tweet.id);
        setLiked(Boolean(result.liked));
        setLikes(Number(result.likes) || 0);
      } catch (error) {
        setLiked(previousLiked);
        setLikes((current) => Math.max(0, current + (previousLiked ? 1 : -1)));
        setMessage(error.message);
      }
    } else {
      const previousReposted = reposted;
      setReposted(!reposted);
      setReposts((current) => Math.max(0, current + (reposted ? -1 : 1)));
      try {
        const result = await repostTweet(tweet.id);
        setReposted(Boolean(result.reposted));
        setReposts(Number(result.reposts) || 0);
      } catch (error) {
        setReposted(previousReposted);
        setReposts((current) => Math.max(0, current + (previousReposted ? 1 : -1)));
        setMessage(error.message);
      }
    }
    setPending("");
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
        <button type="button" className={reposted ? "reposted" : ""} onClick={() => toggle("repost")} disabled={Boolean(pending)} aria-label={reposted ? "Quitar republicación" : "Republicar"} aria-pressed={reposted}>
          <i className="bi bi-repeat" /><span>{reposts}</span>
        </button>
        <button type="button" className={liked ? "liked" : ""} onClick={() => toggle("like")} disabled={Boolean(pending)} aria-label={liked ? "Quitar me gusta" : "Dar me gusta"} aria-pressed={liked}>
          <i className={liked ? "bi bi-heart-fill" : "bi bi-heart"} /><span>{likes}</span>
        </button>
        <button type="button" aria-label="Compartir"><i className="bi bi-upload" /></button>
      </div>
      {message && <p className="follow-form-message" role="status">{message}</p>}
    </article>
  );
}
