import { NextRequest, NextResponse } from 'next/server'
import { extractAuthToken } from '@/utils/auth/token-utils'

export async function middleware(request: NextRequest) {
  try {
    const token = extractAuthToken(request)
    if (!token) return NextResponse.redirect(new URL('/sign-in', request.url))

    let userRole: string | undefined
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
      )
      userRole = payload?.role
    } catch (e) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    if (!userRole) {
      return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Redirect to respective dashboard if the user presses "/dashboard" in the URL
    if (request.nextUrl.pathname === '/dashboard') {
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      } else if (userRole === 'athlete' || userRole === 'deportista') {
        return NextResponse.redirect(new URL('/dashboard/athlete', request.url))
      } else if (userRole === 'auxiliar_administrativo') {
        return NextResponse.redirect(
          new URL('/dashboard/auxiliar', request.url)
        )
      } else {
        return NextResponse.redirect(new URL('/sign-in', request.url))
      }
    }

    // Redirect to the sign-in page if the user is not who they say they are
    if (
      request.nextUrl.pathname.startsWith('/dashboard/admin') &&
      userRole !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (
      request.nextUrl.pathname.startsWith('/dashboard/athlete') &&
      userRole !== 'athlete' &&
      userRole !== 'deportista'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if (
      request.nextUrl.pathname.startsWith('/dashboard/auxiliar') &&
      userRole !== 'auxiliar_administrativo'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // La verificación de aprobación de atleta ahora se maneja en el backend (NestJS Guards)
    // El frontend solo maneja routing básico por roles

    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}

// matcher for the middleware to run
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard/admin/:path*',
    '/dashboard/athlete/:path*',
    '/dashboard/admin-auxiliar/:path*',
    '/dashboard/athlete/profile/:path*',
    '/dashboard/athlete/schedule/:path*',
    '/dashboard/athlete/carnet/:path*'
  ]
}
