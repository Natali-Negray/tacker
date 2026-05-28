'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { PeriodTask, TaskType, TaskStatus, TASK_TYPE_LABELS, TASK_TYPES, STATUS_LABELS } from '@/lib/types'

interface PeriodTaskModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<PeriodTask, 'id' | 'createdAt'>) => void
  initial?: PeriodTask | null
  period: string
  periodType: 'week' | 'month'
}

const labelCls = 'text-xs font-medium text-gray-500 mb-1.5 block'
const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-200 bg-gray-50'

function PickerBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
        active
          ? 'bg-slate-600 text-white border-slate-600'
          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

export function PeriodTaskModal({ open, onClose, onSave, initial, period, periodType }: PeriodTaskModalProps) {
  const [body, setBody] = useState('')
  const [type, setType] = useState<TaskType>('work')
  const [status, setStatus] = useState<TaskStatus>('in_progress')

  useEffect(() => {
    if (initial) {
      setBody(initial.body)
      setType(initial.type)
      setStatus(initial.status)
    } else {
      setBody('')
      setType('work')
      setStatus('in_progress')
    }
  }, [initial, open])

  const handleSave = () => {
    if (!body.trim()) return
    onSave({ body: body.trim(), type, status, period, periodType })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Редактировать' : `Цель на ${periodType === 'week' ? 'неделю' : 'месяц'}`}>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Задача</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Опишите цель..."
            rows={3}
            className={`${inputCls} resize-none`}
            autoFocus
          />
        </div>

        <div>
          <label className={labelCls}>Тип</label>
          <div className="grid grid-cols-2 gap-2">
            {TASK_TYPES.map(t => (
              <PickerBtn key={t} active={type === t} onClick={() => setType(t)}>
                {TASK_TYPE_LABELS[t]}
              </PickerBtn>
            ))}
          </div>
        </div>

        {initial && (
          <div>
            <label className={labelCls}>Статус</label>
            <div className="grid grid-cols-3 gap-2">
              {(['in_progress', 'done', 'postponed'] as TaskStatus[]).map(s => (
                <PickerBtn key={s} active={status === s} onClick={() => setStatus(s)}>
                  {STATUS_LABELS[s]}
                </PickerBtn>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!body.trim()}
          className="w-full py-3 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 disabled:opacity-40 transition-colors"
        >
          {initial ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </Modal>
  )
}
