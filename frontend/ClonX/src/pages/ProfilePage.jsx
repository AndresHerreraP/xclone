import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { ProfileHeader } from '../components/ProfileHeader'
import { TweetItem } from '../components/TweetItem'
import { getUserTweets } from '../services/tweetService'
import { getProfile } from '../services/userService'

/** Profile screen for any username: header with counters and paginated tweets. */
export function ProfilePage() {
  const { username } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // The page lives in the URL (?page=n) so it survives reloads and resets
  // automatically when navigating to another profile.
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage

  const [profileState, setProfileState] = useState(null) // { username, profile }
  const [tweetsState, setTweetsState] = useState(null) // { username, page, data }
  const [profileError, setProfileError] = useState(null) // { username, message }
  const [tweetsError, setTweetsError] = useState(null) // { username, page, message }
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const profile = await getProfile(username)
        if (!ignore) {
          setProfileState({ username, profile })
          setProfileError(null)
        }
      } catch (err) {
        if (!ignore) {
          setProfileError({ username, message: err.message || 'No se pudo cargar el perfil' })
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [username, attempt])

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await getUserTweets(username, page)
        if (!ignore) {
          setTweetsState({ username, page, data })
          setTweetsError(null)
        }
      } catch (err) {
        if (!ignore) {
          setTweetsError({ username, page, message: err.message || 'No se pudo cargar el contenido' })
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [username, page, attempt])

  // Loading while the requested profile/page has neither data nor a failed attempt.
  const profileDone =
    profileState?.username === username || profileError?.username === username
  const tweetsDone =
    (tweetsState?.username === username && tweetsState.page === page) ||
    (tweetsError?.username === username && tweetsError.page === page)
  const showProfileError = profileDone && profileError?.username === username

  function handleRetry() {
    setProfileError(null)
    setTweetsError(null)
    setAttempt((current) => current + 1)
  }

  if (!profileDone) {
    return <Loading />
  }
  if (showProfileError) {
    return <ErrorState message={profileError.message} onRetry={handleRetry} />
  }

  return (
    <>
      <ProfileHeader
        key={profileState.profile.username}
        profile={profileState.profile}
        onProfileChange={(updated) => setProfileState({ username, profile: updated })}
      />

      {!tweetsDone && <Loading label="Cargando tweets..." />}
      {tweetsDone && tweetsError?.username === username && tweetsError.page === page && (
        <ErrorState message={tweetsError.message} onRetry={handleRetry} />
      )}
      {tweetsDone && !(
        tweetsError?.username === username && tweetsError.page === page
      ) && tweetsState && (
        <>
          {tweetsState.data.items.length === 0 ? (
            <EmptyState
              icon="bi-chat-square"
              message="Aún no hay tweets"
              hint={`Cuando @${profileState.profile.username} publique algo, aparecerá aquí.`}
            />
          ) : (
            <div>
              {tweetsState.data.items.map((tweet) => (
                <TweetItem key={tweet.id} tweet={tweet} />
              ))}
            </div>
          )}
          <Pagination
            page={tweetsState.data.page}
            totalPages={tweetsState.data.totalPages}
            onPageChange={(nextPage) =>
              setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) })
            }
          />
        </>
      )}
    </>
  )
}
