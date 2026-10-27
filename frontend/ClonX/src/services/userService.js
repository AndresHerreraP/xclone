import { request } from './apiClient'

/** Current authenticated user with follower/following counters. */
export function getMe() {
  return request('/api/users/me')
}

/** Public profile of any user, with counters and isFollowing. */
export function getProfile(username) {
  return request(`/api/users/${encodeURIComponent(username)}`)
}

/** Paginated list of users following `username` (alphabetical by full name). */
export function getFollowers(username, page = 1, size = 10) {
  return request(`/api/users/${encodeURIComponent(username)}/followers?page=${page}&size=${size}`)
}

/** Paginated list of users followed by `username` (alphabetical by full name). */
export function getFollowing(username, page = 1, size = 10) {
  return request(`/api/users/${encodeURIComponent(username)}/following?page=${page}&size=${size}`)
}

/** Follows a user by username; returns the followed user's updated profile. */
export function followUser(username) {
  return request('/api/follows', { method: 'POST', body: { username } })
}
