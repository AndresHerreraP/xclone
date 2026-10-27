/**
 * Anterior / Siguiente pager driven by the backend pagination response.
 * Both buttons are disabled at the edges; shows "Página X de Y".
 */
export function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages < 1) {
    return null
  }

  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <nav className="py-3" aria-label="Paginación">
      <ul className="pagination pagination-sm justify-content-center align-items-center mb-0">
        <li className={`page-item ${isFirst ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(page - 1)}
            disabled={isFirst}
          >
            Anterior
          </button>
        </li>
        <li className="page-item disabled">
          <span className="page-link text-secondary border-0 bg-transparent">
            Página {page} de {totalPages}
          </span>
        </li>
        <li className={`page-item ${isLast ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(page + 1)}
            disabled={isLast}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  )
}
