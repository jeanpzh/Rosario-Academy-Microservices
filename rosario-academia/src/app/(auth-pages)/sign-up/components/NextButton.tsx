import React from 'react'
import useSignupContext from '../hooks/use-signup-context'
import { HoverBorderGradient as Button } from '@/components/hover-border-gradient'
import { cn } from '@/lib/utils'

export default function NextButton({
  isLoading = false
}: {
  isLoading?: boolean
}) {
  const { isLastStep, nextStep } = useSignupContext()

  const handleClick = () => {
    if (!isLastStep) {
      nextStep()
    }
  }

  return (
    <Button
      className={cn('active:scale-95 hover:scale-105 transition-all')}
      onClick={handleClick}
      type={isLastStep ? 'submit' : 'button'}
    >
      {isLoading ? 'Cargando...' : isLastStep ? 'Registrarse' : 'Siguiente'}
    </Button>
  )
}
