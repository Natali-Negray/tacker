'use client'

import { useState, useEffect } from 'react'
import { getInfoSources, saveInfoSource, deleteInfoSource } from '@/lib/api'
import { InfoSource, StubPost } from '@/lib/types'
import { Modal } from '@/components/ui/Modal'

const STUB_POSTS: Omit<StubPost, 'sourceId' | 'sourceName'>[] = [
  { id: 's1', text: 'Новое исследование: 8 часов сна улучшают продуктивность на 34%. Регулярный режим сна — ключ к эффективности.', date: 'Сегодня, 09:14' },
  { id: 's2', text: 'Техника Pomodoro: 25 минут работы, 5 минут отдыха. Простой способ сохранять фокус в течение дня.', date: 'Сегодня, 11:02' },
  { id: 's3', text: 'Принцип Парето: 20% усилий дают 80% результата. Какие ваши 20%?', date: 'Сегодня, 13:45' },
]

const STUB_SUMMARY = 'Сегодня источники рассказывали о науке продуктивности: важность сна, техники концентрации и приоритизация задач. Ключевые темы: восстановление, фокус, 80/20.'

export default function InfoPage() {
  const [sources, setSources] = useState<InfoSource[]>([])
  const [posts, setPosts] = useState<StubPost[]>([])
  const [loading, setLoading] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    getInfoSources().then(setSources)
  }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    const s = await saveInfoSource({ name: name.trim(), url: url.trim() })
    setSources(prev => [...prev, s])
    setName('')
    setUrl('')
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await deleteInfoSource(id)
    setSources(prev => prev.filter(s => s.id !== id))
  }

  const handleRefresh = () => {
    if (sources.length === 0) return
    setLoading(true)
    setPosts([])
    setShowSummary(false)
    setTimeout(() => {
      const generated: StubPost[] = sources.flatMap(src =>
        STUB_POSTS.map(p => ({ ...p, id: `${src.id}-${p.id}`, sourceId: src.id, sourceName: src.name }))
      )
      setPosts(generated)
      setShowSummary(true)
      setLoading(false)
    }, 1200)
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-gray-50'

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Информация</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded-xl hover:bg-slate-700 transition-colors"
          >
            + Источник
          </button>
        </div>

        {/* Sources */}
        {sources.length > 0 ? (
          <div className="space-y-2">
            {sources.map(src => (
              <div key={src.id} className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between border border-gray-100 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-gray-700">{src.name}</p>
                  {src.url && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{src.url}</p>}
                </div>
                <button
                  onClick={() => handleDelete(src.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
            Нет источников. Добавьте первый.
          </div>
        )}

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={sources.length === 0 || loading}
          className="w-full py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-40 transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Загружаю...
            </span>
          ) : 'Обновить ленту'}
        </button>

        {/* Summary */}
        {showSummary && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🧠</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">Саммари за день</span>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">{STUB_SUMMARY}</p>
          </div>
        )}

        {/* Posts */}
        {posts.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Посты</p>
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {post.sourceName}
                  </span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
                {post.id && (
                  <button className="mt-2 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                    Перейти к источнику →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Добавить источник">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Название</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Productivity Channel"
              className={inputCls}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Ссылка (необязательно)</label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://..."
              className={inputCls}
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="w-full py-3 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 disabled:opacity-40 transition-colors"
          >
            Добавить
          </button>
        </div>
      </Modal>
    </div>
  )
}
