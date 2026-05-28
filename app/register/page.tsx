'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📋</div>
          <h1 className="text-2xl font-bold text-gray-800">Task Tracker</h1>
          <p className="text-sm text-gray-500 mt-1">Создайте аккаунт — это бесплатно</p>
        </div>

        <form action={action} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {state?.errors?.general && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
              {state.errors.general[0]}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-slate-400 transition-colors"
            />
            {state?.errors?.email && (
              <p className="text-xs text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Минимум 6 символов"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-slate-400 transition-colors"
            />
            {state?.errors?.password && (
              <p className="text-xs text-red-500">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-500 active:scale-95 transition-all disabled:opacity-50"
          >
            {pending ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-slate-600 font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
