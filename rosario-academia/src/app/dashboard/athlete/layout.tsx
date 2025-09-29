import { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard/dashboard-sidebar'
import { redirect } from 'next/navigation'
import { linksApproved, linksPending } from '@/utils/links/athlete-links'
import {
  getEnrollmentInfo,
  getProfileData
} from '../actions/reutilizableActions'
import { AthleteStoreProvider } from './provider'

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

  // Extract the user ID from the correct location in the data structure
  const userId = athleteData.user?.id || athleteData.user?.user_metadata?.sub

  if (!userId) {
    console.error('No user ID found in athlete data')
    return redirect('/sign-in')
  }

  const data = await getEnrollmentInfo(userId)

  const isApproved = data[0]?.status === 'approved'
  const { user } = athleteData
  const linksByStatus = isApproved ? linksApproved : linksPending

  if (!user) {
    return redirect('/sign-in')
  }

  return (
    <AthleteStoreProvider user={user}>
      <div className='flex min-h-screen w-full max-md:flex max-md:flex-col'>
        <DashboardSidebar links={linksByStatus} user={user} />
        <main className='mx-auto max-w-7xl flex-1 overflow-y-auto p-4'>
          {children}
        </main>
      </div>
    </AthleteStoreProvider>
  )
}
