'use client'

import { ChangePasswordForm } from '@/components/ChangePasswordForm'
import { useUser } from '@/contexts/user-context'

export default function ConfiguracionPage() {
  const { userId } = useUser()
  return <ChangePasswordForm userId={userId} />
}
