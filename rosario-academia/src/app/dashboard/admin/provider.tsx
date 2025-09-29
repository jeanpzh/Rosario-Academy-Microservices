'use client'

import { ReactNode, createContext, useContext } from 'react'

interface AdminContextType {
  user: any | null
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export function AdminStoreProvider({
  user,
  children
}: {
  user: any
  children: ReactNode
}) {
  return (
    <AdminContext.Provider value={{ user }}>
      {children}
    </AdminContext.Provider>
  )
}
