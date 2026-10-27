// API test suite for the X clone backend. Runs real HTTP checks against the
// running Spring Boot API (http://localhost:8080) and verifies persistence rules
// from the HTTP contract (database checks live in the database setup steps).
// Usage: node api-tests.mjs   (backend must be running)
const BASE = process.env.API_BASE_URL || 'http://localhost:8080'
const results = []

function record(name, pass, detail = '') {
  results.push({ name, pass })
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ' — ' + detail : ''}`)
}

async function post(path, body, headers = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return { status: response.status, data: await response.json().catch(() => null) }
}

async function get(path, headers = {}) {
  const response = await fetch(`${BASE}${path}`, { headers })
  return { status: response.status, data: await response.json().catch(() => null) }
}

try {
  // --- Auth ---
  const okLogin = await post('/api/auth/login', { username: 'laurag', password: 'password123' })
  const token = okLogin.data?.token
  record('Login with valid credentials returns 200 + token + user',
    okLogin.status === 200 && Boolean(token) && okLogin.data.user?.username === 'laurag' &&
    !JSON.stringify(okLogin.data).includes('$2a') && !JSON.stringify(okLogin.data).includes('passwordHash'),
    `status=${okLogin.status}`)

  const badLogin = await post('/api/auth/login', { username: 'laurag', password: 'nope' })
  record('Login with wrong password returns 401 with message',
    badLogin.status === 401 && Boolean(badLogin.data?.message), `message="${badLogin.data?.message}"`)

  const unknownLogin = await post('/api/auth/login', { username: 'no-such-user-xyz', password: 'whatever' })
  record('Login with unknown user returns 401 (no user enumeration)',
    unknownLogin.status === 401, `status=${unknownLogin.status}`)

  const auth = { Authorization: `Bearer ${token}` }

  // --- Protected endpoints require authentication ---
  const noToken = await get('/api/users/me')
  record('Protected endpoint without token returns 401',
    noToken.status === 401 && Boolean(noToken.data?.message))

  const badToken = await get('/api/users/me', { Authorization: 'Bearer not.a.jwt' })
  record('Protected endpoint with invalid token returns 401', badToken.status === 401)

  // --- Current user ---
  const me = await get('/api/users/me', auth)
  record('GET /api/users/me returns profile with counters',
    me.status === 200 && me.data?.username === 'laurag' && me.data?.followersCount === 24 &&
    Number.isInteger(me.data?.followingCount) && me.data?.followingCount >= 12,
    `followers=${me.data?.followersCount} following=${me.data?.followingCount}`)

  // --- Profiles ---
  const profile = await get('/api/users/carlosr', auth)
  record('GET /api/users/{username} returns profile with isFollowing boolean',
    profile.status === 200 && typeof profile.data?.isFollowing === 'boolean')

  const notFound = await get('/api/users/ghost-user-xyz', auth)
  record('Profile of unknown user returns 404', notFound.status === 404)

  // --- Pagination validation ---
  const page0 = await get('/api/users/laurag/tweets?page=0&size=10', auth)
  const size999 = await get('/api/users/laurag/tweets?page=1&size=999', auth)
  record('Invalid page/size return 400', page0.status === 400 && size999.status === 400)

  // --- User tweets pagination ---
  const tweets = await get('/api/users/laurag/tweets?page=1&size=10', auth)
  const tweetsSorted = (tweets.data?.items ?? []).every((t, i, a) => i === 0 || a[i - 1].createdAt >= t.createdAt)
  record('User tweets are paginated and newest first',
    tweets.status === 200 && tweets.data?.page === 1 && tweets.data?.size === 10 && tweetsSorted)

  // --- Followers / following lists ---
  const followers = await get('/api/users/laurag/followers?page=1&size=10', auth)
  const followersAlpha = (followers.data?.items ?? []).every((u, i, a) => i === 0 || a[i - 1].fullName.localeCompare(u.fullName, 'es') <= 0)
  record('Followers list: 10 per page, alphabetical by full name',
    followers.status === 200 && followers.data?.items?.length === 10 && followersAlpha && followers.data?.totalItems === 24)

  const following = await get('/api/users/laurag/following?page=1&size=10', auth)
  const followingAlpha = (following.data?.items ?? []).every((u, i, a) => i === 0 || a[i - 1].fullName.localeCompare(u.fullName, 'es') <= 0)
  record('Following list: 10 per page, alphabetical by full name',
    following.status === 200 && following.data?.items?.length === 10 && followingAlpha)

  // --- Feed ---
  const feed = await get('/api/feed?page=1&size=10', auth)
  const feedSorted = (feed.data?.items ?? []).every((t, i, a) => i === 0 || a[i - 1].createdAt >= t.createdAt)
  record('Feed is paginated and newest first',
    feed.status === 200 && feedSorted && (feed.data?.items?.length ?? 0) > 0)

  // --- Tweets: create / validate ---
  const stamp = Date.now()
  const created = await post('/api/tweets', { content: `api-tests ${stamp}: persistence check` }, auth)
  record('POST /api/tweets returns 201 with author from the token',
    created.status === 201 && created.data?.author?.username === 'laurag' && created.data?.id > 0)

  const emptyTweet = await post('/api/tweets', { content: '   ' }, auth)
  const longTweet = await post('/api/tweets', { content: 'x'.repeat(281) }, auth)
  record('Empty and >280 tweets return 400 with message',
    emptyTweet.status === 400 && longTweet.status === 400 && Boolean(emptyTweet.data?.message))

  const tweetNoToken = await post('/api/tweets', { content: 'anonymous' })
  record('POST /api/tweets without token returns 401', tweetNoToken.status === 401)

  // --- Follows: valid / duplicate / self / unknown / unauthenticated ---
  // nataliao is not in laurag's seed follows; if a previous run followed her, expect 409.
  const nataliaBefore = await get('/api/users/nataliao', auth)
  const followCreated = await post('/api/follows', { username: 'nataliao' }, auth)
  if (nataliaBefore.data?.isFollowing === false) {
    record('POST /api/follows returns 201 and followed profile with isFollowing=true',
      followCreated.status === 201 && followCreated.data?.isFollowing === true,
      `status=${followCreated.status}`)
  } else {
    record('POST /api/follows returns 201 and followed profile with isFollowing=true',
      followCreated.status === 409,
      'already following from a previous run (idempotent check)')
  }

  const followDuplicate = await post('/api/follows', { username: 'anat' }, auth)
  record('Duplicate follow returns 409', followDuplicate.status === 409)

  const followSelf = await post('/api/follows', { username: 'laurag' }, auth)
  record('Self follow returns 400', followSelf.status === 400)

  const followUnknown = await post('/api/follows', { username: 'ghost-user-xyz' }, auth)
  record('Follow of unknown user returns 404', followUnknown.status === 404)

  const followNoToken = await post('/api/follows', { username: 'anat' })
  record('POST /api/follows without token returns 401', followNoToken.status === 401)

  // --- Register excluded ---
  const registerNoToken = await post('/api/auth/register', { fullName: 'T', username: `t${stamp}`, email: `t${stamp}@x.dev`, password: '12345678' })
  const registerWithToken = await post('/api/auth/register', { fullName: 'T', username: `t${stamp}`, email: `t${stamp}@x.dev`, password: '12345678' }, auth)
  record('Register is excluded: anonymous gets 401, authenticated gets 404',
    registerNoToken.status === 401 && registerWithToken.status === 404,
    `statuses=${registerNoToken.status}/${registerWithToken.status}`)
} catch (err) {
  record('Unexpected suite error', false, err.message)
}

const passed = results.filter((r) => r.pass).length
console.log(`\n${passed}/${results.length} API tests passed`)
process.exitCode = results.every((r) => r.pass) ? 0 : 1
