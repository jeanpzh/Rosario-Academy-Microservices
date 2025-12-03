import { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard/dashboard-sidebar'
import { redirect } from 'next/navigation'
import { linksApproved, linksPending } from '@/utils/links/athlete-links'
import {
  getEnrollmentInfo,
  getProfileData
} from '../actions/reutilizableActions'
import { UserProvider } from '@/contexts/user-context'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const athleteData = await getProfileData()
  if (!athleteData) {
    return redirect('/sign-in')
  }

  const userId = athleteData.userId

  if (!userId) {
    console.error('No user ID found in athlete data')
    return redirect('/sign-in')
  }

  const enrollmentInfo = await getEnrollmentInfo(userId)


  const isApproved = enrollmentInfo?.status === 'approved'
  const linksByStatus = isApproved ? linksApproved : linksPending

  return (
    <UserProvider value={{ userId: userId, email: athleteData.email }}>
      <div className='flex min-h-screen w-full max-md:flex max-md:flex-col'>
        <DashboardSidebar links={linksByStatus} userId={userId} />
        <main className='mx-auto max-w-7xl flex-1 overflow-y-auto p-4'>
          {children}
        </main>
      </div>
    </UserProvider>
  )
}
