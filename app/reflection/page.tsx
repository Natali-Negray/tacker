'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { loadDemoData, clearAllData } from '@/lib/api'

const FEATURES = [
  {
    icon: '📊',
    title: 'Аналитика задач',
    description: 'Графики выполнения по дням, неделям и месяцам. Сравнение периодов, динамика по типам задач, % завершения.',
    color: 'bg-blue-50 border-blue-100',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '✨',
    title: 'Саммари ценного',
    description: 'ИИ обобщает ваши ежедневные заметки «Ценное за день» в еженедельный и ежемесячный дайджест. Главное — одним взглядом.',
    color: 'bg-amber-50 border-amber-100',
    iconBg: 'bg-amber-100',
  },
  {
    icon: '📝',
    title: 'Заметки и черновики',
    description: 'Свободный блокнот без привязки к дате. Идеи, наброски, мысли — всё в одном месте рядом с вашими планами.',
    color: 'bg-violet-50 border-violet-100',
    iconBg: 'bg-violet-100',
  },
  {
    icon: '📤',
    title: 'Публикация',
    description: 'Отправить итоги недели или месяца в Telegram-канал, скопировать как текст или поделиться дайджестом.',
    color: 'bg-emerald-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
]

export default function ReflectionPage() {
  const router = useRouter()

  const handleLoadDemo = async () => {
    await loadDemoData()
    router.push('/day')
  }

  const handleClear = async () => {
    if (confirm('Очистить все данные? Это действие нельзя отменить.')) {
      await clearAllData()
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">

        {/* Header */}
        <div className="pt-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🪞</span>
            <h1 className="text-xl font-bold text-gray-800">Рефлексия</h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Место для осмысления. Здесь ваши данные превратятся в инсайты —
            смотрите назад, чтобы двигаться вперёд увереннее.
          </p>
        </div>

        {/* Demo block */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚀</span>
            <span className="text-sm font-semibold text-gray-700">Посмотреть как это работает</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Загрузите демо-данные: задачи на день, неделю и месяц с реалистичным содержанием — чтобы увидеть приложение в деле.
          </p>
          <button
            onClick={handleLoadDemo}
            className="w-full py-2.5 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 transition-colors"
          >
            Загрузить демо-данные
          </button>
        </div>

        {/* Status banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg">🔧</span>
          <div>
            <p className="text-xs font-semibold text-slate-600">В разработке</p>
            <p className="text-xs text-slate-400">Функции появятся в следующих версиях</p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="space-y-3">
          {FEATURES.map(f => (
            <div key={f.title} className={`rounded-2xl border p-4 ${f.color}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.iconBg}`}>
                  <span className="text-xl">{f.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-800">{f.title}</span>
                    <span className="text-xs bg-white/70 text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                      Скоро
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="border border-red-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-red-400 mb-1">Опасная зона</p>
          <p className="text-xs text-gray-400 mb-3">Удалить все задачи, планы и заметки из приложения.</p>
          <button
            onClick={handleClear}
            className="text-xs text-red-400 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            Очистить все данные
          </button>
        </div>

        {/* Account */}
        <div className="border border-gray-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">Аккаунт</p>
          <p className="text-xs text-gray-400 mb-3">Данные хранятся в базе данных и привязаны к вашему аккаунту.</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Выйти из аккаунта
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
