'use client'
import Header from '@/app/dashboard/components/Header'
import CustomTable from '@/app/dashboard/components/CustomTable'
import { athleteColumns } from '@/lib/columns/athlete-columns'
import { levelColors, statusColors } from '@/utils/table'
import { Athlete } from '@/lib/types/AthleteTable'
import { useDeleteAthleteQuery } from '@/hooks/use-delete-athlete'
import { useUpdateAthleteStatus } from '@/hooks/use-update-athlete-status'
import { useUpdateAthleteLevel } from '@/hooks/use-update-athlete-level'
import AddAthlete from '../admin/athlete-control/components/add-athlete'
import { useModalStore } from '@/lib/stores/useModalStore'
import { useAthleteModalStore } from '@/lib/stores/useAthleteStore'
import { useFechAthletes } from '@/hooks/use-fetch-athletes'
import { useFetchEnrollmentRequests } from '../athlete/payments/hooks/use-fetch-enrollment-requests'

export default function AthleteControl() {
  const setCurrentItem = useAthleteModalStore((state) => state.setCurrentItem)
  const { setOpenModal } = useModalStore()
  const { data: athletes = [], isLoading } = useFechAthletes()
  const deleteMutation = useDeleteAthleteQuery()
  const updateAthleteStatusMutation = useUpdateAthleteStatus()
  const updateAthleteLevelMutation = useUpdateAthleteLevel()

  const handleEdit = (athlete: Athlete) => {
    athlete.birth_date = new Date(athlete.birth_date)
      .toISOString()
      .split('T')[0]
    setCurrentItem(athlete)
    setOpenModal('EDIT_ATHLETE')
  }

  // Handle delete action
  const handleDelete = (athlete: Athlete) => {
    deleteMutation.mutate(athlete.id)
  }

  return (
    <div className='dark:bg-dark-surface flex flex-col gap-4 bg-background p-4'>
      <Header title='Control de Deportistas' />
      <AddAthlete />
      <CustomTable
        columns={athleteColumns(
          handleEdit,
          handleDelete,
          updateAthleteLevelMutation,
          updateAthleteStatusMutation,
          levelColors,
          statusColors
        )}
        data={athletes}
        isLoading={isLoading}
      />
    </div>
  )
}
