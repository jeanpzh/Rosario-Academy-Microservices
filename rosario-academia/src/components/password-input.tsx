'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import { Control, useFormState } from 'react-hook-form'

interface PasswordInputProps extends React.HTMLProps<HTMLInputElement> {
  label: string
  name: string
  control?: Control<any>
}

export default function PasswordInput({
  label,
  control,
  name,
  ...props
}: PasswordInputProps) {
  const { type, ...rest } = props
  const id = useId()
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const { errors } = useFormState({ control: control })

  const toggleVisibility = () => setIsVisible((prev) => !prev)

  const registerProps = control ? control.register(name) : {}

  return (
    <div className='min-w-full space-y-2'>
      <Label htmlFor={id}>{label}</Label>
      <div className='relative'>
        <Input
          type={isVisible ? 'text' : 'password'}
          id={id}
          placeholder={rest.placeholder || 'Password'}
          {...registerProps}
          {...rest}
          name={name}
        />
        <button
          className='absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
          type='button'
          onClick={toggleVisibility}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          aria-controls='password'
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden='true' />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden='true' />
          )}
        </button>
      </div>
      {control && errors[name] && (
        <p className='mt-1 text-xs text-red-500' role='alert'>
          {errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  )
}
