'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { TEditForm } from '@/app/dashboard/athlete/schemas/edit-form-schema'
import { EditProfileForm } from '@/app/dashboard/athlete/profile/components/EditProfileForm'
import { PersonalCard } from '@/app/dashboard/athlete/profile/components/PersonalCard'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import { toast } from 'sonner'

import { useUser } from '@/contexts/user-context'
import { useFetchFullProfile } from '@/components/layout/dashboard/hooks/use-fetch-full-profile'
import { useFetchAthleteData } from '@/hooks/use-fetch-athlete-data'
import { useUpdateProfile } from './hooks/use-update-profile'
import LoadingPage from '@/components/LoadingPage'

export default function ProfilePage() {
  const { userId } = useUser()
  const { data: userProfile, isLoading } = useFetchFullProfile({ userId })
  const { data: athleteData } = useFetchAthleteData({ userId })
  const { mutateAsync: updateProfile } = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (isLoading) return <LoadingPage />
  if (!userProfile) return <div>No se encontró el perfil del usuario.</div>

  const handleEditSubmit = async (data: TEditForm) => {
    try {
      setIsSaving(true)
      toast.promise(updateProfile({ data: data, id: userId }), {
        loading: 'Guardando cambios...',
        success: () => 'Perfil actualizado con éxito',
        error: (err) => err.message || 'Error al actualizar el perfil'
      })
      setIsEditing(false)
    } catch (e: any) {
      toast.error('Error', {
        description: e.message || 'Error al actualizar el perfil',
        duration: 5000
      })
    } finally {
      setIsSaving(false)
    }
  }

  const defaultFormValues: TEditForm = {
    firstName: userProfile?.firstName || '',
    paternalLastName: userProfile?.paternalLastName || '',
    maternalLastName: userProfile?.maternalLastName || '',
    phone: userProfile?.phone || ''
  }

  return (
    <div className='h-full min-h-screen bg-background p-8 transition-colors duration-300 dark:bg-[#181818]'>
      <TooltipProvider>
        <div className='mx-auto max-w-6xl space-y-8'>
          <div className='flex items-center justify-between'>
            <h1 className='text-4xl font-bold tracking-tight'>
              Perfil de Deportista
            </h1>
            <div className='flex items-center gap-4'>
              <Button
                variant='outline'
                onClick={() => setIsEditing(!isEditing)}
                disabled={isEditing}
              >
                {'Edit Profile'}
              </Button>
            </div>
          </div>

          <div className='grid h-full gap-8 md:grid-cols-3'>
            <PersonalCard
              userProfile={userProfile}
              athlete={athleteData}
              isEditing={isEditing}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='col-span-2'
            >
              <Card>
                <CardHeader>
                  <h3 className='text-2xl font-semibold'>
                    Información Personal
                  </h3>
                </CardHeader>
                <EditProfileForm
                  defaultValues={defaultFormValues}
                  onSubmit={handleEditSubmit}
                  isEditing={isEditing}
                  isSaving={isSaving}
                  onCancelEdit={() => setIsEditing(false)}
                  user={userProfile}
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </TooltipProvider>
    </div>
  )
}
