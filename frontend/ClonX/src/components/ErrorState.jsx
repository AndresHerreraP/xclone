/** Error box with an optional retry button. */
export function ErrorState({ message = 'No se pudo cargar el contenido', onRetry }) {
  return (
    <div className="state-box text-center py-5" role="alert">
      <i className="bi bi-exclamation-triangle text-warning fs-3" aria-hidden="true" />
      <p className="mt-3 mb-2">{message}</p>
      <p className="text-secondary small mb-0">Comprueba tu conexión e inténtalo de nuevo.</p>
      {onRetry && (
        <button type="button" className="btn btn-x btn-sm mt-3" onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  )
}
