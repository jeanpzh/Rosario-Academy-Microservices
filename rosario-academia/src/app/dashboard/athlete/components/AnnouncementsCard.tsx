import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AnnouncementsCard() {
  const announcements = [
    { title: 'Mantenimiento de la piscina', date: '15/05/2023' },
    { title: 'Nuevo horario de verano', date: '01/06/2023' },
    { title: 'Competencia interna', date: '10/06/2023' }
  ]

  return (
    <Card className='w-full md:col-span-2'>
      <CardHeader>
        <CardTitle>Anuncios</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className='space-y-2'>
          {announcements.map((announcement, index) => (
            <li key={index} className='flex items-center justify-between'>
              <span className='font-medium'>{announcement.title}</span>
              <span className='text-sm text-muted-foreground'>
                {announcement.date}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
