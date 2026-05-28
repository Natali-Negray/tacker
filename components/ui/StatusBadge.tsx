'use client'

import { TaskStatus, STATUS_LABELS, STATUS_COLORS } from '@/lib/types'

interface StatusBadgeProps {
  status: TaskStatus
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, onClick, size = 'md' }: StatusBadgeProps) {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full font-medium
        ${padding} ${STATUS_COLORS[status]}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'}
      `}
    >
      {STATUS_LABELS[status]}
    </button>
  )
}

// 'moved' removed from cycle — handled separately via move button
const STATUS_CYCLE: TaskStatus[] = ['in_progress', 'done', 'postponed']

export function nextStatus(current: TaskStatus): TaskStatus {
  const idx = STATUS_CYCLE.indexOf(current)
  if (idx === -1) return 'in_progress'
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
}
