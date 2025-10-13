import React from 'react'
import useSignupContext from '../hooks/use-signup-context'
import { HoverBorderGradient as Button } from '@/components/hover-border-gradient'
import { cn } from '@/lib/utils'

export default function PrevButton() {
  const { isFirstStep, prevStep } = useSignupContext()
  return (
    <Button
      className={cn(isFirstStep && 'hidden', 'active:scale-95 hover:scale-105 transition-all')}
      onClick={prevStep}
      type='button'
    >
      Anterior
    </Button>
  )
}
