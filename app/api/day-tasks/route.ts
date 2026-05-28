import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { dayTasks } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// GET /api/day-tasks?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const { userId } = await verifySession()
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const rows = await db.select().from(dayTasks).where(
    and(eq(dayTasks.userId, userId), eq(dayTasks.date, date))
  )
  return NextResponse.json(rows.map(dbToTask))
}

// POST /api/day-tasks
export async function POST(req: NextRequest) {
  const { userId } = await verifySession()
  const body = await req.json()

  const id = uid()
  const now = Date.now()
  await db.insert(dayTasks).values({
    id,
    userId,
    body: body.body,
    timeType: body.timeType,
    timeValue: body.timeValue,
    status: body.status ?? 'in_progress',
    type: body.type,
    date: body.date,
    movedFrom: body.movedFrom ?? null,
    movedTo: body.movedTo ?? null,
    createdAt: now,
  })

  return NextResponse.json({ id, createdAt: now })
}

function dbToTask(r: typeof dayTasks.$inferSelect) {
  return {
    id: r.id,
    body: r.body,
    timeType: r.timeType,
    timeValue: r.timeValue,
    status: r.status,
    type: r.type,
    date: r.date,
    movedFrom: r.movedFrom ?? undefined,
    movedTo: r.movedTo ?? undefined,
    createdAt: r.createdAt,
  }
}
