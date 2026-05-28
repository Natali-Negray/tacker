import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { periodTasks } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// GET /api/period-tasks?period=2026-W22
export async function GET(req: NextRequest) {
  const { userId } = await verifySession()
  const period = req.nextUrl.searchParams.get('period')
  if (!period) return NextResponse.json({ error: 'period required' }, { status: 400 })

  const rows = await db.select().from(periodTasks).where(
    and(eq(periodTasks.userId, userId), eq(periodTasks.period, period))
  )
  return NextResponse.json(rows.map(dbToTask))
}

// POST /api/period-tasks
export async function POST(req: NextRequest) {
  const { userId } = await verifySession()
  const body = await req.json()

  const id = uid()
  const now = Date.now()
  await db.insert(periodTasks).values({
    id,
    userId,
    body: body.body,
    type: body.type,
    status: body.status ?? 'in_progress',
    period: body.period,
    periodType: body.periodType,
    createdAt: now,
  })

  return NextResponse.json({ id, createdAt: now })
}

function dbToTask(r: typeof periodTasks.$inferSelect) {
  return {
    id: r.id,
    body: r.body,
    type: r.type,
    status: r.status,
    period: r.period,
    periodType: r.periodType,
    createdAt: r.createdAt,
  }
}
