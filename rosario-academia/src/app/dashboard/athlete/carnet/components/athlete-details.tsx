import React from 'react'
import Image from 'next/image'
import { Avatar } from '@/components/ui/avatar'
import { LevelToSpanish } from '@/app/dashboard/athlete/profile/types'

interface AthleteDetailsProps {
  athleteData: AthleteState
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
              src={athleteData?.profile?.avatar_url || DEFAULT_IMAGE}
              alt='Logo Academia de Voleibol'
              className='rounded-full object-cover'
              width={96}
              height={96}
            />
          </Avatar>
        </div>
        <div className='info ml-4 grow space-y-1 text-sm text-gray-700 dark:text-gray-200'>
          <p className='text-base font-semibold'>
            {`${athleteData?.profile?.first_name || ''} ${athleteData?.profile?.paternal_last_name || ''} ${athleteData?.profile?.maternal_last_name || ''}`}
          </p>
          <p>
            <strong>ID:</strong> {athleteData?.athlete_id}
          </p>
          <p>
            <strong>DNI:</strong> {athleteData?.profile?.dni}
          </p>
          <p>
            <strong>Nacimiento:</strong>{' '}
            {athleteData?.profile?.birth_date
              ? formatDate(athleteData.profile.birth_date)
              : 'N/A'}
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
      <div className='mt-2 space-y-1 border-t border-gray-200 p-2 text-xs dark:border-gray-700'>
        <p className='font-semibold'>Horarios:</p>
        {athleteData?.enrollment_requests.map((request: any, index: number) => (
          <p key={index}>
            {request.requested_schedule.weekday}:{' '}
            {request.requested_schedule.start_time}-
            {request.requested_schedule.end_time}
          </p>
        ))}
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
