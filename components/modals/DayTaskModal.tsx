'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import {
  DayTask, TaskType, TaskStatus, TimeType, TimeSlot,
  TASK_TYPE_LABELS, TASK_TYPES, TIME_SLOT_LABELS, STATUS_LABELS
} from '@/lib/types'

interface DayTaskModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Omit<DayTask, 'id' | 'createdAt'>) => void
  initial?: DayTask | null
  defaultDate: string
}

const EMPTY: Omit<DayTask, 'id' | 'createdAt'> = {
  body: '',
  timeType: 'slot',
  timeValue: 'morning',
  status: 'in_progress',
  type: 'work',
  date: '',
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

export function DayTaskModal({ open, onClose, onSave, initial, defaultDate }: DayTaskModalProps) {
  const [body, setBody] = useState('')
  const [timeType, setTimeType] = useState<TimeType>('slot')
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('morning')
  const [timeFixed, setTimeFixed] = useState('09:00')
  const [status, setStatus] = useState<TaskStatus>('in_progress')
  const [type, setType] = useState<TaskType>('work')

  useEffect(() => {
    if (initial) {
      setBody(initial.body)
      setTimeType(initial.timeType)
      if (initial.timeType === 'slot') setTimeSlot(initial.timeValue as TimeSlot)
      else setTimeFixed(initial.timeValue)
      setStatus(initial.status === 'moved' ? 'in_progress' : initial.status)
      setType(initial.type)
    } else {
      setBody('')
      setTimeType('slot')
      setTimeSlot('morning')
      setTimeFixed('09:00')
      setStatus('in_progress')
      setType('work')
    }
  }, [initial, open])

  const handleSave = () => {
    if (!body.trim()) return
    onSave({
      ...EMPTY,
      body: body.trim(),
      timeType,
      timeValue: timeType === 'slot' ? timeSlot : timeFixed,
      status,
      type,
      date: initial?.date ?? defaultDate,
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Редактировать задачу' : 'Новая задача'}>
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Задача</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Что нужно сделать..."
            rows={3}
            className={`${inputCls} resize-none`}
            autoFocus
          />
        </div>

        <div>
          <label className={labelCls}>Тип задачи</label>
          <div className="grid grid-cols-2 gap-2">
            {TASK_TYPES.map(t => (
              <PickerBtn key={t} active={type === t} onClick={() => setType(t)}>
                {TASK_TYPE_LABELS[t]}
              </PickerBtn>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Время</label>
          <div className="flex gap-2 mb-2">
            {(['slot', 'fixed'] as TimeType[]).map(tt => (
              <PickerBtn key={tt} active={timeType === tt} onClick={() => setTimeType(tt)}>
                {tt === 'slot' ? 'Часть дня' : 'Точное время'}
              </PickerBtn>
            ))}
          </div>
          {timeType === 'slot' ? (
            <div className="grid grid-cols-3 gap-2">
              {(['morning', 'afternoon', 'evening'] as TimeSlot[]).map(s => (
                <PickerBtn key={s} active={timeSlot === s} onClick={() => setTimeSlot(s)}>
                  {TIME_SLOT_LABELS[s]}
                </PickerBtn>
              ))}
            </div>
          ) : (
            <input type="time" value={timeFixed} onChange={e => setTimeFixed(e.target.value)} className={inputCls} />
          )}
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
          className="w-full py-3 bg-slate-600 text-white text-sm font-semibold rounded-xl hover:bg-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {initial ? 'Сохранить' : 'Добавить задачу'}
        </button>
      </div>
    </Modal>
  )
}
