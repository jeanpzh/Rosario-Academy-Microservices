'use client'

import React from 'react'
import { useState } from 'react'
import { FormMessage, type Message } from '@/components/form-message'
import { motion } from 'framer-motion'
import { FORM_FIELDS_STEP_ONE } from '@/app/(auth-pages)/fields'
import { signUpAction } from '@/app/(auth-pages)/actions'
import { FormProvider, useForm } from 'react-hook-form'
import {
  signUpSchema,
  type SignUpSchema
} from '@/app/(auth-pages)/schemas/sign-up-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FlipWords } from '@/components/flip-words'
import SignUpStepOne from '@/app/(auth-pages)/components/SignUpStepOne'
import SignUpStepTwo from '@/app/(auth-pages)/components/SignUpStepTwo'
import { toast } from 'sonner'
import { useSignUp } from '@/hooks/auth/use-sign-up'
import { useRouter } from 'next/navigation'

interface SignUpFormProps {
  message: Message
}

export default function SignUpForm({ message }: SignUpFormProps) {
  const { mutate: signUp } = useSignUp()
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [step, setStep] = useState(1)

  const words = ['aprender', 'mejorar', 'divertirte', 'practicar']
  const methods = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema)
  })
  const {
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    formState: { errors }
  } = methods

  const onSubmit = async (data: SignUpSchema) => {
    try {
      setPending(true)
      signUp(data, {
        onSuccess: (data) => {
          toast.success('Éxito', {
            description: 'Registro exitoso'
          })
          setPending(false)
          clearErrors()
          setStep(1)
          router.push('/auth/sign-in')
        },
        onError: (error) => {
          setPending(false)
          setError('root', {
            type: 'manual',
            message: error.message || 'Error al registrarse'
          })
        }
      })
    } catch (err: any) {
      throw err
    } finally {
      setPending(false)
    }
  }

  const onError = (formErrors: typeof errors) => {
    const firstErrorField = Object.keys(formErrors)[0] as keyof SignUpSchema
    if (!firstErrorField) return

    const stepOneFieldNames = FORM_FIELDS_STEP_ONE.map((field) => field.name)
    const errorStep = stepOneFieldNames.includes(firstErrorField) ? 1 : 2

    if (step !== errorStep) {
      setStep(errorStep)
      setTimeout(() => {
        setFocus(firstErrorField)
      }, 300)
    } else {
      setFocus(firstErrorField)
    }
  }

  return (
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
          <h2 className='mb-2 text-2xl font-semibold'>Registrar</h2>
          <p className='mb-6 text-gray-600'>
            Ingresa tus datos para registrarte
          </p>

          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className='space-y-6'
            >
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 ? (
                  <SignUpStepOne onNext={() => setStep(2)} />
                ) : (
                  <SignUpStepTwo
                    onPrevStep={() => setStep(1)}
                    pending={pending}
                  />
                )}
              </motion.div>
            </form>
            <FormMessage message={message} />
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
