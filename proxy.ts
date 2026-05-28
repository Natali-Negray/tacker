import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const publicRoutes = ['/login', '/register']

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.some(r => path.startsWith(r))

  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect authenticated users away from login/register
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/day', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
