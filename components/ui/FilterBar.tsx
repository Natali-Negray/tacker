'use client'

import { FilterType } from '@/lib/types'

interface FilterBarProps {
  value: FilterType
  onChange: (v: FilterType) => void
}

const OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'undone', label: 'Не сделано' },
  { value: 'done', label: 'Выполнено' },
]

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            flex-1 text-xs font-medium py-1.5 rounded-lg transition-all duration-200
            ${value === opt.value
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
