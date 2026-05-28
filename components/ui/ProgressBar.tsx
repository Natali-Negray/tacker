'use client'

import { TaskType, TASK_TYPE_LABELS, TASK_TYPE_BAR_COLORS } from '@/lib/types'

interface ProgressBarProps {
  done: number
  total: number
  color?: string
  label?: string
  size?: 'sm' | 'md'
}

export function ProgressBar({ done, total, color = 'bg-slate-700', label, size = 'md' }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">{label}</span>
          <span className="text-xs font-medium text-gray-600">{done}/{total}</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {!label && (
        <div className="text-right mt-0.5">
          <span className="text-xs text-gray-400">{pct}%</span>
        </div>
      )}
    </div>
  )
}

interface TypeProgressBlockProps {
  stats: { type: TaskType; done: number; total: number }[]
  totalDone: number
  totalCount: number
}

export function TypeProgressBlock({ stats, totalDone, totalCount }: TypeProgressBlockProps) {
  if (totalCount === 0) return null
  const totalPct = totalCount === 0 ? 0 : Math.round((totalDone / totalCount) * 100)

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">Прогресс</span>
        <span className="text-sm font-bold text-gray-800">{totalPct}%</span>
      </div>

      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
        {stats.map(s => (
          s.done > 0 && (
            <div
              key={s.type}
              className={`h-full transition-all duration-500 ${TASK_TYPE_BAR_COLORS[s.type]}`}
              style={{ width: `${(s.done / totalCount) * 100}%` }}
            />
          )
        ))}
      </div>

      <div className="space-y-2">
        {stats.map(s => (
          <ProgressBar
            key={s.type}
            done={s.done}
            total={s.total}
            color={TASK_TYPE_BAR_COLORS[s.type]}
            label={TASK_TYPE_LABELS[s.type]}
            size="sm"
          />
        ))}
      </div>
    </div>
  )
}
