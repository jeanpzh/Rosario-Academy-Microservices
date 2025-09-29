import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

interface AthleteSchedule {
  day: string
  time: string
  activity: string
}

interface UseAthleteScheduleReturn {
  schedule: AthleteSchedule[]
  loading: boolean
  error: string | null
  isNotApproved: boolean
}

const ATHLETE_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3000'

export const useAthleteSchedule = (): UseAthleteScheduleReturn => {
  const [schedule, setSchedule] = useState<AthleteSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isNotApproved, setIsNotApproved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true)
        setError(null)
        setIsNotApproved(false)

        // Obtener token JWT de Supabase
        const {
          data: { session }
        } = await supabase.auth.getSession()
        const token = session?.access_token

        if (!token) {
          setError('No hay token de autenticación')
          setLoading(false)
          return
        }

        const response = await fetch(
          `${ATHLETE_SERVICE_URL}/athlete/schedule`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.status === 403) {
          setIsNotApproved(true)
          setError(
            'Tu solicitud de inscripción aún no ha sido aprobada. Contacta al administrador.'
          )
          setLoading(false)
          return
        }

        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
          setLoading(false)
          return
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setSchedule(data.schedule || [])
      } catch (err) {
        console.error('Error fetching athlete schedule:', err)
        setError(
          err instanceof Error
            ? err.message
            : 'Error desconocido al cargar el horario'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  return {
    schedule,
    loading,
    error,
    isNotApproved
  }
}
