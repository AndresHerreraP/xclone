import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { UserList } from '../components/UserList'
import * as userService from '../services/userService'

/**
 * Followers or following list of any user (type comes from the route),
 * alphabetical by full name, 10 per page, with links to each profile
 * and a follow button when it applies.
 */
export function FollowListPage({ type }) {
  const { username } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // The page lives in the URL (?page=n) so it survives reloads and resets
  // automatically when navigating to another user or list type.
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage

  const [listState, setListState] = useState(null) // { username, type, page, data }
  const [errorState, setErrorState] = useState(null) // { username, type, page, message }
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const request = type === 'followers' ? userService.getFollowers : userService.getFollowing
        const data = await request(username, page)
        if (!ignore) {
          setListState({ username, type, page, data })
          setErrorState(null)
        }
      } catch (err) {
        if (!ignore) {
          setErrorState({ username, type, page, message: err.message || 'No se pudo cargar el contenido' })
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [username, type, page, attempt])

  // Loading while the requested list has neither data nor a failed attempt.
  const done =
    (listState?.username === username && listState.type === type && listState.page === page) ||
    (errorState?.username === username && errorState.type === type && errorState.page === page)
  const showError = done && errorState?.username === username && errorState.type === type && errorState.page === page

  const title = type === 'followers' ? `Seguidores de @${username}` : `A quién sigue @${username}`
  const emptyMessage =
    type === 'followers'
      ? `@${username} todavía no tiene seguidores`
      : `@${username} todavía no sigue a nadie`
  const emptyHint =
    type === 'followers' ? 'Cuando alguien lo siga, aparecerá aquí.' : 'Las personas que siga aparecerán aquí.'

  function handleRetry() {
    setErrorState(null)
    setAttempt((current) => current + 1)
  }

  function handleFollowedChange(followedUsername) {
    setListState((current) => ({
      ...current,
      data: {
        ...current.data,
        items: current.data.items.map((item) =>
          item.username === followedUsername ? { ...item, isFollowing: true } : item,
        ),
      },
    }))
  }

  return (
    <>
      <div className="p-3 border-bottom">
        <Link to={`/users/${username}`} className="text-decoration-none text-body small" aria-label="Volver al perfil">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Volver al perfil
        </Link>
        <h1 className="h5 fw-bold mt-1 mb-0">{title}</h1>
      </div>

      {!done && <Loading />}
      {showError && <ErrorState message={errorState.message} onRetry={handleRetry} />}
      {done && !showError && listState && (
        <>
          {listState.data.items.length === 0 ? (
            <EmptyState icon="bi-people" message={emptyMessage} hint={emptyHint} />
          ) : (
            <UserList users={listState.data.items} onFollowedChange={handleFollowedChange} />
          )}
          <Pagination
            page={listState.data.page}
            totalPages={listState.data.totalPages}
            onPageChange={(nextPage) =>
              setSearchParams(nextPage === 1 ? {} : { page: String(nextPage) })
            }
          />
        </>
      )}
    </>
  )
}
