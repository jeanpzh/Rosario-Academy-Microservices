'use client'

import { ReactNode, createContext, useContext } from 'react'

interface AthleteContextType {
  user: any | null
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined)

export function useAthlete() {
  const context = useContext(AthleteContext)
  if (context === undefined) {
    throw new Error('useAthlete must be used within an AthleteProvider')
  }
  return context
}

export function AthleteStoreProvider({
  user,
  children
}: {
  user: any
  children: ReactNode
}) {
  return (
    <AthleteContext.Provider value={{ user }}>
      {children}
    </AthleteContext.Provider>
  )
}
