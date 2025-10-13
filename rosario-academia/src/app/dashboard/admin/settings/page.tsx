'use client'
import React from 'react'
import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { useUser } from '@/contexts/user-context'

export default function page() {
  const { userId } = useUser()
  return <ChangePasswordForm userId={userId} />
}
