import { type ReactNode } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard/dashboard-sidebar'
import { redirect } from 'next/navigation'
import links from '@/utils/links/auxiliar-links'
import ModalRoot from '../components/RootModal'
import { UserProvider } from '@/contexts/user-context'
import { getProfileData } from '../actions/reutilizableActions'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const assistantData = await getProfileData()
  
  if (!assistantData) {
    return redirect('/sign-in')
  }

  const userId = assistantData.userId
  
  if (!userId) {
    console.error('No user ID found in assistant data')
    return redirect('/sign-in')
  }

  return (
    <UserProvider
      value={{ userId: userId, email: assistantData.email }}
    >
      <div className='flex min-h-screen w-full bg-background  max-md:flex max-md:flex-col'>
        <DashboardSidebar links={links} userId={userId} />
        <main className='mx-auto max-w-7xl flex-1 overflow-y-auto p-4'>
          {children}
          <ModalRoot />
        </main>
      </div>
    </UserProvider>
  )
}
