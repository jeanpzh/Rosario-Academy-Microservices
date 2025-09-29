'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAthleteStore } from '@/lib/stores/useUserStore'
import LoadingPage from '@/components/LoadingPage'

export default function LoadingDataPage() {
  const router = useRouter()
  const fetchAthleteData = useAthleteStore((state) => state.fetchAthleteData)
  const athleteBase = useAthleteStore((state) => state.athleteBase)

  useEffect(() => {
    ;(async () => {
      if (athleteBase) {
        await fetchAthleteData(athleteBase)
      }
    })()
    router.replace('/dashboard')
  }, [fetchAthleteData, athleteBase, router])

  return <LoadingPage />
}
