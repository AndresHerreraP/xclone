export function Loading({ label = 'Cargando...' }) {
  return (
    <div className="state-box text-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-primary" />
      <p className="text-secondary mt-3 mb-0">{label}</p>
    </div>
  )
}
