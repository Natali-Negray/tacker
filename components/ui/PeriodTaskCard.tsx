'use client'

import { PeriodTask, TASK_TYPE_LABELS, TASK_TYPE_BORDER_COLORS, TASK_TYPE_DOT_COLORS } from '@/lib/types'
import { StatusBadge, nextStatus } from './StatusBadge'

interface PeriodTaskCardProps {
  task: PeriodTask
  onStatusChange: (id: string, status: PeriodTask['status']) => void
  onEdit: (task: PeriodTask) => void
  onDelete: (id: string) => void
  onMove: (task: PeriodTask) => void
}

export function PeriodTaskCard({ task, onStatusChange, onEdit, onDelete, onMove }: PeriodTaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <div className={`
      bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4
      ${TASK_TYPE_BORDER_COLORS[task.type]}
      flex items-center gap-3 pl-3 pr-3 py-3.5
      transition-all duration-200
      ${isDone ? 'opacity-55' : ''}
    `}>
      <button
        onClick={() => onStatusChange(task.id, isDone ? 'in_progress' : 'done')}
        className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all flex items-center justify-center
          ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'}
        `}
      >
        {isDone && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm text-gray-800 leading-snug ${isDone ? 'line-through text-gray-400' : ''}`}>
          {task.body}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TASK_TYPE_DOT_COLORS[task.type]}`} />
          <span className="text-xs text-gray-400">{TASK_TYPE_LABELS[task.type]}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <StatusBadge
          status={task.status}
          size="sm"
          onClick={() => onStatusChange(task.id, nextStatus(task.status))}
        />
        <div className="flex items-center gap-0.5">
          <button onClick={() => onMove(task)} className="text-gray-300 hover:text-amber-500 transition-colors p-1" aria-label="Перенести" title="Перенести">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button onClick={() => onEdit(task)} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onDelete(task.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
