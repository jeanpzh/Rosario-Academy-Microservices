'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { LevelToSpanish } from '@/app/dashboard/athlete/profile/types'
import { DEFAULT_IMAGE } from '@/utils/utils'
import { useAthleteStore } from '@/lib/stores/useUserStore'

export function ProfileCard({ className }: { className?: string }) {
  const athlete = useAthleteStore((state) => state.athleteDetails)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent className='flex items-center space-x-4'>
        <Avatar className='size-24'>
          <AvatarImage
            src={athlete?.profile?.avatar_url || DEFAULT_IMAGE}
            alt='Foto de perfil'
          />
          <AvatarFallback>
            {athlete?.profile?.first_name?.[0] || ''}
            {athlete?.profile?.paternal_last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>
            {athlete?.profile?.first_name}{' '}
            {athlete?.profile?.paternal_last_name}{' '}
            {athlete?.profile?.maternal_last_name}
          </h3>
          <p className='text-sm text-muted-foreground'>
            Nivel: {athlete?.level && LevelToSpanish[athlete?.level]}
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
