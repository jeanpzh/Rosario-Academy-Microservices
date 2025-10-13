import { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard/dashboard-sidebar'
import { redirect } from 'next/navigation'
import links from '@/utils/links/admin-links'
import ModalRoot from '../components/RootModal'
import { getProfileData } from '../actions/reutilizableActions'
import { UserProvider } from '@/contexts/user-context'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const profile = await getProfileData()
  if (!profile) return redirect('/sign-in')
  const userId = profile.userId

  return (
    <UserProvider value={{ userId: userId, email: profile.email }}>
      <div className='flex min-h-screen w-full max-md:flex max-md:flex-col'>
        <DashboardSidebar links={links} userId={userId} />
        <main className='mx-auto max-w-7xl flex-1 overflow-y-auto p-6'>
          {children}
          <ModalRoot />
        </main>
      </div>
    </UserProvider>
  )
}
