/** Friendly message for empty lists or feeds. */
export function EmptyState({ icon = 'bi-inbox', message, hint }) {
  return (
    <div className="state-box text-center py-5">
      <i className={`bi ${icon} text-secondary fs-2`} aria-hidden="true" />
      <p className="mt-3 mb-1">{message}</p>
      {hint && <p className="text-secondary small mb-0">{hint}</p>}
    </div>
  )
}
