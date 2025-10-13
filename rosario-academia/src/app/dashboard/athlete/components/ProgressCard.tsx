import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function ProgressCard() {
  return (
    <Card className='md:col-span-2 lg:col-span-1'>
      <CardHeader>
        <CardTitle>Mi Progreso</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <div className='mb-1 flex justify-between'>
            <span className='text-sm font-medium'>Técnica de Crol</span>
            <span className='text-sm font-medium'>80%</span>
          </div>
          <Progress value={80} className='w-full' />
        </div>
        <div>
          <div className='mb-1 flex justify-between'>
            <span className='text-sm font-medium'>Resistencia</span>
            <span className='text-sm font-medium'>65%</span>
          </div>
          <Progress value={65} className='w-full' />
        </div>
        <div>
          <div className='mb-1 flex justify-between'>
            <span className='text-sm font-medium'>Velocidad</span>
            <span className='text-sm font-medium'>70%</span>
          </div>
          <Progress value={70} className='w-full' />
        </div>
      </CardContent>
    </Card>
  )
}
