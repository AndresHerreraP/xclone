
import { useState } from "react";
import { publishTweet } from "../services/tweets";

export const MAX_TWEET_LENGTH = 280;

export function TweetComposer({ onPublished }) {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const remaining = MAX_TWEET_LENGTH - content.length;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      const tweet = await publishTweet(content);
      setContent("");
      onPublished(tweet);
      setMessage("Tweet publicado!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form id="tweet-composer" className="tweet-composer" onSubmit={handleSubmit}>
      <textarea
        value={content}
        maxLength={MAX_TWEET_LENGTH}
        placeholder="¿Que está pasando?"
        onChange={(event) => setContent(event.target.value)}
      />
      <div className="tweet-composer-footer">
        <span className="char-counter">{remaining}</span>
        <button type="submit" className="btn btn-light" disabled={loading || !content.trim()}>
          {loading ? "Publicando..." : "Publicar"}
        </button>
      </div>
      {message && <small role="status">{message}</small>}
    </form>
  );
}
