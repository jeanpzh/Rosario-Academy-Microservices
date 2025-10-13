'use client'

import { useForm } from 'react-hook-form'
import TextField from '@/app/(auth-pages)/components/TextField'
import { Button } from '@/components/ui/button'
import {
  athleteFormSchema,
  type AthleteFormData
} from '@/app/dashboard/schemas/athlete-schema'
import { useEffect, useCallback, useState } from 'react'
import { useUpdateAthleteMutation } from '@/hooks/use-update-athlete'
import { useAddAthleteMutation } from '@/hooks/use-add-athlete'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAthleteModalStore } from '@/lib/stores/useAthleteStore'
import { DialogTitle } from '@/components/ui/dialog'

export default function AthleteForm({
  mode
}: {
  mode: 'create' | 'edit' | undefined
}) {
  const { currentItem } = useAthleteModalStore()
  const { control, reset, handleSubmit, watch } = useForm<AthleteFormData>({
    resolver: zodResolver(athleteFormSchema)
  })
  const avatarUrl = watch('avatar_url')

  const updateMutation = useUpdateAthleteMutation()

  const addMutation = useAddAthleteMutation()
  let isLoading = updateMutation.isPending || addMutation.isPending
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<Blob | null>(null)

  // Manejo del drag & drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: mode !== 'create'
  })

  const onSubmit = async (data: AthleteFormData) => {
    try {
      if (mode === 'create') {
        if (!avatarFile) {
          console.error('No se ha seleccionado una imagen')
          return
        }
        addMutation.mutate({ data, file: avatarFile })
      } else {
        updateMutation.mutate(data)
      }
    } catch (error) {
      console.error('Error en submit:', error)
    }
  }

  // Resetea el formulario según el modo
  useEffect(() => {
    if (mode === 'create') {
      reset({
        first_name: '',
        paternal_last_name: '',
        maternal_last_name: '',
        birth_date: '',
        dni: '',
        phone: '',
        email: '',
        avatar_url: '',
        level: 'beginner'
      })
      setAvatarPreview(null)
      setAvatarFile(null)
    } else if (currentItem) {
      const athlete = currentItem as AthleteFormData
      reset({
        first_name: athlete.first_name,
        paternal_last_name: athlete.paternal_last_name,
        maternal_last_name: athlete.maternal_last_name,
        birth_date: athlete.birth_date,
        dni: athlete.dni,
        phone: athlete.phone,
        email: athlete.email,
        avatar_url: athlete.avatar_url,
        level: athlete.level
      })
      setAvatarPreview((athlete.avatar_url as string) || null)
    }
  }, [currentItem, reset, mode])

  return (
    <>
      <DialogTitle>
        {mode === 'create' ? 'Nuevo Deportista' : 'Editar Deportista'}
      </DialogTitle>
      <div className='flex flex-col items-center space-y-6'>
        <div
          {...getRootProps()}
          className={`size-40 overflow-hidden rounded-full border-2 ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          } ${mode === 'create' ? 'cursor-pointer' : ''}`}
        >
          {mode === 'create' && <input {...getInputProps()} />}
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt='Avatar Preview'
              width={160}
              height={160}
              className='object-cover'
            />
          ) : avatarUrl ? (
            <Image
              src={avatarUrl as string}
              alt='Athlete Avatar'
              width={160}
              height={160}
              className='object-cover'
            />
          ) : (
            <div className='flex size-full items-center justify-center bg-gray-100 text-gray-400'>
              {mode === 'create' ? 'Drag or click to upload' : 'No image'}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid w-full grid-cols-1 gap-4 md:grid-cols-2'
        >
          <TextField
            label='Nombre'
            placeholder='Nombre'
            control={control}
            name='first_name'
            htmlFor='first_name'
          />
          <TextField
            label='Apellido Paterno'
            placeholder='Apellido Paterno'
            control={control}
            name='paternal_last_name'
            htmlFor='paternal_last_name'
          />
          <TextField
            label='Apellido Materno'
            placeholder='Apellido Materno'
            control={control}
            name='maternal_last_name'
            htmlFor='maternal_last_name'
          />
          <TextField
            label='Fecha de Nacimiento'
            placeholder='YYYY-MM-DD'
            control={control}
            name='birth_date'
            htmlFor='birth_date'
            type='date'
          />
          <TextField
            label='DNI'
            placeholder='DNI'
            control={control}
            name='dni'
            htmlFor='dni'
          />
          <TextField
            label='Teléfono'
            placeholder='Teléfono'
            control={control}
            name='phone'
            htmlFor='phone'
          />
          <TextField
            label='Correo Electrónico'
            placeholder='Correo Electrónico'
            control={control}
            name='email'
            htmlFor='email'
            readOnly={mode === 'edit'}
          />
          <TextField
            label='Nivel'
            placeholder='Nivel'
            control={control}
            name='level'
            htmlFor='level'
            type='select'
            options={['beginner', 'intermediate', 'advanced']}
            disabled={mode === 'edit'}
          />
          <div className='flex justify-end md:col-span-2'>
            <Button type='submit'>
              {/* MODE AND LOADING */}
              {isLoading
                ? 'Guardando...'
                : mode === 'create'
                  ? 'Guardar'
                  : 'Actualizar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
