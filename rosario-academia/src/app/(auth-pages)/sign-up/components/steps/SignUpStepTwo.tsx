import React from 'react'
import RadioFields from '@/app/(auth-pages)/sign-up/components/RadioFields'
import { HoverBorderGradient } from '@/components/hover-border-gradient'
import { useFormContext } from 'react-hook-form'
import { SignUpSchema } from '@/app/(auth-pages)/schemas/sign-up-schema'

export default function SignUpStepTwo() {
  const { control } = useFormContext<SignUpSchema>()
  return (
    <div className='space-y-6'>
      <RadioFields control={control} name='level' labelText='Niveles' />
    </div>
  )
}
