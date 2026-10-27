const formatter = new Intl.DateTimeFormat('es', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Formats an ISO date as "25 oct 2026, 19:58" for the UI. */
export function formatDateTime(isoDate) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return formatter.format(date)
}
