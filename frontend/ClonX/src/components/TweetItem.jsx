import { formatDateTime } from '../utils/formatDate'

/**
 * A single tweet, always shown as:
 * full name, @username, publication date/time, message body.
 */
export function TweetItem({ tweet }) {
  const { author, createdAt, content } = tweet

  return (
    <article className="tweet-card d-flex gap-3 py-3">
      <div className="avatar flex-shrink-0" aria-hidden="true">
        {author.fullName.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0">
        <div className="d-flex flex-wrap align-items-baseline gap-x-1 tweet-head">
          <span className="fw-bold">{author.fullName}</span>
          <span className="text-secondary">@{author.username}</span>
          <span className="text-secondary" aria-hidden="true">·</span>
          <time className="text-secondary" dateTime={createdAt}>{formatDateTime(createdAt)}</time>
        </div>
        <p className="tweet-content mb-0 mt-1">{content}</p>
      </div>
    </article>
  )
}
