'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  getPeriodTasks, savePeriodTask, updatePeriodTask, deletePeriodTask,
  movePeriodTask, getPeriodNote, savePeriodNote,
  todayStr, getWeekKey, getMonthKey, formatWeekDisplay, formatMonthDisplay,
  addWeeks, addMonths, getTaskTypeStats
} from '@/lib/store'
import { PeriodTask, FilterType } from '@/lib/types'
import { TypeProgressBlock } from '@/components/ui/ProgressBar'
import { FilterBar } from '@/components/ui/FilterBar'
import { PeriodNav } from '@/components/ui/PeriodNav'
import { FAB } from '@/components/ui/FAB'
import { PeriodTaskCard } from '@/components/ui/PeriodTaskCard'
import { PeriodTaskModal } from '@/components/modals/PeriodTaskModal'
import { MovePeriodTaskModal } from '@/components/modals/MovePeriodTaskModal'

export default function PlansPage() {
  const today = todayStr()
  const [periodType, setPeriodType] = useState<'week' | 'month'>('week')
  const [period, setPeriod] = useState(() => getWeekKey(today))
  const [tasks, setTasks] = useState<PeriodTask[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [note, setNote] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState<PeriodTask | null>(null)
  const [moveModalOpen, setMoveModalOpen] = useState(false)
  const [movingTask, setMovingTask] = useState<PeriodTask | null>(null)

  useEffect(() => {
    const newPeriod = periodType === 'week' ? getWeekKey(today) : getMonthKey(today)
    setPeriod(newPeriod)
  }, [periodType, today])

  const reload = useCallback(() => {
    setTasks(getPeriodTasks(period))
    setNote(getPeriodNote(period))
  }, [period])

  useEffect(() => { reload() }, [reload])

  const currentPeriod = periodType === 'week' ? getWeekKey(today) : getMonthKey(today)
  const isCurrent = period === currentPeriod
  const periodLabel = periodType === 'week' ? formatWeekDisplay(period) : formatMonthDisplay(period)
  const currentLabel = periodType === 'week' ? 'Эта неделя' : 'Этот месяц'
  const noteLabel = periodType === 'week' ? 'Ценное за неделю' : 'Ценное за месяц'
  const notePlaceholder = periodType === 'week'
    ? 'Что важного случилось на этой неделе? Что удалось, что узнал...'
    : 'Главные итоги месяца, победы, уроки...'

  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.status === 'done'
    if (filter === 'undone') return t.status !== 'done'
    return true
  })

  const done = tasks.filter(t => t.status === 'done').length
  const stats = getTaskTypeStats(tasks)

  const navigate = (dir: number) => {
    if (periodType === 'week') setPeriod(prev => addWeeks(prev, dir))
    else setPeriod(prev => addMonths(prev, dir))
  }

  const handleSave = (data: Omit<PeriodTask, 'id' | 'createdAt'>) => {
    if (editTask) updatePeriodTask(period, editTask.id, data)
    else savePeriodTask(data)
    reload()
    setEditTask(null)
  }

  const handleStatusChange = (id: string, status: PeriodTask['status']) => {
    updatePeriodTask(period, id, { status })
    reload()
  }

  const handleDelete = (id: string) => {
    deletePeriodTask(period, id)
    reload()
  }

  const handleMove = (task: PeriodTask, targetPeriod: string) => {
    movePeriodTask(task, targetPeriod)
    reload()
  }

  const handleNoteChange = (text: string) => {
    setNote(text)
    savePeriodNote(period, text)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-4">

        {/* Period type switcher */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {(['week', 'month'] as const).map(pt => (
            <button
              key={pt}
              onClick={() => setPeriodType(pt)}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-200 ${
                periodType === pt ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              {pt === 'week' ? 'Неделя' : 'Месяц'}
            </button>
          ))}
        </div>

        {/* Period nav */}
        <PeriodNav
          label={periodLabel}
          isToday={isCurrent}
          todayLabel={currentLabel}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
          onToday={() => setPeriod(currentPeriod)}
        />

        {/* Filter */}
        <FilterBar value={filter} onChange={setFilter} />

        {/* Task list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              {tasks.length === 0
                ? `Целей на ${periodType === 'week' ? 'неделю' : 'месяц'} пока нет`
                : 'Нет задач по фильтру'}
            </div>
          ) : (
            filtered.map(task => (
              <PeriodTaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={t => { setEditTask(t); setModalOpen(true) }}
                onDelete={handleDelete}
                onMove={t => { setMovingTask(t); setMoveModalOpen(true) }}
              />
            ))
          )}
        </div>

        {/* Progress — at the bottom */}
        <TypeProgressBlock stats={stats} totalDone={done} totalCount={tasks.length} />

        {/* Ценное за период */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">✨</span>
            <span className="text-sm font-semibold text-gray-700">{noteLabel}</span>
          </div>
          <textarea
            value={note}
            onChange={e => handleNoteChange(e.target.value)}
            placeholder={notePlaceholder}
            rows={4}
            className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none bg-transparent leading-relaxed"
          />
        </div>

      </div>

      <FAB onClick={() => { setEditTask(null); setModalOpen(true) }} />

      <PeriodTaskModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null) }}
        onSave={handleSave}
        initial={editTask}
        period={period}
        periodType={periodType}
      />

      <MovePeriodTaskModal
        open={moveModalOpen}
        onClose={() => { setMoveModalOpen(false); setMovingTask(null) }}
        onMove={handleMove}
        task={movingTask}
      />
    </div>
  )
}
