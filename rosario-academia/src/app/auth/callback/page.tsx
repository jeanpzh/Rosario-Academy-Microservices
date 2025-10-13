'use client'

import { useAuthCallback } from '@/hooks/auth/use-auth-callback'

export default function AuthCallbackPage() {
  const { isLoading, error } = useAuthCallback()

  if (error) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center'>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center'>
          <h2 className='mb-2 text-xl font-semibold text-red-800'>
            Error de Autenticación
          </h2>
          <p className='text-red-600'>{error}</p>
          <p className='mt-4 text-sm text-gray-600'>Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
        <h2 className='text-xl font-semibold'>Procesando autenticación...</h2>
        <p className='mt-2 text-gray-600'>Por favor espera un momento</p>
      </div>
    </div>
  )
}
