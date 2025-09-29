'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { updateProfile as updateProfileApi } from '@/utils/auth/api'

interface UserProfile {
  id: string
  first_name: string
  paternal_last_name: string
  maternal_last_name: string
  phone: string
  level?: string
  shift?: string
  avatar_url?: string
  birth_date?: string
  dni?: string
  weight?: number
  height?: number
}

export function useUpdateProfileData(id: string) {
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const res = await updateProfileApi(
        {
          firstName: data.first_name!,
          paternalLastName: data.paternal_last_name!,
          maternalLastName: data.maternal_last_name!,
          phone: data.phone!
        },
        id
      )

      if (res.status !== 200) {
        throw new Error(res.message || 'Error updating profile')
      }

      return res
    } catch (err: any) {
      throw err
    }
  }

  return {
    updateProfile
  }
}
