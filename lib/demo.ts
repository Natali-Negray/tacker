import { todayStr, addDays, getWeekKey, getMonthKey } from './store'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function loadDemoData(): void {
  const today = todayStr()
  const yesterday = addDays(today, -1)
  const tomorrow = addDays(today, 1)
  const weekKey = getWeekKey(today)
  const monthKey = getMonthKey(today)

  // ── День: сегодня ──────────────────────────────────────────
  const dayTasks: Record<string, object[]> = {
    [today]: [
      { id: uid(), body: 'Стендап с командой', timeType: 'fixed', timeValue: '10:00', status: 'done', type: 'work', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Утренняя пробежка 30 минут', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'personal', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Разобрать входящие письма и задачи', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'work', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Написать техническое ТЗ на новый модуль', timeType: 'fixed', timeValue: '13:00', status: 'in_progress', type: 'projects', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Прочитать главу из "Thinking, Fast and Slow"', timeType: 'slot', timeValue: 'afternoon', status: 'in_progress', type: 'learning', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Позвонить клиенту по вопросу договора', timeType: 'fixed', timeValue: '15:30', status: 'postponed', type: 'work', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Спланировать задачи на завтра', timeType: 'slot', timeValue: 'evening', status: 'in_progress', type: 'personal', date: today, createdAt: Date.now() },
      { id: uid(), body: 'Ревью кода — PR #58', timeType: 'fixed', timeValue: '17:00', status: 'in_progress', type: 'work', date: today, createdAt: Date.now() },
    ],
    // ── День: вчера ───────────────────────────────────────────
    [yesterday]: [
      { id: uid(), body: 'Подготовить презентацию для инвестора', timeType: 'fixed', timeValue: '11:00', status: 'done', type: 'projects', date: yesterday, createdAt: Date.now() },
      { id: uid(), body: 'Медитация 15 минут', timeType: 'slot', timeValue: 'morning', status: 'done', type: 'personal', date: yesterday, createdAt: Date.now() },
      { id: uid(), body: 'Пройти модуль по TypeScript на курсе', timeType: 'slot', timeValue: 'afternoon', status: 'done', type: 'learning', date: yesterday, createdAt: Date.now() },
      { id: uid(), body: 'Написать недельный отчёт', timeType: 'slot', timeValue: 'evening', status: 'done', type: 'work', date: yesterday, createdAt: Date.now() },
      { id: uid(), body: 'Созвон с подрядчиком', timeType: 'fixed', timeValue: '16:00', status: 'done', type: 'work', date: yesterday, createdAt: Date.now() },
    ],
    // ── День: завтра ──────────────────────────────────────────
    [tomorrow]: [
      { id: uid(), body: 'Встреча с дизайнером по новому проекту', timeType: 'fixed', timeValue: '11:30', status: 'in_progress', type: 'projects', date: tomorrow, createdAt: Date.now() },
      { id: uid(), body: 'Записаться к врачу', timeType: 'slot', timeValue: 'morning', status: 'in_progress', type: 'personal', date: tomorrow, createdAt: Date.now() },
      { id: uid(), body: 'Изучить новый инструмент для аналитики', timeType: 'slot', timeValue: 'afternoon', status: 'in_progress', type: 'learning', date: tomorrow, createdAt: Date.now() },
    ],
  }

  // ── Планы на неделю ───────────────────────────────────────
  const periodTasks: Record<string, object[]> = {
    [weekKey]: [
      { id: uid(), body: 'Завершить MVP таск-трекера и задеплоить', type: 'projects', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: Date.now() },
      { id: uid(), body: 'Провести 1-on-1 с каждым членом команды', type: 'work', status: 'done', period: weekKey, periodType: 'week', createdAt: Date.now() },
      { id: uid(), body: 'Закрыть 3 модуля онлайн-курса по TypeScript', type: 'learning', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: Date.now() },
      { id: uid(), body: 'Сходить на тренировку минимум 3 раза', type: 'personal', status: 'in_progress', period: weekKey, periodType: 'week', createdAt: Date.now() },
      { id: uid(), body: 'Подготовить коммерческое предложение для нового клиента', type: 'work', status: 'postponed', period: weekKey, periodType: 'week', createdAt: Date.now() },
    ],
    // ── Планы на месяц ────────────────────────────────────────
    [monthKey]: [
      { id: uid(), body: 'Запустить публичную бету продукта', type: 'projects', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: Date.now() },
      { id: uid(), body: 'Пройти курс Advanced TypeScript полностью', type: 'learning', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: Date.now() },
      { id: uid(), body: 'Увеличить выручку на 15% относительно прошлого месяца', type: 'work', status: 'in_progress', period: monthKey, periodType: 'month', createdAt: Date.now() },
      { id: uid(), body: 'Наладить режим: подъём в 7:00, спорт через день', type: 'personal', status: 'done', period: monthKey, periodType: 'month', createdAt: Date.now() },
      { id: uid(), body: 'Написать 4 статьи для блога компании', type: 'projects', status: 'postponed', period: monthKey, periodType: 'month', createdAt: Date.now() },
    ],
  }

  // ── Заметки ───────────────────────────────────────────────
  const dailyNotes: Record<string, string> = {
    [today]: 'Сегодня впервые задеплоила собственный продукт — это реально круто. Чувствую как маленький, но важный шаг вперёд. Нужно не забыть поблагодарить команду.',
    [yesterday]: 'Презентация прошла лучше, чем ожидала. Инвесторы задали хорошие вопросы — значит тема цепляет. Надо доработать финансовую модель.',
  }

  const periodNotes: Record<string, string> = {
    [weekKey]: 'Продуктивная неделя. Главное достижение — запустили трекер в продакшн. Чуть просела коммуникация с клиентами — в следующей неделе уделить этому больше внимания.',
    [monthKey]: 'Май стал месяцем запуска. Страшно и интересно одновременно. Главный урок: не ждать идеального момента — шипить и итерировать.',
  }

  const infoSources = [
    { id: uid(), name: 'Product Hunt', url: 'https://producthunt.com', createdAt: Date.now() },
    { id: uid(), name: 'TechCrunch', url: 'https://techcrunch.com', createdAt: Date.now() },
    { id: uid(), name: 'Habr', url: 'https://habr.com', createdAt: Date.now() },
  ]

  localStorage.setItem('tt_day_tasks', JSON.stringify(dayTasks))
  localStorage.setItem('tt_period_tasks', JSON.stringify(periodTasks))
  localStorage.setItem('tt_daily_notes', JSON.stringify(dailyNotes))
  localStorage.setItem('tt_period_notes', JSON.stringify(periodNotes))
  localStorage.setItem('tt_info_sources', JSON.stringify(infoSources))
}

export function clearAllData(): void {
  ['tt_day_tasks', 'tt_period_tasks', 'tt_daily_notes', 'tt_period_notes', 'tt_info_sources']
    .forEach(k => localStorage.removeItem(k))
}
