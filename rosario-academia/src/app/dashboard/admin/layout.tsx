import { ReactNode } from 'react'
import { DashboardSidebar } from '@/components/layout/dashboard/dashboard-sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import links from '@/utils/links/admin-links'
import ModalRoot from '../components/RootModal'
import { getProfile } from '@/utils/auth/api'
import { cookies } from 'next/headers'
import { AdminStoreProvider } from './provider'

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const cookie = await (await cookies()).get('auth_session')?.value
  // Token es payload ??
  const profile = await getProfile(cookie as string)
  console.log('Profile:', profile.user)

  if (!profile) return redirect('/sign-in')

  return (
    <AdminStoreProvider user={profile.user}>
      <div className='flex min-h-screen w-full max-md:flex max-md:flex-col'>
        <DashboardSidebar user={profile.user_metadata} links={links} />{' '}
        <main className='mx-auto max-w-7xl flex-1 overflow-y-auto p-6'>
          {children}
          <ModalRoot />
        </main>
      </div>
    </AdminStoreProvider>
  )
}
