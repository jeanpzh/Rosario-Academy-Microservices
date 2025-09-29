'use client'

import { Plus } from 'lucide-react'
import { HoverBorderGradient } from '@/components/hover-border-gradient'
import { useModalStore } from '@/lib/stores/useModalStore'

export default function AddAthlete() {
  const { setOpenModal } = useModalStore()
  const handleAddAssistant = () => {
    try {
      setOpenModal('CREATE_ATHLETE')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message)
      }
    }
  }

  return (
    <div className='mb-4 flex items-center justify-between bg-background p-4 shadow-sm'>
      <HoverBorderGradient
        onClick={handleAddAssistant}
        className='flex items-center'
      >
        <Plus className='mr-2 size-4' />
        Nuevo Deportista
      </HoverBorderGradient>
    </div>
  )
}
