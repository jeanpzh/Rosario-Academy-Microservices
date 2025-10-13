'use client'

import { USER_URL } from '@/lib/config'
import { useQuery } from '@tanstack/react-query'

export interface UserProfile {
  _id: string
  _email: string
  _dni: string
  _firstName: string
  _paternalLastName: string
  _maternalLastName: string
  _phone?: string
  _role: string
  birthDate: string
  avatarUrl?: string
  lastAvatarChange?: Date | null
  metadata?: Record<string, any>
  address?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Hook para obtener el perfil completo del usuario
 *
 * React Query cachea automáticamente la respuesta, por lo que múltiples
 * componentes pueden usar este hook sin hacer requests duplicados.
 *
 * @param userId - ID del usuario
 * @returns Datos del usuario, estado de carga y error
 *
 * @example
 * ```tsx
 * // En Sidebar
 * const { data: user, isLoading } = useUser(userId)
 *
 * // En Page (usa el mismo caché automáticamente)
 * const { data: user } = useUser(userId)
 * ```
 */
export function useUser(userId: string | undefined) {
  return useQuery<UserProfile, Error>({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const response = await fetch(`${USER_URL}/${userId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error fetching user profile')
      }

      return response.json()
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false
  })
}
