import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'

export const verifySession = cache(async (): Promise<{ userId: string }> => {
  const session = await getSession()
  if (!session?.userId) {
    redirect('/login')
  }
  return { userId: session.userId }
})

export const getCurrentUserId = cache(async (): Promise<string | null> => {
  const session = await getSession()
  return session?.userId ?? null
})
