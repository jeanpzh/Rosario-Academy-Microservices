'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProfileSectionCard from '@/app/dashboard/athlete/components/ProfileSectionCard'
import { LevelToSpanish } from '@/app/dashboard/athlete/profile/types'
import { Scale, Ruler, Camera, Calendar, IndentIcon } from 'lucide-react'
import CardSkeleton from '@/app/dashboard/components/CardSkeleton'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { getDaysRemaining } from '@/utils/formats'
import { Profile } from '@/lib/types/Profile'
import { useFetchLastAvatarChangeQuery } from '@/hooks/use-fetch-last-avatar-change'

export interface ProfileCardProps {
  userProfile: Profile
  athlete: AthleteState
  isEditing: boolean
}

export function PersonalCard({
  userProfile,
  athlete,
  isEditing
}: ProfileCardProps) {
  console.log('User Profile:', userProfile.avatar_url)
  const { push } = useRouter()
  const { setLastAvatarChange } = useAthleteStore()

  const onFormattedDate = (date: string) => {
    const formattedDate = new Date(date)
    return formattedDate.toLocaleDateString('es-ES')
  }
  const {
    data: lastAvatarChangeData,
    isLoading: lastAvatarChangeLoading,
    error: lastAvatarChangeError
  } = useFetchLastAvatarChangeQuery({
    setLastAvatarChange,
    id: userProfile.id as string
  })
  const onAvatarClick = () => {
    const daysRemaining = getDaysRemaining(lastAvatarChangeData as string)
    if (daysRemaining > 0) {
      toast.info('Info', {
        description:
          'Solo puedes cambiar tu foto de perfil una vez al mes. Faltan ' +
          daysRemaining +
          ' día' +
          (daysRemaining > 1 ? 's' : '') +
          ' para tu próximo cambio.',
        duration: 5000
      })
      return
    }
    push('/dashboard/athlete/profile/avatar')
  }

  if (lastAvatarChangeLoading) return <CardSkeleton />
  if (lastAvatarChangeError) return null

  return (
    <motion.div
      className='max-md:col-span-2'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='col-span-1 w-full'>
        <CardHeader className='pb-0'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='relative'>
              <Avatar className='size-32 border-4 border-primary/10'>
                <AvatarImage
                  src={userProfile?.avatar_url as string}
                  alt={userProfile?.first_name}
                />
                <AvatarFallback>
                  {userProfile?.first_name?.[0]}
                  {userProfile?.paternal_last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size='icon'
                  className='absolute bottom-0 right-0 rounded-full'
                  variant='secondary'
                  onClick={onAvatarClick}
                >
                  <Camera className='size-4' />
                </Button>
              )}
            </div>
            <div className='space-y-1 text-center'>
              <h2 className='text-xl font-semibold'>
                {userProfile?.first_name} {userProfile?.paternal_last_name}
              </h2>
              <p className='text-sm text-muted-foreground'>
                {userProfile?.maternal_last_name}
              </p>
            </div>
            <div className='flex gap-2'>
              {athlete?.level && (
                <Badge variant='secondary'>
                  {
                    LevelToSpanish[
                      athlete?.level as keyof typeof LevelToSpanish
                    ]
                  }
                </Badge>
              )}
              <Badge variant='default'>
                <Link href='/dashboard/athlete/schedule'>Ver Horario</Link>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <ProfileSectionCard
              icon={Scale}
              label='Peso'
              value={
                athlete?.weight ? `${athlete?.weight} kg` : 'En proceso...'
              }
            />
            <ProfileSectionCard
              icon={Ruler}
              label='Altura'
              value={
                athlete?.height ? `${athlete?.height} cm` : 'En proceso...'
              }
            />
            <ProfileSectionCard
              icon={IndentIcon}
              label='DNI'
              value={userProfile?.dni ? userProfile?.dni : 'En proceso...'}
            />
            <ProfileSectionCard
              icon={Calendar}
              label='Fecha de Nacimiento'
              value={
                userProfile?.birth_date
                  ? onFormattedDate(userProfile?.birth_date)
                  : 'En proceso...'
              }
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
