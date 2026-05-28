import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { dayTasks, periodTasks, dailyNotes, periodNotes, infoSources } from '@/lib/schema'
import { verifySession } from '@/lib/dal'
import { eq } from 'drizzle-orm'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function getWeekKey(dateStr: string) {
  const d = new Date(dateStr)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function getMonthKey(dateStr: string) {
  return dateStr.slice(0, 7)
}

// POST /api/demo — loads demo data for current user
export async function POST() {
  const { userId } = await verifySession()

  const today = todayStr()
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  const weekKey = getWeekKey(today)
  const monthKey = getMonthKey(today)
  const now = Date.now()

  // Clear existing data
  await db.delete(dayTasks).where(eq(dayTasks.userId, userId))
  await db.delete(periodTasks).where(eq(periodTasks.userId, userId))
  await db.delete(dailyNotes).where(eq(dailyNotes.userId, userId))
  await db.delete(periodNotes).where(eq(periodNotes.userId, userId))
  await db.delete(infoSources).where(eq(infoSources.userId, userId))

  // Day tasks
  await db.insert(dayTasks).values([
    { id: uid(), userId, body: 'Стендап с командой', timeType: 'fixed', timeValue: '10:00', status: 'done', type: 'work', date: today, createdAt: now },
    { id: uid(), userId, body: 'Утренняя пробежка 30 минут', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'personal', date: today, createdAt: now },
    { id: uid(), userId, body: 'Разобрать входящие письма и задачи', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'work', date: today, createdAt: now },
    { id: uid(), userId, body: 'Написать техническое ТЗ на новый модуль', timeType: 'fixed', timeValue: '13:00', status: 'in_progress', type: 'projects', date: today, createdAt: now },
    { id: uid(), userId, body: 'Прочитать главу из "Thinking, Fast and Slow"', timeType: 'slot', timeValue: 'afternoon', status: 'in_progress', type: 'learning', date: today, createdAt: now },
    { id: uid(), userId, body: 'Позвонить клиенту по вопросу договора', timeType: 'fixed', timeValue: '15:30', status: 'postponed', type: 'work', date: today, createdAt: now },
    { id: uid(), userId, body: 'Спланировать задачи на завтра', timeType: 'slot', timeValue: 'evening', status: 'in_progress', type: 'personal', date: today, createdAt: now },
    { id: uid(), userId, body: 'Ревью кода — PR #58', timeType: 'fixed', timeValue: '17:00', status: 'in_progress', type: 'work', date: today, createdAt: now },
    { id: uid(), userId, body: 'Подготовить презентацию для инвестора', timeType: 'fixed', timeValue: '11:00', status: 'done', type: 'projects', date: yesterday, createdAt: now },
    { id: uid(), userId, body: 'Медитация 15 минут', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'personal', date: yesterday, createdAt: now },
    { id: uid(), userId, body: 'Пройти модуль по TypeScript на курсе', timeType: 'slot', timeValue: 'afternoon', status: 'done', type: 'learning', date: yesterday, createdAt: now },
    { id: uid(), userId, body: 'Написать недельный отчёт', timeType: 'slot', timeValue: 'evening', status: 'done', type: 'work', date: yesterday, createdAt: now },
    { id: uid(), userId, body: 'Встреча с дизайнером по новому проекту', timeType: 'fixed', timeValue: '11:30', status: 'in_progress', type: 'projects', date: tomorrow, createdAt: now },
    { id: uid(), userId, body: 'Записаться к врачу', timeType: 'slot', timeValue: 'morning', status: 'in_progress', type: 'personal', date: tomorrow, createdAt: now },
    { id: uid(), userId, body: 'Изучить новый инструмент для аналитики', timeType: 'slot', timeValue: 'afternoon', status: 'in_progress', type: 'learning', date: tomorrow, createdAt: now },
  ])

  // Period tasks
  await db.insert(periodTasks).values([
    { id: uid(), userId, body: 'Завершить MVP таск-трекера и задеплоить', type: 'projects', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: now },
    { id: uid(), userId, body: 'Провести 1-on-1 с каждым членом команды', type: 'work', status: 'done', period: weekKey, periodType: 'week', createdAt: now },
    { id: uid(), userId, body: 'Закрыть 3 модуля онлайн-курса по TypeScript', type: 'learning', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: now },
    { id: uid(), userId, body: 'Сходить на тренировку минимум 3 раза', type: 'personal', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: now },
    { id: uid(), userId, body: 'Подготовить коммерческое предложение', type: 'work', status: 'postponed', period: weekKey, periodType: 'week', createdAt: now },
    { id: uid(), userId, body: 'Запустить публичную бету продукта', type: 'projects', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: now },
    { id: uid(), userId, body: 'Пройти курс Advanced TypeScript полностью', type: 'learning', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: now },
    { id: uid(), userId, body: 'Увеличить выручку на 15%', type: 'work', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: now },
    { id: uid(), userId, body: 'Наладить режим: подъём в 7:00, спорт через день', type: 'personal', status: 'done', period: monthKey, periodType: 'month', createdAt: now },
    { id: uid(), userId, body: 'Написать 4 статьи для блога компании', type: 'projects', status: 'postponed', period: monthKey, periodType: 'month', createdAt: now },
  ])

  // Notes
  await db.insert(dailyNotes).values([
    { userId, date: today, note: 'Сегодня впервые задеплоила собственный продукт — это реально круто. Чувствую маленький, но важный шаг вперёд.' },
    { userId, date: yesterday, note: 'Презентация прошла лучше, чем ожидала. Инвесторы задали хорошие вопросы — значит тема цепляет.' },
  ])

  await db.insert(periodNotes).values([
    { userId, period: weekKey, note: 'Продуктивная неделя. Главное достижение — запустили трекер в продакшн.' },
    { userId, period: monthKey, note: 'Май стал месяцем запуска. Страшно и интересно одновременно. Главный урок: не ждать идеального момента.' },
  ])

  // Info sources
  await db.insert(infoSources).values([
    { id: uid(), userId, name: 'Product Hunt', url: 'https://producthunt.com', createdAt: now },
    { id: uid(), userId, name: 'TechCrunch', url: 'https://techcrunch.com', createdAt: now },
    { id: uid(), userId, name: 'Habr', url: 'https://habr.com', createdAt: now },
  ])

  return NextResponse.json({ ok: true })
}

// DELETE /api/demo — clears all user data
export async function DELETE() {
  const { userId } = await verifySession()

  await db.delete(dayTasks).where(eq(dayTasks.userId, userId))
  await db.delete(periodTasks).where(eq(periodTasks.userId, userId))
  await db.delete(dailyNotes).where(eq(dailyNotes.userId, userId))
  await db.delete(periodNotes).where(eq(periodNotes.userId, userId))
  await db.delete(infoSources).where(eq(infoSources.userId, userId))

  return NextResponse.json({ ok: true })
}
