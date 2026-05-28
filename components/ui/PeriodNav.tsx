'use client'

import { useRef } from 'react'

interface PeriodNavProps {
  label: string
  isToday?: boolean
  todayLabel?: string
  onPrev: () => void
  onNext: () => void
  onToday?: () => void
  currentDate?: string
  onDateChange?: (date: string) => void
}

export function PeriodNav({
  label, isToday, todayLabel = 'Сегодня',
  onPrev, onNext, onToday,
  currentDate, onDateChange,
}: PeriodNavProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleLabelClick = () => {
    if (!onDateChange || !inputRef.current) return
    try {
      inputRef.current.showPicker()
    } catch {
      inputRef.current.focus()
    }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={onPrev}
        className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold flex-shrink-0"
      >
        ‹
      </button>

      <div className="flex-1 flex flex-col items-center gap-0.5">
        {onDateChange ? (
          <button
            onClick={handleLabelClick}
            className="flex items-center gap-1.5 group"
          >
            <span className="text-sm font-semibold text-gray-700 group-hover:text-slate-900 transition-colors">
              {label}
            </span>
            <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              ref={inputRef}
              type="date"
              value={currentDate ?? ''}
              onChange={e => e.target.value && onDateChange(e.target.value)}
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              tabIndex={-1}
            />
          </button>
        ) : (
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        )}

        {isToday && (
          <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full leading-none">
            {todayLabel}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {onToday && !isToday && (
          <button
            onClick={onToday}
            className="text-xs text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {todayLabel}
          </button>
        )}
        <button
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold"
        >
          ›
        </button>
      </div>
    </div>
  )
}
