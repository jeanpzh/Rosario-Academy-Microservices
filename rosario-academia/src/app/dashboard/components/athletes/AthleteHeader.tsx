'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { DEFAULT_IMAGE } from '@/utils/utils'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from 'lucide-react'
import { HoverPaymentModal } from './PaymentButton'
interface AthleteHeaderProps {
  athlete: User
}

export function AthleteHeader({ athlete }: AthleteHeaderProps) {
  const router = useRouter()
  const fullName = `${athlete.firstName} ${athlete.paternalLastName} ${athlete.maternalLastName}`

  const handleGoBack = () => {
    router.back()
  }
  return (
    <Card className='flex max-h-56 min-w-full flex-col p-2 '>
      <Button size={'icon'} variant={'ghost'} onClick={handleGoBack}>
        <ArrowLeftIcon />
      </Button>
      <CardContent className='flex w-full items-center justify-between space-x-4 p-6'>
        <div className='flex items-center space-x-4'>
          <Avatar className='size-16'>
            <AvatarImage src={athlete.avatarUrl || DEFAULT_IMAGE} />
            <AvatarFallback className='bg-primary text-primary-foreground'>
              {athlete.firstName}
              {athlete.paternalLastName}
              {athlete.maternalLastName}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className='text-2xl font-bold'>{fullName}</h2>
            <p className='text-muted-foreground'>Historial de Pagos</p>
          </div>
        </div>
        <HoverPaymentModal athlete={athlete} />
      </CardContent>
    </Card>
  )
}
