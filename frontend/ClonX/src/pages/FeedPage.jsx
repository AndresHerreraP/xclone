import { useEffect, useState } from 'react'
import { ComposeTweet } from '../components/ComposeTweet'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { Loading } from '../components/Loading'
import { Pagination } from '../components/Pagination'
import { TweetItem } from '../components/TweetItem'
import { getFeed } from '../services/tweetService'

/** Home: compose a tweet and the paginated feed (own + followed users, newest first). */
export function FeedPage() {
  const [page, setPage] = useState(1)
  const [feed, setFeed] = useState(null) // last successfully loaded page
  const [errorState, setErrorState] = useState(null) // { page, message }
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const response = await getFeed(page)
        if (!ignore) {
          setFeed(response)
          setErrorState(null)
        }
      } catch (err) {
        if (!ignore) {
          setErrorState({ page, message: err.message || 'No se pudo cargar el contenido' })
        }
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [page, attempt])

  // Loading while the current page has neither loaded data nor a failed attempt.
  const loadedPage = feed?.page ?? null
  const failedPage = errorState?.page ?? null
  const loading = loadedPage !== page && failedPage !== page
  const showError = !loading && failedPage === page

  function handlePageChange(nextPage) {
    setPage(nextPage)
  }

  function handlePublished() {
    // Back to page 1 and force a refetch so the new tweet appears on top.
    setPage(1)
    setErrorState(null)
    setAttempt((current) => current + 1)
  }

  function handleRetry() {
    setErrorState(null)
    setAttempt((current) => current + 1)
  }

  return (
    <>
      <ComposeTweet onPublished={handlePublished} />

      {loading && <Loading />}
      {showError && <ErrorState message={errorState.message} onRetry={handleRetry} />}
      {!loading && !showError && feed && (
        <>
          {feed.items.length === 0 ? (
            <EmptyState
              icon="bi-people"
              message="Tu feed está vacío"
              hint="Sigue a otros usuarios o publica tu primer tweet."
            />
          ) : (
            <div>
              {feed.items.map((tweet) => (
                <TweetItem key={tweet.id} tweet={tweet} />
              ))}
            </div>
          )}
          <Pagination page={feed.page} totalPages={feed.totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </>
  )
}
