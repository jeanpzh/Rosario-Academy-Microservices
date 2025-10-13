'use client'
import React, { createContext, useState } from 'react'
import { FormStep } from './SignUpForm'
import { FlipWords } from '@/components/flip-words'
import { FormMessage } from '@/components/form-message'
import { FormProvider, useForm } from 'react-hook-form'
import { signUpSchema, SignupSchema } from '../../schemas/sign-up-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import PrevButton from './PrevButton'
import NextButton from './NextButton'
import { useSignUp } from '@/hooks/auth/use-sign-up'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
interface MultiStepFormContextType {
  currentStepIndex: number
  isFirstStep: boolean
  isLastStep: boolean
  nextStep: () => void
  prevStep: () => void
  currentStep: FormStep
}
const words = ['aprender', 'mejorar', 'divertirte', 'practicar']

export const MultiStepFormContext =
  createContext<MultiStepFormContextType | null>(null)

export default function MultiStepForm({ steps }: { steps: FormStep[] }) {
  const methods = useForm<SignupSchema>({
    resolver: zodResolver(signUpSchema)
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const currentStep = steps[currentStepIndex]
  const { push } = useRouter()
  const { mutateAsync: signUp, isPending } = useSignUp()

  const nextStep = async () => {
    const isValid = await methods.trigger(currentStep.fields)
    if (!isValid) return
    const currentStepValues = methods.getValues(currentStep.fields)
    const formValues = Object.fromEntries(
      currentStep.fields.map((field) => [field, currentStepValues[field] ?? ''])
    )

    if (!currentStep.validationSchema) return

    const parsed = currentStep.validationSchema.safeParse(formValues)
    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          methods.setError(err.path[0] as keyof SignupSchema, {
            type: 'manual',
            message: err.message
          })
        }
        return
      })
    }
    if (currentStepIndex >= steps.length - 1) return
    setCurrentStepIndex(currentStepIndex + 1)
  }

  const prevStep = () => {
    if (currentStepIndex <= 0) return
    setCurrentStepIndex(currentStepIndex - 1)
  }

  async function onSubmit(data: SignupSchema) {
    toast.promise(signUp(data), {
      loading: 'Registrando usuario...',
      success: 'Usuario registrado correctamente',
    })
  }

  const value: MultiStepFormContextType = {
    currentStepIndex,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    nextStep,
    prevStep,
    currentStep
  }
  return (
    <MultiStepFormContext value={value}>
      <div className='flex h-auto rounded-lg shadow-xl  md:w-[80rem]  '>
        <div className='relative hidden flex-col items-center justify-center overflow-hidden bg-[rgb(246,246,246)] p-8 text-white dark:bg-black max-sm:hidden lg:flex lg:w-1/2 '>
          <div className='flex h-[40rem] items-center justify-center px-4'>
            <div className='mx-auto text-4xl font-normal text-neutral-600 dark:text-neutral-400'>
              <span className='text-5xl'>Bienvenidos!</span>
              <br /> <br />
              Academia Rosario <br />
              Ven a <FlipWords words={words} />
            </div>
          </div>
        </div>
        <div className='w-full p-4 lg:w-1/2 lg:p-8'>
          <div className='mx-auto max-w-xl'>
            <h2 className='mb-2 text-2xl font-semibold'>{currentStep.title}</h2>
            <p className='mb-6 text-gray-600'>{currentStep.description}</p>

            <FormProvider {...methods}>
              <form
                className='space-y-6'
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {currentStep.component}

                <div className='flex justify-between gap-4 mt-4'>
                  <PrevButton />
                  <NextButton isLoading={isPending} />
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </MultiStepFormContext>
  )
}
