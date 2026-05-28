export type TaskStatus = 'done' | 'in_progress' | 'postponed' | 'moved'
export type TaskType = 'personal' | 'work' | 'projects' | 'learning'
export type TimeSlot = 'morning' | 'afternoon' | 'evening'
export type TimeType = 'fixed' | 'slot'
export type PeriodType = 'week' | 'month'
export type FilterType = 'all' | 'undone' | 'done'

export interface DayTask {
  id: string
  body: string
  timeType: TimeType
  timeValue: string // HH:MM or TimeSlot
  status: TaskStatus
  type: TaskType
  date: string // YYYY-MM-DD
  movedFrom?: string
  movedTo?: string
  createdAt: number
}

export interface PeriodTask {
  id: string
  body: string
  type: TaskType
  status: TaskStatus
  period: string // '2026-W22' or '2026-05'
  periodType: PeriodType
  createdAt: number
}

export interface DailyNote {
  date: string
  text: string
}

export interface InfoSource {
  id: string
  name: string
  url: string
  createdAt: number
}

export interface StubPost {
  id: string
  sourceId: string
  sourceName: string
  text: string
  date: string
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  personal: 'Личное',
  work: 'Работа',
  projects: 'Проекты',
  learning: 'Обучение',
}

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  personal: 'bg-violet-100 text-violet-700',
  work: 'bg-blue-100 text-blue-700',
  projects: 'bg-amber-100 text-amber-700',
  learning: 'bg-emerald-100 text-emerald-700',
}

export const TASK_TYPE_BORDER_COLORS: Record<TaskType, string> = {
  personal: 'border-l-violet-400',
  work: 'border-l-blue-400',
  projects: 'border-l-amber-400',
  learning: 'border-l-emerald-400',
}

export const TASK_TYPE_DOT_COLORS: Record<TaskType, string> = {
  personal: 'bg-violet-400',
  work: 'bg-blue-400',
  projects: 'bg-amber-400',
  learning: 'bg-emerald-400',
}

export const TASK_TYPE_BAR_COLORS: Record<TaskType, string> = {
  personal: 'bg-violet-400',
  work: 'bg-blue-400',
  projects: 'bg-amber-400',
  learning: 'bg-emerald-400',
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  done: 'Сделано',
  in_progress: 'В процессе',
  postponed: 'Отложено',
  moved: 'Перенесено',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  done: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-blue-100 text-blue-700',
  postponed: 'bg-gray-100 text-gray-500',
  moved: 'bg-orange-100 text-orange-600',
}

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: 'Утро',
  afternoon: 'День',
  evening: 'Вечер',
}

export const TASK_TYPES: TaskType[] = ['personal', 'work', 'projects', 'learning']
