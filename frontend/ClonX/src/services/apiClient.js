// Central HTTP client for the X clone API.
// The base URL comes from VITE_API_URL (see .env.example); it is never hardcoded in components.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const TOKEN_KEY = 'xclone_token'

let unauthorizedHandler = null

/** Registers the callback fired when a protected request returns 401 (expired/invalid token). */
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

/** Error carrying the HTTP status and the API's user-facing message. */
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Performs a request against the API.
 * @param {string} path API path, e.g. "/api/feed?page=1"
 * @param {object} options { method, body, auth } - auth=true attaches the Bearer token.
 * @returns {Promise<object>} parsed JSON response
 */
export async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Comprueba tu conexión e inténtalo de nuevo')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    // Response without a JSON body; keep data as null.
  }

  if (!response.ok) {
    if (response.status === 401 && auth && getToken()) {
      // The token is invalid or expired: forget it and force a new login.
      setToken(null)
      localStorage.removeItem('xclone_user')
      if (unauthorizedHandler) {
        unauthorizedHandler()
      }
    }
    throw new ApiError(response.status, data?.message || 'Error inesperado')
  }

  return data
}
