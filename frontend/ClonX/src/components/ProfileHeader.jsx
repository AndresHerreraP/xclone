import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { formatDateTime } from '../utils/formatDate'
import * as userService from '../services/userService'

/**
 * Profile header shared by the own profile and public profiles:
 * full name, @username, counters, and the follow button only when it applies
 * (never on the own profile). Follow updates counters and the button in place.
 */
export function ProfileHeader({ profile, onProfileChange }) {
  const { user: currentUser } = useAuth()
  const [following, setFollowing] = useState(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState(null)

  if (!profile) {
    return null
  }

  const isOwn = currentUser?.username === profile.username
  const isFollowing = following ?? profile.isFollowing

  async function handleFollow() {
    setWorking(true)
    setError(null)
    try {
      const updated = await userService.followUser(profile.username)
      setFollowing(true)
      onProfileChange?.(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="p-3 border-bottom">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="avatar avatar-lg" aria-hidden="true">
          {profile.fullName.charAt(0).toUpperCase()}
        </div>
        {!isOwn && (
          <button
            type="button"
            className={`btn btn-sm ${isFollowing ? 'btn-outline-danger' : 'btn-x'}`}
            onClick={handleFollow}
            disabled={working}
          >
            {working && <span className="spinner-border spinner-border-sm me-1" aria-hidden="true" />}
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </div>
      <h1 className="h4 fw-bold mb-0">{profile.fullName}</h1>
      <p className="text-secondary mb-2">@{profile.username}</p>
      {profile.createdAt && (
        <p className="text-secondary small mb-2">
          <i className="bi bi-calendar3 me-1" aria-hidden="true" />
          Se unió el {formatDateTime(profile.createdAt)}
        </p>
      )}
      <div className="d-flex gap-4">
        <Link className="text-decoration-none text-body" to={`/users/${profile.username}/following`}>
          <strong>{profile.followingCount}</strong> <span className="text-secondary">seguidos</span>
        </Link>
        <Link className="text-decoration-none text-body" to={`/users/${profile.username}/followers`}>
          <strong>{profile.followersCount}</strong> <span className="text-secondary">seguidores</span>
        </Link>
      </div>
      {error && (
        <div className="alert alert-danger py-2 mt-3 mb-0" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
