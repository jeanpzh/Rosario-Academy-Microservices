import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface AthleteStore {
  athleteBase: any | null
  athleteDetails: AthleteState | null
  loading: boolean
  setAthleteBase: (athleteBase: any) => void
  fetchAthleteData: (user: any) => Promise<void>
  clearAthleteData: () => void
  setAthleteData: (data: any) => void
  setLastAvatarChange: (date: string) => void
  setDaysRemaining: (days: number) => void
  setImg: (url: string) => void
}

export const useAthleteStore = create<AthleteStore>()(
  persist(
    (set, get) => ({
      athleteBase: null,
      athleteDetails: null,
      loading: false,
      setAthleteBase: (athleteBase) => {
        set({ athleteBase })
      },
      setAthleteData: (data) => {
        set({ athleteDetails: data })
      },
      setImg: (img: string | null) => {
        set((state) => ({
          athleteDetails: state.athleteDetails
            ? {
                ...state.athleteDetails,
                profile: {
                  ...state.athleteDetails.profile,
                  avatar_url: img
                }
              }
            : null
        }))
      },
      setLastAvatarChange: (date: string) => {
        set((state) => ({
          athleteDetails: state.athleteDetails
            ? {
                ...state.athleteDetails,
                profile: {
                  ...state.athleteDetails.profile,
                  last_avatar_change: date
                }
              }
            : null
        }))
      },
      setDaysRemaining(days: number) {
        set((state) => ({
          athleteDetails: state.athleteDetails
            ? {
                ...state.athleteDetails,
                profile: {
                  ...state.athleteDetails.profile,
                  days_remaining: days
                }
              }
            : null
        }))
      },
      fetchAthleteData: async (user: any) => {
        set({ loading: true })
        const athleteBase = user
        if (!athleteBase) {
          console.error('No user data found in store')
          set({ loading: false })
          return
        }
        const athleteId = athleteBase.id
        const email = athleteBase.email ?? ''
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_USER_URL}/athlete/${athleteId}`,
          {
            credentials: 'include'
          }
        )
        if (!res.ok) {
          console.error('Error fetching athlete data:', res.statusText)
          set({ loading: false })
          return
        }
        const { data, error } = await res.json()

        if (error) {
          console.error('Error fetching athlete data:', error)
          set({ loading: false })
          return
        }

        set({
          athleteDetails: {
            id: athleteId,
            athlete_id: data.athlete_id,
            level: data.level,
            height: data.height,
            weight: data.weight,
            profile: data.profile,
            email: email,
            payments: [],
            enrollment_requests: []
          },
          loading: false
        })

        /*    const [paymentsResult, enrollmentResult] = await Promise.all([
          supabase.rpc('get_payments', { athlete_uuid: athleteId }),
          supabase.rpc('get_enrollment_requests', { athlete_uuid: athleteId })
        ])

        if (paymentsResult.error || enrollmentResult.error) {
          console.log(
            'Error fetching additional data:',
            paymentsResult.error || enrollmentResult.error
          )
          return set({ loading: false })
        }
        set((state) => ({
          athlete: {
            ...state.athlete!,
            payments: paymentsResult.data ?? [],
            enrollment_requests: enrollmentResult.data ?? []
          } as AthleteState,
          loading: false
        })) */
      },

      clearAthleteData: () => {
        set({ athleteDetails: null })
        localStorage.removeItem('athlete-store')
      }
    }),
    {
      name: 'athlete-store',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
