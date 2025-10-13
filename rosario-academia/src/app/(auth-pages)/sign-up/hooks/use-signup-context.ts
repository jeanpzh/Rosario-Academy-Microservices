'use client'
import { use } from 'react'
import { MultiStepFormContext } from '../components/MultiStepForm'

export default function useSignupContext() {
  const context = use(MultiStepFormContext)
  if (!context) {
    throw new Error(
      'useSignupContext must be used within a MultiStepFormProvider'
    )
  }
  return context
}
