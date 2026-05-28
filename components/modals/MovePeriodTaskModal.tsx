'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { PeriodTask } from '@/lib/types'
import { getUpcomingWeeks, getUpcomingMonths } from '@/lib/store'

interface MovePeriodTaskModalProps {
  open: boolean
  onClose: () => void
  onMove: (task: PeriodTask, targetPeriod: string) => void
  task: PeriodTask | null
}

export function MovePeriodTaskModal({ open, onClose, onMove, task }: MovePeriodTaskModalProps) {
  const [targetPeriod, setTargetPeriod] = useState('')
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    if (!task) return
    const opts = task.periodType === 'week'
      ? getUpcomingWeeks(task.period)
      : getUpcomingMonths(task.period)
    setOptions(opts)
    setTargetPeriod(opts[0]?.value ?? '')
  }, [task, open])

  const handleMove = () => {
    if (!task || !targetPeriod) return
    onMove(task, targetPeriod)
    onClose()
  }

  const labelCls = 'text-xs font-medium text-gray-500 mb-1.5 block'
  const isWeek = task?.periodType === 'week'

  return (
    <Modal open={open} onClose={onClose} title={`Перенести на другую ${isWeek ? 'неделю' : 'месяц'}`}>
      {task && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-sm text-gray-600 leading-snug">{task.body}</p>
          </div>

          <div>
            <label className={labelCls}>{isWeek ? 'Выберите неделю' : 'Выберите месяц'}</label>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setTargetPeriod(opt.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm border transition-all ${
                    targetPeriod === opt.value
                      ? 'bg-slate-600 text-white border-slate-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleMove}
              disabled={!targetPeriod}
              className="flex-1 py-2.5 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 disabled:opacity-40 transition-colors"
            >
              Перенести
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
