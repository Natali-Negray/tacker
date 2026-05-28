'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { createSession, deleteSession } from '@/lib/session'

const AuthSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }).trim().toLowerCase(),
  password: z.string().min(6, { message: 'Пароль — минимум 6 символов' }),
})

export type AuthState = {
  errors?: { email?: string[]; password?: string[]; general?: string[] }
} | undefined

export async function signup(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  // Check if user already exists
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) {
    return { errors: { email: ['Этот email уже зарегистрирован'] } }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const inserted = await db.insert(users).values({ email, passwordHash }).returning({ id: users.id })

  const user = inserted[0]
  if (!user) {
    return { errors: { general: ['Ошибка при создании аккаунта. Попробуйте ещё раз.'] } }
  }

  await createSession(user.id)
  redirect('/day')
}

export async function login(state: AuthState, formData: FormData): Promise<AuthState> {
  const result = AuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data

  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const user = rows[0]

  if (!user) {
    return { errors: { general: ['Неверный email или пароль'] } }
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return { errors: { general: ['Неверный email или пароль'] } }
  }

  await createSession(user.id)
  redirect('/day')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
