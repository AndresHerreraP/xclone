import { useState } from 'react'
import { createTweet } from '../services/tweetService'

const MAX_LENGTH = 280

/**
 * Tweet composer: multiline textarea, remaining-character counter (280),
 * disabled while submitting to avoid duplicate posts, and success/error alerts.
 */
export function ComposeTweet({ onPublished }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const remaining = MAX_LENGTH - content.length
  const tooLong = content.length > MAX_LENGTH
  const isEmpty = content.trim().length === 0
  const invalid = isEmpty || tooLong

  async function handleSubmit(event) {
    event.preventDefault()
    if (invalid || submitting) {
      return
    }
    setSubmitting(true)
    setError(null)
    setSuccess(false)
    try {
      const tweet = await createTweet(content)
      setContent('')
      setSuccess(true)
      onPublished?.(tweet)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-bottom" noValidate>
      <label htmlFor="tweet-content" className="visually-hidden">
        ¿Qué está pasando?
      </label>
      <textarea
        id="tweet-content"
        className={`form-control bg-transparent ${tooLong ? 'is-invalid' : ''}`}
        rows={3}
        placeholder="¿Qué está pasando?"
        value={content}
        maxLength={MAX_LENGTH + 40}
        onChange={(event) => {
          setContent(event.target.value)
          setSuccess(false)
          setError(null)
        }}
        disabled={submitting}
      />
      <div className="d-flex align-items-center justify-content-between mt-2">
        <span className={`small ${tooLong ? 'text-danger fw-bold' : remaining <= 20 ? 'text-warning' : 'text-secondary'}`}>
          {remaining} caracteres restantes
        </span>
        <button type="submit" className="btn btn-x" disabled={invalid || submitting}>
          {submitting && <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />}
          Publicar
        </button>
      </div>
      {tooLong && (
        <div className="text-danger small mt-1" role="alert">
          El mensaje no puede superar los {MAX_LENGTH} caracteres.
        </div>
      )}
      {success && (
        <div className="alert alert-success py-2 mt-2 mb-0" role="status">
          <i className="bi bi-check-circle me-1" aria-hidden="true" />
          Tweet publicado correctamente
        </div>
      )}
      {error && (
        <div className="alert alert-danger py-2 mt-2 mb-0" role="alert">
          {error}
        </div>
      )}
    </form>
  )
}
