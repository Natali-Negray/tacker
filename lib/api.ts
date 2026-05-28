import { DayTask, PeriodTask } from './types'

// ── Day tasks ────────────────────────────────────────────────────────────────

export async function getDayTasks(date: string): Promise<DayTask[]> {
  const res = await fetch(`/api/day-tasks?date=${date}`)
  if (!res.ok) return []
  return res.json()
}

export async function saveDayTask(task: Omit<DayTask, 'id' | 'createdAt'>): Promise<DayTask> {
  const res = await fetch('/api/day-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  const { id, createdAt } = await res.json()
  return { ...task, id, createdAt }
}

export async function updateDayTask(
  _date: string,
  id: string,
  patch: Partial<DayTask>
): Promise<void> {
  await fetch(`/api/day-tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}

export async function deleteDayTask(_date: string, id: string): Promise<void> {
  await fetch(`/api/day-tasks/${id}`, { method: 'DELETE' })
}

export async function moveTask(task: DayTask, targetDate: string): Promise<void> {
  await fetch(`/api/day-tasks/${task.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetDate, taskData: task }),
  })
}

// ── Period tasks ─────────────────────────────────────────────────────────────

export async function getPeriodTasks(period: string): Promise<PeriodTask[]> {
  const res = await fetch(`/api/period-tasks?period=${period}`)
  if (!res.ok) return []
  return res.json()
}

export async function savePeriodTask(task: Omit<PeriodTask, 'id' | 'createdAt'>): Promise<PeriodTask> {
  const res = await fetch('/api/period-tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  const { id, createdAt } = await res.json()
  return { ...task, id, createdAt }
}

export async function updatePeriodTask(
  _period: string,
  id: string,
  patch: Partial<PeriodTask>
): Promise<void> {
  await fetch(`/api/period-tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
}

export async function deletePeriodTask(_period: string, id: string): Promise<void> {
  await fetch(`/api/period-tasks/${id}`, { method: 'DELETE' })
}

export async function movePeriodTask(task: PeriodTask, targetPeriod: string): Promise<void> {
  await fetch(`/api/period-tasks/${task.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetPeriod, taskData: task }),
  })
}

// ── Notes ────────────────────────────────────────────────────────────────────

export async function getDailyNote(date: string): Promise<string> {
  const res = await fetch(`/api/notes?type=day&key=${date}`)
  if (!res.ok) return ''
  const data = await res.json()
  return data.note ?? ''
}

export async function saveDailyNote(date: string, text: string): Promise<void> {
  await fetch('/api/notes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'day', key: date, note: text }),
  })
}

export async function getPeriodNote(period: string): Promise<string> {
  const res = await fetch(`/api/notes?type=period&key=${period}`)
  if (!res.ok) return ''
  const data = await res.json()
  return data.note ?? ''
}

export async function savePeriodNote(period: string, text: string): Promise<void> {
  await fetch('/api/notes', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'period', key: period, note: text }),
  })
}

// ── Demo / clear ─────────────────────────────────────────────────────────────

export async function loadDemoData(): Promise<void> {
  await fetch('/api/demo', { method: 'POST' })
}

export async function clearAllData(): Promise<void> {
  await fetch('/api/demo', { method: 'DELETE' })
}
