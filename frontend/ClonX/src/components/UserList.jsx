import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import * as userService from '../services/userService'

/**
 * Row of a followers/following list: avatar, full name, @username,
 * link to the profile, and a follow button when the connected user
 * does not follow that person yet (and the row is not the user himself).
 */
export function UserListItem({ user: rowUser, onFollowedChange }) {
  const { user: currentUser } = useAuth()
  const [working, setWorking] = useState(false)
  const [error, setError] = useState(null)

  const isSelf = currentUser?.id === rowUser.id
  const canFollow = !isSelf && !rowUser.isFollowing

  async function handleFollow() {
    setWorking(true)
    setError(null)
    try {
      await userService.followUser(rowUser.username)
      onFollowedChange?.(rowUser.username)
    } catch (err) {
      setError(err.message)
    } finally {
      setWorking(false)
    }
  }

  return (
    <li className="list-group-item bg-transparent">
      <div className="d-flex align-items-center justify-content-between gap-2 py-1">
        <Link
          to={`/users/${rowUser.username}`}
          className="d-flex align-items-center gap-3 text-decoration-none text-body min-w-0"
        >
          <div className="avatar" aria-hidden="true">
            {rowUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="fw-bold text-truncate">{rowUser.fullName}</div>
            <div className="text-secondary small text-truncate">@{rowUser.username}</div>
          </div>
        </Link>
        {canFollow && (
          <button type="button" className="btn btn-x btn-sm flex-shrink-0" onClick={handleFollow} disabled={working}>
            {working && <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />}
            Seguir
          </button>
        )}
        {isSelf && <span className="badge text-secondary border border-secondary-subtle rounded-pill">Tú</span>}
      </div>
      {error && <div className="alert alert-danger py-1 px-2 mt-2 mb-0 small" role="alert">{error}</div>}
    </li>
  )
}

/** Renders a list of users with loading / error / empty states handled by the caller. */
export function UserList({ users, onFollowedChange }) {
  return (
    <ul className="list-group list-group-flush">
      {users.map((rowUser) => (
        <UserListItem key={rowUser.id} user={rowUser} onFollowedChange={onFollowedChange} />
      ))}
    </ul>
  )
}
