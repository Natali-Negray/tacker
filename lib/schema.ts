import { pgTable, text, bigint, primaryKey, uuid, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const dayTasks = pgTable('day_tasks', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  timeType: text('time_type').notNull(),
  timeValue: text('time_value').notNull(),
  status: text('status').notNull().default('in_progress'),
  type: text('type').notNull(),
  date: text('date').notNull(),
  movedFrom: text('moved_from'),
  movedTo: text('moved_to'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
})

export const periodTasks = pgTable('period_tasks', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  body: text('body').notNull(),
  type: text('type').notNull(),
  status: text('status').notNull().default('in_progress'),
  period: text('period').notNull(),
  periodType: text('period_type').notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
})

export const dailyNotes = pgTable('daily_notes', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  note: text('note').notNull().default(''),
}, (t) => [primaryKey({ columns: [t.userId, t.date] })])

export const periodNotes = pgTable('period_notes', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  period: text('period').notNull(),
  note: text('note').notNull().default(''),
}, (t) => [primaryKey({ columns: [t.userId, t.period] })])

export const infoSources = pgTable('info_sources', {
  id: text('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  url: text('url').notNull().default(''),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
})
