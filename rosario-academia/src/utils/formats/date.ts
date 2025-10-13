export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const getNextFormattedDate = (dateString: string): string => {
  /* start_date: '2025-02-18' */
  if (!dateString) {
    throw new Error('Fecha no definida')
  }
  const date = new Date(dateString)
  date.setMonth(date.getMonth() + 1)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function getDaysRemaining(lastChange: string | null, period = 30) {
  if (!lastChange) return 0
  const lastChangeDate = new Date(lastChange as string)
  const today = new Date()
  const daysSince = Math.floor(
    (today.getTime() - lastChangeDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  const daysRemaining = period - daysSince
  return daysRemaining > 0 ? daysRemaining : 0
}

export const getDaysUntilNextPayment = (endDate?: string) => {
  if (!endDate) return 0
  const nextPaymentDate = new Date(endDate)
  const today = new Date()
  const diffTime = nextPaymentDate.getTime() - today.getTime()

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
