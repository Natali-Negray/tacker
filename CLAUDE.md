@AGENTS.md

# Task Tracker — Полное описание проекта

> Этот файл читается автоматически при каждой новой сессии Claude.
> Обновляй его при значимых изменениях в проекте.
> Последнее обновление: 2026-05-29

---

## 1. Обзор проекта

**Task Tracker** — персональный веб-трекер задач с поддержкой нескольких пользователей.
Каждый пользователь регистрируется, входит в аккаунт и видит только свои данные.

- **Живой сайт:** https://tacker-1cz3.onrender.com
- **GitHub:** https://github.com/Natali-Negray/tacker (ветка `main`)
- **Владелец:** Natali-Negray (Нина) — не разработчик, объяснения нужны простым языком
- **Версия:** v2.0 (с БД и авторизацией)
- **Локальный путь:** `C:\0-Рабочая\vib_cod\tacker`

---

## 2. Технический стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 16 (App Router), TypeScript |
| Стили | Tailwind CSS v4 |
| База данных | Neon PostgreSQL (us-east-1, free tier) |
| ORM | Drizzle ORM + @neondatabase/serverless |
| Авторизация | Кастомная: JWT (jose) + bcryptjs |
| Деплой | Render (free tier, Frankfurt, Node) |
| React | v19 |

**Важно для нового агента:** Это Next.js 16 — есть breaking changes.
Файл роут-защиты называется `proxy.ts` (не `middleware.ts`).
Перед написанием кода читай `node_modules/next/dist/docs/`.

---

## 3. Структура файлов

```
tacker/
├── app/
│   ├── actions/
│   │   └── auth.ts            # Server Actions: signup, login, logout
│   ├── api/
│   │   ├── day-tasks/
│   │   │   ├── route.ts       # GET (by date), POST (create)
│   │   │   └── [id]/route.ts  # PATCH (update), DELETE, POST (move)
│   │   ├── period-tasks/
│   │   │   ├── route.ts       # GET (by period), POST (create)
│   │   │   └── [id]/route.ts  # PATCH, DELETE, POST (move)
│   │   ├── notes/
│   │   │   └── route.ts       # GET, PUT (day notes + period notes)
│   │   ├── info-sources/
│   │   │   ├── route.ts       # GET, POST
│   │   │   └── [id]/route.ts  # DELETE
│   │   └── demo/
│   │       └── route.ts       # POST (load demo), DELETE (clear all)
│   ├── day/page.tsx           # Экран "Сегодня"
│   ├── plans/page.tsx         # Экран "Планы" (неделя/месяц)
│   ├── reflection/page.tsx    # Экран "Рефлексия"
│   ├── info/page.tsx          # Экран "Инфо" ⚠️ БАГ: использует localStorage
│   ├── login/page.tsx         # Страница входа
│   ├── register/page.tsx      # Страница регистрации
│   ├── layout.tsx             # Корневой layout + BottomNav
│   ├── page.tsx               # Redirect → /day
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── TaskCard.tsx       # Карточка задачи дня
│   │   ├── PeriodTaskCard.tsx # Карточка задачи недели/месяца
│   │   ├── StatusBadge.tsx    # Бейдж статуса (кликабельный)
│   │   ├── FAB.tsx            # Кнопка + (добавить задачу)
│   │   ├── BottomNav.tsx      # Нижняя навигация (4 вкладки)
│   │   ├── FilterBar.tsx      # Фильтр: все / не сделано / выполнено
│   │   ├── PeriodNav.tsx      # Навигация по датам/периодам
│   │   ├── ProgressBar.tsx    # Прогресс-бары по типам задач
│   │   └── Modal.tsx          # Базовый компонент модального окна
│   └── modals/
│       ├── DayTaskModal.tsx        # Создание/редактирование задачи дня
│       ├── PeriodTaskModal.tsx     # Создание/редактирование задачи недели/месяца
│       ├── MoveTaskModal.tsx       # Перенос задачи дня на другую дату
│       └── MovePeriodTaskModal.tsx # Перенос задачи на другую неделю/месяц
├── lib/
│   ├── types.ts       # TypeScript типы + цветовые карты
│   ├── schema.ts      # Drizzle schema (все таблицы БД)
│   ├── db.ts          # Подключение к Neon
│   ├── session.ts     # JWT: encrypt/decrypt/createSession/deleteSession
│   ├── dal.ts         # verifySession() — Data Access Layer
│   ├── api.ts         # Клиентские fetch-функции (замена localStorage)
│   ├── store.ts       # Утилиты дат + старый localStorage-код (устаревает)
│   └── demo.ts        # Старый loadDemoData/clearAllData (устаревает)
├── proxy.ts           # Защита роутов (Next.js 16: proxy, не middleware)
├── drizzle.config.ts  # Конфиг Drizzle Kit
├── render.yaml        # Конфиг деплоя Render
└── .env.local         # Локальные переменные (не в git)
```

---

## 4. База данных — схема таблиц

### `users`
| Колонка | Тип | Описание |
|---|---|---|
| id | UUID PK | Автогенерация |
| email | TEXT UNIQUE | Email пользователя |
| password_hash | TEXT | Хэш bcrypt (rounds=12) |
| created_at | TIMESTAMPTZ | Дата создания |

### `day_tasks`
| Колонка | Тип | Описание |
|---|---|---|
| id | TEXT PK | uid() — собственный генератор |
| user_id | UUID FK → users | Привязка к пользователю |
| body | TEXT | Текст задачи |
| time_type | TEXT | `'fixed'` или `'slot'` |
| time_value | TEXT | `'HH:MM'` или `'morning'`/`'afternoon'`/`'evening'` |
| status | TEXT | `'done'`/`'in_progress'`/`'postponed'`/`'moved'` |
| type | TEXT | `'personal'`/`'work'`/`'projects'`/`'learning'` |
| date | TEXT | Дата в формате `YYYY-MM-DD` |
| moved_from | TEXT | Дата откуда перенесена (если перенесена) |
| moved_to | TEXT | Дата куда перенесена |
| created_at | BIGINT | `Date.now()` в мс |

### `period_tasks`
| Колонка | Тип | Описание |
|---|---|---|
| id | TEXT PK | uid() |
| user_id | UUID FK → users | — |
| body | TEXT | Текст задачи |
| type | TEXT | Тип (как у day_tasks) |
| status | TEXT | Статус (как у day_tasks) |
| period | TEXT | `'YYYY-Www'` (неделя) или `'YYYY-MM'` (месяц) |
| period_type | TEXT | `'week'` или `'month'` |
| created_at | BIGINT | — |

> Задачи недели и месяца хранятся в **одной таблице**, различаются по полю `period_type`.

### `daily_notes`
| Колонка | Тип | Описание |
|---|---|---|
| user_id | UUID FK | — |
| date | TEXT | `YYYY-MM-DD` |
| note | TEXT DEFAULT '' | Текст заметки |
| PK | (user_id, date) | Составной ключ |

### `period_notes`
| Колонка | Тип | Описание |
|---|---|---|
| user_id | UUID FK | — |
| period | TEXT | `YYYY-Www` или `YYYY-MM` |
| note | TEXT DEFAULT '' | — |
| PK | (user_id, period) | — |

### `info_sources`
| Колонка | Тип | Описание |
|---|---|---|
| id | TEXT PK | uid() |
| user_id | UUID FK | — |
| name | TEXT | Название источника |
| url | TEXT DEFAULT '' | Ссылка (необязательна) |
| created_at | BIGINT | — |

---

## 5. Авторизация

**Механизм:** stateless JWT в httpOnly cookie.

**Поток регистрации:**
1. Пользователь заполняет форму на `/register`
2. Server Action `signup()` — валидация через Zod, проверка дубля email
3. Хэширование пароля bcrypt (rounds=12)
4. INSERT в таблицу `users`
5. Создание JWT-сессии: `createSession(userId)` → cookie `session` (httpOnly, secure, 7 дней)
6. Redirect → `/day`

**Поток входа:**
1. `/login` → Server Action `login()`
2. Поиск пользователя по email
3. `bcrypt.compare(password, hash)`
4. Если ок → `createSession(userId)` → redirect `/day`
5. Если нет → возврат ошибки "Неверный email или пароль"

**Поток выхода:**
1. Кнопка "Выйти" на экране Рефлексии — форма с action `logout`
2. Server Action `logout()` → `deleteSession()` (удаляет cookie) → redirect `/login`

**Защита роутов (`proxy.ts`):**
- Публичные: `/login`, `/register`
- Защищённые: всё остальное
- Незалогиненный → redirect `/login`
- Залогиненный на `/login` или `/register` → redirect `/day`

---

## 6. API endpoints

Все endpoints требуют авторизации (cookie `session`). Возвращают JSON.

### Day Tasks
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/day-tasks?date=YYYY-MM-DD` | Список задач за день |
| POST | `/api/day-tasks` | Создать задачу |
| PATCH | `/api/day-tasks/:id` | Обновить поля задачи |
| DELETE | `/api/day-tasks/:id` | Удалить задачу |
| POST | `/api/day-tasks/:id` | Перенести задачу на другую дату |

### Period Tasks
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/period-tasks?period=2026-W22` | Задачи за период |
| POST | `/api/period-tasks` | Создать задачу периода |
| PATCH | `/api/period-tasks/:id` | Обновить |
| DELETE | `/api/period-tasks/:id` | Удалить |
| POST | `/api/period-tasks/:id` | Перенести в другой период |

### Notes
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/notes?type=day&key=YYYY-MM-DD` | Получить заметку за день |
| GET | `/api/notes?type=period&key=2026-W22` | Получить заметку за период |
| PUT | `/api/notes` body: `{type, key, note}` | Сохранить/обновить заметку |

### Info Sources
| Метод | URL | Описание |
|---|---|---|
| GET | `/api/info-sources` | Список источников |
| POST | `/api/info-sources` | Добавить источник |
| DELETE | `/api/info-sources/:id` | Удалить источник |

### Demo / Clear
| Метод | URL | Описание |
|---|---|---|
| POST | `/api/demo` | Загрузить демо-данные для текущего пользователя |
| DELETE | `/api/demo` | Удалить все данные текущего пользователя |

---

## 7. Экраны — детальное описание

### `/day` — Сегодня

**Элементы:**
- Навигация по дням: `‹ пт, 29 мая ›` + иконка календаря (нативный `showPicker()`)
- Кнопка "Сегодня" — возврат к текущей дате
- Мотиватор утро: блок `bg-amber-50`, всегда виден
- Фильтр: Все / Не сделано / Выполнено
- Список задач с секциями УТРО / ДЕНЬ / ВЕЧЕР
- Прогресс-блок: % выполнения + прогресс-бары по 4 типам
- Мотиватор вечер: блок `bg-indigo-50`, виден только после 18:00
- "Ценное за день": textarea, сохраняется при каждом изменении через PUT /api/notes
- FAB кнопка +

**Сортировка по секциям:**
- УТРО: fixed 04:00–11:59 + slot=morning
- ДЕНЬ: fixed 12:00–16:59 + slot=afternoon
- ВЕЧЕР: fixed 17:00–03:59 + slot=evening
- Время 00:00–03:59 нормализуется как +1440 мин (считается вечером)
- Slot-задачи идут в конец своей секции (+9000 в sortOrder)

**Действия с задачей:**
- Клик статус-бейдж → цикл: in_progress → done → postponed → in_progress
- Кнопка 🗓 → MoveTaskModal → перенести на другую дату
- Кнопка карандаш → редактировать
- Кнопка корзина → удалить
- После переноса: оригинал получает статус `moved`, на целевой дате создаётся копия со slot=morning

---

### `/plans` — Планы

**Элементы:**
- Переключатель Неделя / Месяц
- Навигация по периодам
- Кнопка "Эта неделя" / "Этот месяц"
- Фильтр
- Список задач (без секций, без времени)
- Прогресс-блок
- "Ценное за неделю/месяц": textarea

**Форматы периодов:**
- Неделя: `2026-W22` (расчёт через `getWeekKey()` в `lib/store.ts`)
- Месяц: `2026-05`

**Перенос:** список 8 ближайших недель или 10 ближайших месяцев.

---

### `/reflection` — Рефлексия

**Элементы:**
- "Загрузить демо-данные" → POST `/api/demo` → redirect /day
- 4 карточки будущих функций (только описание)
- "Очистить все данные" → DELETE `/api/demo` + confirm
- "Выйти из аккаунта" → Server Action `logout`

---

### `/info` — Инфо

**Элементы:**
- Список источников информации
- "+ Источник" → модальное окно (Название + URL)
- "Обновить ленту" → имитация загрузки 1.2 сек → stub-посты
- Саммари (stub-текст)

**⚠️ ИЗВЕСТНЫЙ БАГ:** использует `localStorage` (`lib/store`) вместо API.

---

### `/login` и `/register`

- Поля: email + пароль (мин. 6 символов)
- Валидация на сервере через Zod
- Ошибки отображаются под полями и в блоке над формой
- Ссылки для переключения между страницами

**⚠️ БАГ UX:** BottomNav отображается на /login и /register (не должна).

---

## 8. UI/UX — договорённости

### Цвета типов задач
| Тип | Метка | Полоска слева | Точка | Прогресс-бар |
|---|---|---|---|---|
| personal | Личное | `border-l-violet-400` | `bg-violet-400` | `bg-violet-400` |
| work | Работа | `border-l-blue-400` | `bg-blue-400` | `bg-blue-400` |
| projects | Проекты | `border-l-amber-400` | `bg-amber-400` | `bg-amber-400` |
| learning | Обучение | `border-l-emerald-400` | `bg-emerald-400` | `bg-emerald-400` |

### Цвета статусов
| Статус | Метка | Цвет бейджа |
|---|---|---|
| in_progress | В процессе | `bg-blue-100 text-blue-700` |
| done | Сделано | `bg-emerald-100 text-emerald-700` |
| postponed | Отложено | `bg-gray-100 text-gray-500` |
| moved | Перенесено | `bg-orange-100 text-orange-600` |

### Прочие правила
- Primary button: `bg-slate-600` (не slate-800)
- FAB: `bg-slate-800 rounded-2xl`, выровнен внутри `max-w-2xl mx-auto`
- Макс. ширина контента: `max-w-2xl mx-auto px-4`
- Padding снизу страниц: `pb-28`
- Тип задачи в карточке: точка + мелкий текст (не пилюля)
- Статус: кнопка справа; тип: пассивный индикатор слева

---

## 9. Переменные окружения

| Переменная | Описание |
|---|---|
| `DATABASE_URL` | Строка подключения Neon PostgreSQL (pooled) |
| `SESSION_SECRET` | Секрет JWT (base64, 32 байта) |

- Render: добавлены в Environment Variables
- Локально: `.env.local` (не в git, в `.gitignore` по маске `.env*`)

---

## 10. Деплой

- **Платформа:** Render, free tier, Frankfurt
- **Авто-деплой:** push в `main` на GitHub
- **Локальная ветка:** `master` → `git push origin master:main`
- **Build:** `npm install && npm run build`
- **Start:** `npm start`
- **Конфиг:** `render.yaml`

---

## 11. Команды разработки

```bash
npm run dev          # Dev-сервер → localhost:3000
npx tsc --noEmit     # Проверка TypeScript
npx drizzle-kit push # Применить схему к Neon
npm run build        # Продакшн-сборка
git push origin master:main  # Деплой на Render
```

---

## 12. Известные баги

| # | Файл | Описание | Приоритет |
|---|---|---|---|
| 1 | `app/info/page.tsx` | Использует localStorage вместо API (getInfoSources из lib/store) | Высокий |
| 2 | `app/layout.tsx` | BottomNav видна на /login и /register | Средний |
| 3 | `app/day/page.tsx` | Нет debounce — каждый символ в "Ценное за день" = API запрос | Средний |
| 4 | `app/plans/page.tsx` | То же — нет debounce на заметку периода | Средний |
| 5 | `lib/demo.ts` | Старый файл с localStorage-логикой, не удалён | Низкий |

---

## 13. Планируемые функции (v3+)

| Функция | Описание |
|---|---|
| Аналитика | Графики выполнения по дням/неделям/месяцам |
| Саммари ценного | ИИ-дайджест из заметок |
| Свободные заметки | Блокнот без привязки к дате |
| Публикация итогов | Экспорт в Telegram или буфер обмена |
| Профиль | Смена email и пароля |
| Реальная лента | Парсинг RSS или внешние API |
