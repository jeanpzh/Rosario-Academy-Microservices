'use client'
import { LucideIcon, UserPlus } from 'lucide-react'
import { ReactElement, useState } from 'react'
import { ZodSchema } from 'zod'
import {
  stepOne,
  stepTwo,
  type SignupSchema
} from '../../schemas/sign-up-schema'
import SignUpStepOne from './steps/SignUpStepOne'
import { HoverBorderGradient } from '@/components/hover-border-gradient'
import MultiStepForm from './MultiStepForm'
import SignUpStepTwo from './steps/SignUpStepTwo'

type FieldKeys = keyof SignupSchema

export interface FormStep {
  title: string
  description: string
  validationSchema: ZodSchema<unknown>
  component: ReactElement
  icon: LucideIcon
  fields: FieldKeys[]
}

const signupSteps: FormStep[] = [
  {
    title: 'Datos Personales',
    description: 'Completa tus datos personales',
    validationSchema: stepOne,
    component: <SignUpStepOne />,
    icon: UserPlus,
    fields: [
      'firstName',
      'paternalLastName',
      'maternalLastName',
      'dni',
      'email',
      'phone',
      'password',
      'confirmPassword',
      'birthdate'
    ]
  },

  {
    title: 'Nivel de Entrenamiento',
    description: 'Selecciona tu nivel de entrenamiento',
    validationSchema: stepTwo,
    component: <SignUpStepTwo />,
    icon: UserPlus,
    fields: ['level']
  }
]

export default function SignUpForm() {
  return (
    <div>
      <MultiStepForm steps={signupSteps} />
    </div>
  )
}
