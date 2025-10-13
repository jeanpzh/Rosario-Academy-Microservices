'use client'

import React, { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { IconArrowLeft } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { DEFAULT_IMAGE } from '@/utils/utils'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/config'
import { useUser } from '@/hooks/use-user'
import { Skeleton } from '@/components/ui/skeleton'
import { useFetchFullProfile } from './hooks/use-fetch-full-profile'

interface Links {
  label: string
  href?: string
  icon: React.JSX.Element | React.ReactNode
}

export function DashboardSidebar({
  links,
  userId
}: {
  links: Links[]
  userId: string
}) {
  const { data: user, isLoading, error } = useFetchFullProfile({ userId })
  const { push } = useRouter()
  const [open, setOpen] = useState(false)

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`${API_BASE_URL}/auth/signout`, {
      credentials: 'include',
      method: 'POST'
    })
    if (res.ok) {
      push('/logout-cleanup')
    } else {
      console.error('Error signing out:', res.statusText)
      throw new Error('Error signing out')
    }
  }

  if (error) {
    return <div>Error loading user data</div>
  }
  return (
    <div
      className={cn(
        'sticky left-0 top-0 flex h-screen w-64 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-none dark:bg-[#121212] max-md:w-full max-md:h-auto max-md:z-20 '
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className='justify-between gap-10 '>
          <div className='flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
            <header className='flex items-center gap-4'>
              <Logo />
              <ThemeSwitcher />
            </header>
            <div className='mt-8 flex flex-col gap-2'>
              {links.map((link, index) => (
                <SidebarLink
                  key={index}
                  link={link}
                  onClick={() => setOpen(false)}
                />
              ))}

              <form onSubmit={handleSignOut}>
                <Button
                  type='submit'
                  variant={'ghost'}
                  className='flex items-center gap-2'
                  onClick={() => setOpen(false)}
                >
                  <IconArrowLeft className='size-5 shrink-0 text-neutral-700 dark:text-neutral-200' />{' '}
                  Cerrar Sesión
                </Button>
              </form>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className='flex items-center gap-2 p-2'>
                <Skeleton className='size-8 rounded-full' />
                <Skeleton className='h-4 w-32' />
              </div>
            ) : (
              user && (
                <SidebarLink
                  link={{
                    label: `${user.firstName || ''} ${user.paternalLastName || ''}  `,
                    href: '#',
                    icon: (
                      <Image
                        src={DEFAULT_IMAGE}
                        className='size-8 shrink-0 rounded-full object-cover'
                        width={50}
                        height={50}
                        alt='Avatar'
                      />
                    )
                  }}
                />
              )
            )}
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  )
}
