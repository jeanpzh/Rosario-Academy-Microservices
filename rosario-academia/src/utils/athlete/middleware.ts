import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const restrictedUrls = [
  '/dashboard/athlete/schedule',
  '/dashboard/athlete/carnet'
]

export const athleteMiddleware = async (
  request: NextRequest,
  user: any
): Promise<NextResponse | undefined> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('enrollment_requests')
    .select('status')
    .match({ athlete_id: user.id })
  console.log({ data, error })
  if (error || !data) {
    console.log({ error })
    return
  }
  if (
    data[0].status !== 'approved' &&
    restrictedUrls.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL('/dashboard/athlete', request.url))
  }
  return
}
