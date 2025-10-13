import React from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import { LevelToSpanish } from '@/app/dashboard/athlete/profile/types'

interface AthleteDetailsProps {
  athleteData: Profile & Athlete 
  availableDate: string | null
  DEFAULT_IMAGE: string
  formatDate: (date: string) => string
}

const AthleteDetails: React.FC<AthleteDetailsProps> = ({
  athleteData,
  availableDate,
  DEFAULT_IMAGE,
  formatDate
}) => {
  return (
    <div className='grow'>
      <div className='header bg-blue-600 p-2 text-white dark:bg-[#332e9b]'>
        <h2 className='text-lg font-bold'>Academia Rosario</h2>
      </div>
      <div className='content flex p-4'>
        <div className='shrink-0'>
          <Avatar className='avatar size-24 border-2 border-blue-600 dark:border-blue-400'>
            <Image
              src={athleteData?.avatarUrl || DEFAULT_IMAGE}
              alt='Logo Academia de Voleibol'
              className='rounded-full object-cover'
              width={96}
              height={96}
            />
          </Avatar>
        </div>
        <div className='info ml-4 grow space-y-1 text-sm text-gray-700 dark:text-gray-200'>
          <p className='text-base font-semibold'>
            {`${athleteData?.firstName || ''} ${athleteData?.paternalLastName || ''} ${athleteData?.maternalLastName || ''}`}
          </p>
          <p>
            <strong>ID:</strong> {athleteData?.id}
          </p>
          <p>
            <strong>DNI:</strong> {athleteData?.dni}
          </p>
          <p>
            <strong>Nacimiento:</strong>{' '}
            {athleteData?.birthDate ? formatDate(athleteData.birthDate) : 'N/A'}
          </p>
          <p>
            <strong>Nivel:</strong>{' '}
            {athleteData?.level
              ? LevelToSpanish[athleteData.level as keyof typeof LevelToSpanish]
              : 'N/A'}
          </p>
          {athleteData?.height && (
            <p>
              <strong>Altura:</strong> {athleteData.height} cm
            </p>
          )}
          {athleteData?.weight && (
            <p>
              <strong>Peso:</strong> {athleteData.weight} kg
            </p>
          )}
        </div>
      </div>

      <div className='mt-2 bg-blue-100 p-2 text-center text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
        <p className='font-semibold'>
          Disponible hasta : {availableDate ? availableDate : 'No disponible'}
        </p>
      </div>
    </div>
  )
}

export default AthleteDetails
