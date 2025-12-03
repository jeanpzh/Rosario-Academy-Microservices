import React from 'react'
import RadioFields from '@/app/(auth-pages)/sign-up/components/RadioFields'
import { useFormContext } from 'react-hook-form'
import { SignupSchema } from '@/app/(auth-pages)/schemas/sign-up-schema'

export default function SignUpStepTwo() {
  const { control } = useFormContext<SignupSchema>()
  return (
    <div className='space-y-6'>
      <RadioFields control={control} name='level' labelText='Niveles' />
    </div>
  )
}
