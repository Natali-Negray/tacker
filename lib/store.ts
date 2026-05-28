import { DayTask, PeriodTask, DailyNote, InfoSource, TaskStatus, TaskType } from './types'

const KEYS = {
  dayTasks: 'tt_day_tasks',
  periodTasks: 'tt_period_tasks',
  dailyNotes: 'tt_daily_notes',
  infoSources: 'tt_info_sources',
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Day tasks keyed by date YYYY-MM-DD
export function getDayTasks(date: string): DayTask[] {
  const all = read<Record<string, DayTask[]>>(KEYS.dayTasks, {})
  return all[date] ?? []
}

export function saveDayTask(task: Omit<DayTask, 'id' | 'createdAt'>): DayTask {
  const all = read<Record<string, DayTask[]>>(KEYS.dayTasks, {})
  const newTask: DayTask = { ...task, id: uid(), createdAt: Date.now() }
  all[task.date] = [...(all[task.date] ?? []), newTask]
  write(KEYS.dayTasks, all)
  return newTask
}

export function updateDayTask(date: string, id: string, patch: Partial<DayTask>): void {
  const all = read<Record<string, DayTask[]>>(KEYS.dayTasks, {})
  all[date] = (all[date] ?? []).map(t => t.id === id ? { ...t, ...patch } : t)
  write(KEYS.dayTasks, all)
}

export function deleteDayTask(date: string, id: string): void {
  const all = read<Record<string, DayTask[]>>(KEYS.dayTasks, {})
  all[date] = (all[date] ?? []).filter(t => t.id !== id)
  write(KEYS.dayTasks, all)
}

export function moveTask(task: DayTask, targetDate: string): void {
  const all = read<Record<string, DayTask[]>>(KEYS.dayTasks, {})
  // mark original as moved
  all[task.date] = (all[task.date] ?? []).map(t =>
    t.id === task.id ? { ...t, status: 'moved' as TaskStatus, movedTo: targetDate } : t
  )
  // create copy on target date in morning slot
  const movedTask: DayTask = {
    ...task,
    id: uid(),
    date: targetDate,
    timeType: 'slot',
    timeValue: 'morning',
    status: 'in_progress' as TaskStatus,
    movedFrom: task.date,
    movedTo: undefined,
    createdAt: Date.now(),
  }
  all[targetDate] = [...(all[targetDate] ?? []), movedTask]
  write(KEYS.dayTasks, all)
}

// Period tasks
export function getPeriodTasks(period: string): PeriodTask[] {
  const all = read<Record<string, PeriodTask[]>>(KEYS.periodTasks, {})
  return all[period] ?? []
}

export function savePeriodTask(task: Omit<PeriodTask, 'id' | 'createdAt'>): PeriodTask {
  const all = read<Record<string, PeriodTask[]>>(KEYS.periodTasks, {})
  const newTask: PeriodTask = { ...task, id: uid(), createdAt: Date.now() }
  all[task.period] = [...(all[task.period] ?? []), newTask]
  write(KEYS.periodTasks, all)
  return newTask
}

export function updatePeriodTask(period: string, id: string, patch: Partial<PeriodTask>): void {
  const all = read<Record<string, PeriodTask[]>>(KEYS.periodTasks, {})
  all[period] = (all[period] ?? []).map(t => t.id === id ? { ...t, ...patch } : t)
  write(KEYS.periodTasks, all)
}

export function deletePeriodTask(period: string, id: string): void {
  const all = read<Record<string, PeriodTask[]>>(KEYS.periodTasks, {})
  all[period] = (all[period] ?? []).filter(t => t.id !== id)
  write(KEYS.periodTasks, all)
}

export function movePeriodTask(task: PeriodTask, targetPeriod: string): void {
  const all = read<Record<string, PeriodTask[]>>(KEYS.periodTasks, {})
  all[task.period] = (all[task.period] ?? []).map(t =>
    t.id === task.id ? { ...t, status: 'moved' as TaskStatus } : t
  )
  const movedTask: PeriodTask = {
    ...task,
    id: uid(),
    period: targetPeriod,
    periodType: targetPeriod.includes('-W') ? 'week' : 'month',
    status: 'in_progress' as TaskStatus,
    createdAt: Date.now(),
  }
  all[targetPeriod] = [...(all[targetPeriod] ?? []), movedTask]
  write(KEYS.periodTasks, all)
}

// Period notes (week/month)
export function getPeriodNote(period: string): string {
  const all = read<Record<string, string>>('tt_period_notes', {})
  return all[period] ?? ''
}

export function savePeriodNote(period: string, text: string): void {
  const all = read<Record<string, string>>('tt_period_notes', {})
  all[period] = text
  write('tt_period_notes', all)
}

// Daily notes
export function getDailyNote(date: string): string {
  const all = read<Record<string, string>>(KEYS.dailyNotes, {})
  return all[date] ?? ''
}

export function saveDailyNote(date: string, text: string): void {
  const all = read<Record<string, string>>(KEYS.dailyNotes, {})
  all[date] = text
  write(KEYS.dailyNotes, all)
}

// Info sources
export function getInfoSources(): InfoSource[] {
  return read<InfoSource[]>(KEYS.infoSources, [])
}

export function saveInfoSource(source: Omit<InfoSource, 'id' | 'createdAt'>): InfoSource {
  const all = read<InfoSource[]>(KEYS.infoSources, [])
  const newSource: InfoSource = { ...source, id: uid(), createdAt: Date.now() }
  write(KEYS.infoSources, [...all, newSource])
  return newSource
}

export function deleteInfoSource(id: string): void {
  const all = read<InfoSource[]>(KEYS.infoSources, [])
  write(KEYS.infoSources, all.filter(s => s.id !== id))
}

// Date helpers
export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7)
}

export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })
}

export function formatWeekDisplay(weekKey: string): string {
  const [year, week] = weekKey.split('-W')
  const jan1 = new Date(Number(year), 0, 1)
  const weekStart = new Date(jan1.getTime() + (Number(week) - 1) * 7 * 86400000)
  const weekEnd = new Date(weekStart.getTime() + 6 * 86400000)
  const fmt = (d: Date) => d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  return `${fmt(weekStart)} — ${fmt(weekEnd)}`
}

export function formatMonthDisplay(monthKey: string): string {
  const [year, month] = monthKey.split('-')
  const d = new Date(Number(year), Number(month) - 1, 1)
  return d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
}

export function addWeeks(weekKey: string, n: number): string {
  const [year, week] = weekKey.split('-W')
  const jan1 = new Date(Number(year), 0, 1)
  const weekStart = new Date(jan1.getTime() + (Number(week) - 1) * 7 * 86400000)
  weekStart.setDate(weekStart.getDate() + n * 7)
  return getWeekKey(weekStart.toISOString().split('T')[0])
}

export function addMonths(monthKey: string, n: number): string {
  const [year, month] = monthKey.split('-')
  const d = new Date(Number(year), Number(month) - 1 + n, 1)
  return getMonthKey(d.toISOString().split('T')[0])
}

export function getUpcomingWeeks(fromWeek: string, count = 8): { value: string; label: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const w = addWeeks(fromWeek, i + 1)
    return { value: w, label: formatWeekDisplay(w) }
  })
}

export function getUpcomingMonths(fromMonth: string, count = 10): { value: string; label: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const m = addMonths(fromMonth, i + 1)
    return { value: m, label: formatMonthDisplay(m) }
  })
}

export function getTaskTypeStats(tasks: { status: TaskStatus; type: TaskType }[]) {
  const types = ['personal', 'work', 'projects', 'learning'] as TaskType[]
  return types.map(type => {
    const typeTasks = tasks.filter(t => t.type === type)
    const done = typeTasks.filter(t => t.status === 'done').length
    return { type, total: typeTasks.length, done }
  }).filter(s => s.total > 0)
}
