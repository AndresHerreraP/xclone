import { request } from './apiClient'

/** Authenticates a user and returns { token, user }. */
export function login({ username, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { username, password },
    auth: false,
  })
}
