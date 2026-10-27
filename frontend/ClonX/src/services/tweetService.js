import { request } from './apiClient'

/** Paginated feed: own tweets plus the ones from followed users, newest first. */
export function getFeed(page = 1, size = 10) {
  return request(`/api/feed?page=${page}&size=${size}`)
}

/** Paginated tweets of one user, newest first. */
export function getUserTweets(username, page = 1, size = 10) {
  return request(`/api/users/${encodeURIComponent(username)}/tweets?page=${page}&size=${size}`)
}

/** Publishes a tweet for the authenticated user (the author comes from the token). */
export function createTweet(content) {
  return request('/api/tweets', { method: 'POST', body: { content } })
}
