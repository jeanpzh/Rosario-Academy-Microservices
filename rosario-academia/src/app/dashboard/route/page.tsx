'use server'
import { API_BASE_URL } from '@/lib/config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ROLE_REDIRECTS: Record<string, string> = {
  admin: '/dashboard/admin',
  deportista: '/dashboard/athlete',
  auxiliar_administrativo: '/dashboard/auxiliar'
}

export default async function DashboardRoute() {
  const token = (await cookies()).get('auth_session')?.value
  if (!token) {
    redirect('/sign-in')
  }

  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  })
  if (!res.ok) {
    redirect('/sign-in')
  }
  const me = await res.json()
  console.log('User info:', me)

  const redirectPath = ROLE_REDIRECTS[me.role]
  if (redirectPath) {
    redirect(redirectPath)
  }
  return (
    <div className='h-screen w-full mx-auto justify-center items-center'>
      Cargando...
    </div>
  )
}
