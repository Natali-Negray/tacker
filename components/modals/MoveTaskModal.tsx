'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { DayTask, TimeType, TimeSlot, TIME_SLOT_LABELS } from '@/lib/types'
import { addDays, todayStr } from '@/lib/store'

interface MoveTaskModalProps {
  open: boolean
  onClose: () => void
  onMove: (task: DayTask, targetDate: string) => void
  task: DayTask | null
}

export function MoveTaskModal({ open, onClose, onMove, task }: MoveTaskModalProps) {
  const [moveDate, setMoveDate] = useState(addDays(todayStr(), 1))

  const handleMove = () => {
    if (!task) return
    onMove(task, moveDate)
    onClose()
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-200 bg-gray-50'
  const labelCls = 'text-xs font-medium text-gray-500 mb-1.5 block'

  return (
    <Modal open={open} onClose={onClose} title="Перенести задачу">
      {task && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl px-3 py-2.5">
            <p className="text-sm text-gray-600 leading-snug">{task.body}</p>
          </div>

          <div>
            <label className={labelCls}>Перенести на дату</label>
            <input
              type="date"
              value={moveDate}
              min={todayStr()}
              onChange={e => e.target.value && setMoveDate(e.target.value)}
              className={inputCls}
            />
          </div>

          <p className="text-xs text-gray-400">
            Задача появится в разделе «Утро» выбранного дня
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleMove}
              className="flex-1 py-2.5 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 transition-colors"
            >
              Перенести
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
