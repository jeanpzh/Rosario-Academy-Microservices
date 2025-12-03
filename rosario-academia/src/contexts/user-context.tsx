'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { USER_URL } from '@/lib/config'

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

interface UserContextValue {
  userId: string
  email?: string
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

interface UserProviderProps {
  children: ReactNode
  value: UserContextValue
}

/**
 * Provider que maneja el estado global del usuario autenticado
 * Usa React Query para cachear y compartir los datos entre componentes
 */
export function UserProvider({ children, value }: UserProviderProps) {
  return <UserContext value={{ ...value }}>{children}</UserContext>
}

/**
 * Hook para acceder al contexto del usuario
 *
 * @example
 * ```tsx
 * const { user, isLoading, error, refetch } = useUser()
 *
 * if (isLoading) return <Skeleton />
 * if (error) return <Error message={error.message} />
 *
 * return <div>Hola {user._firstName}</div>
 * ```
 */
export function useUser() {
  const context = useContext(UserContext)

  // Durante SSR/pre-rendering, retornar valores por defecto
  // en lugar de lanzar error
  if (context === undefined) {
    return { userId: '', email: undefined } as UserContextValue
  }

  return context
}
