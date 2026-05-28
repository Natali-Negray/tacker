'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getDayTasks, saveDayTask, updateDayTask, deleteDayTask, moveTask,
  getDailyNote, saveDailyNote,
} from '@/lib/api'
import {
  todayStr, addDays, formatDateDisplay, getTaskTypeStats,
} from '@/lib/store'
import { DayTask, FilterType } from '@/lib/types'
import { TypeProgressBlock } from '@/components/ui/ProgressBar'
import { FilterBar } from '@/components/ui/FilterBar'
import { PeriodNav } from '@/components/ui/PeriodNav'
import { FAB } from '@/components/ui/FAB'
import { TaskCard } from '@/components/ui/TaskCard'
import { DayTaskModal } from '@/components/modals/DayTaskModal'
import { MoveTaskModal } from '@/components/modals/MoveTaskModal'

const MORNING_STUB = 'Сегодня новый день полный возможностей. Сфокусируйся на главном — и всё получится.'

function getEveningStub(done: number, total: number): string {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  if (pct >= 80) return `Отличный день! Выполнено ${done} из ${total} задач. Ты продуктивен и молодец.`
  if (pct >= 50) return `Хороший прогресс: ${done} из ${total} задач. Оставшееся — возможность для завтра.`
  return `День был непростым: ${done} из ${total} задач. Завтра — новый шанс начать с чистого листа.`
}

type SectionKey = 'morning' | 'afternoon' | 'evening'

const SECTION_LABELS: Record<SectionKey, string> = {
  morning: 'Утро',
  afternoon: 'День',
  evening: 'Вечер',
}

function toMinutes(timeValue: string): number {
  const [h, m] = timeValue.split(':').map(Number)
  const min = h * 60 + m
  return min < 240 ? min + 1440 : min
}

function getSection(task: DayTask): SectionKey {
  if (task.timeType === 'slot') return task.timeValue as SectionKey
  const min = toMinutes(task.timeValue)
  if (min >= 240 && min < 720) return 'morning'
  if (min >= 720 && min < 1020) return 'afternoon'
  return 'evening'
}

function sortOrder(task: DayTask): number {
  const BASE: Record<SectionKey, number> = { morning: 0, afternoon: 10000, evening: 20000 }
  const section = getSection(task)
  if (task.timeType === 'slot') return BASE[section] + 9000
  return BASE[section] + toMinutes(task.timeValue)
}

interface Section {
  key: SectionKey
  tasks: DayTask[]
}

function groupBySection(tasks: DayTask[]): Section[] {
  const sorted = [...tasks].sort((a, b) => sortOrder(a) - sortOrder(b))
  const map: Record<SectionKey, DayTask[]> = { morning: [], afternoon: [], evening: [] }
  sorted.forEach(t => map[getSection(t)].push(t))
  return (['morning', 'afternoon', 'evening'] as SectionKey[])
    .filter(k => map[k].length > 0)
    .map(k => ({ key: k, tasks: map[k] }))
}

export default function DayPage() {
  const [date, setDate] = useState(todayStr())
  const [tasks, setTasks] = useState<DayTask[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [note, setNote] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<DayTask | null>(null)
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [moveTask_, setMoveTask_] = useState<DayTask | null>(null)
  const [isEvening, setIsEvening] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsEvening(new Date().getHours() >= 18)
  }, [])

  const reload = useCallback(async () => {
    setLoading(true)
    const [t, n] = await Promise.all([getDayTasks(date), getDailyNote(date)])
    setTasks(t)
    setNote(n)
    setLoading(false)
  }, [date])

  useEffect(() => { reload() }, [reload])

  const filteredTasks = tasks.filter(t => {
    if (filter === 'done') return t.status === 'done'
    if (filter === 'undone') return t.status !== 'done'
    return true
  })

  const sections = groupBySection(filteredTasks)
  const done = tasks.filter(t => t.status === 'done').length
  const stats = getTaskTypeStats(tasks)

  const handleSave = async (data: Omit<DayTask, 'id' | 'createdAt'>) => {
    if (editTask) await updateDayTask(date, editTask.id, data)
    else await saveDayTask(data)
    await reload()
    setEditTask(null)
  }

  const handleStatusChange = async (id: string, newStatus: DayTask['status']) => {
    await updateDayTask(date, id, { status: newStatus })
    await reload()
  }

  const handleDelete = async (id: string) => {
    await deleteDayTask(date, id)
    await reload()
  }

  const handleMove = async (task: DayTask, targetDate: string) => {
    await moveTask(task, targetDate)
    await reload()
  }

  const openMoveModal = (task: DayTask) => {
    setMoveTask_(task)
    setMoveModalOpen(true)
  }

  const handleNoteChange = (text: string) => {
    setNote(text)
    saveDailyNote(date, text)
  }

  const today = todayStr()
  const isToday = date === today

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">

        <PeriodNav
          label={formatDateDisplay(date)}
          isToday={isToday}
          todayLabel="Сегодня"
          onPrev={() => setDate(addDays(date, -1))}
          onNext={() => setDate(addDays(date, 1))}
          onToday={() => setDate(today)}
          currentDate={date}
          onDateChange={setDate}
        />

        {/* Morning motivator */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">☀️</span>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Утро</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-900">{MORNING_STUB}</p>
        </div>

        {/* Filter */}
        <FilterBar value={filter} onChange={setFilter} />

        {/* Task list */}
        {loading ? (
          <div className="text-center py-10 text-gray-300 text-sm">Загрузка...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Задач пока нет. Нажмите + чтобы добавить
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            Нет задач по фильтру
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map(section => (
              <div key={section.key}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {SECTION_LABELS[section.key]}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div className="space-y-2">
                  {section.tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={t => { setEditTask(t); setModalOpen(true) }}
                      onDelete={handleDelete}
                      onMove={openMoveModal}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress */}
        <TypeProgressBlock stats={stats} totalDone={done} totalCount={tasks.length} />

        {/* Evening motivator */}
        {isEvening && tasks.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🌙</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400">Итог дня</span>
            </div>
            <p className="text-sm leading-relaxed text-indigo-700">
              {getEveningStub(done, tasks.length)}
            </p>
          </div>
        )}

        {/* Valuable of the day */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✨</span>
            <span className="text-sm font-semibold text-gray-700">Ценное за день</span>
          </div>
          <textarea
            value={note}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder="Что важного произошло сегодня? Что узнал, что почувствовал..."
            rows={4}
            className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none bg-transparent leading-relaxed"
          />
        </div>

      </div>

      <FAB onClick={() => { setEditTask(null); setModalOpen(true) }} />

      <DayTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSave={handleSave}
        initial={editTask}
        defaultDate={date}
      />

      <MoveTaskModal
        open={moveModalOpen}
        onClose={() => { setMoveModalOpen(false); setMoveTask_(null) }}
        onMove={handleMove}
        task={moveTask_}
      />
    </div>
  )
}
