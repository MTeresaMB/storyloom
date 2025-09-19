export function formatDateTime(isoLike: string) {
  const d = new Date(isoLike)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(d)
}