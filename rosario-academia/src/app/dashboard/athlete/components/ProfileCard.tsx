'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { LevelToSpanish } from '@/app/dashboard/athlete/profile/types'
import { DEFAULT_IMAGE } from '@/utils/utils'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { useUser } from '@/contexts/user-context'
import { useFetchFullProfile } from '@/components/layout/dashboard/hooks/use-fetch-full-profile'
import { useFetchAthleteData } from '@/hooks/use-fetch-athlete-data'
import CardSkeleton from '../../components/CardSkeleton'

export function ProfileCard() {
  const { userId } = useUser()
  console.log('User ID:', userId)
  const { data: profile, isLoading: isLoadingProfile } = useFetchFullProfile({
    userId
  })
  const { data: athlete, isLoading: isLoadingAthlete } = useFetchAthleteData({
    userId
  })
  if (isLoadingProfile || isLoadingAthlete) {
    return <CardSkeleton className='md:col-span-2' />
  }
  return (
    <Card className='md:col-span-2'>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center space-x-4'>
        <Avatar className='size-24'>
          <AvatarImage
            src={profile?.avatarUrl || DEFAULT_IMAGE}
            alt='Foto de perfil'
          />
          <AvatarFallback>
            {profile?.firstName?.[0] || ''}
            {profile?.paternalLastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>
            {profile?.firstName} {profile?.paternalLastName}{' '}
            {profile?.maternalLastName}
          </h3>
          <p className='text-sm text-muted-foreground'>{profile?.email}</p>
          <p className='text-sm text-muted-foreground'>
            Nivel: {athlete?.level}
          </p>

          <Link href='/dashboard/athlete/profile'>
            <Button size='sm' variant={'default'}>
              Ver perfil
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
