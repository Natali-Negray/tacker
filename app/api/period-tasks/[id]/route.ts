import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { periodTasks } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// PATCH /api/period-tasks/[id]
export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/period-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params
  const patch = await req.json()

  const allowed = ['body', 'type', 'status', 'period', 'periodType'] as const
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (key in patch) update[key] = patch[key]
  }

  await db.update(periodTasks)
    .set(update)
    .where(and(eq(periodTasks.id, id), eq(periodTasks.userId, userId)))

  return NextResponse.json({ ok: true })
}

// DELETE /api/period-tasks/[id]
export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/period-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params

  await db.delete(periodTasks).where(and(eq(periodTasks.id, id), eq(periodTasks.userId, userId)))
  return NextResponse.json({ ok: true })
}

// POST /api/period-tasks/[id]  — move task to another period
export async function POST(req: NextRequest, ctx: RouteContext<'/api/period-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params
  const { targetPeriod, taskData } = await req.json()

  // Mark original as moved
  await db.update(periodTasks)
    .set({ status: 'moved' })
    .where(and(eq(periodTasks.id, id), eq(periodTasks.userId, userId)))

  // Create copy in target period
  const newId = uid()
  const newPeriodType = targetPeriod.includes('-W') ? 'week' : 'month'
  await db.insert(periodTasks).values({
    id: newId,
    userId,
    body: taskData.body,
    type: taskData.type,
    status: 'in_progress',
    period: targetPeriod,
    periodType: newPeriodType,
    createdAt: Date.now(),
  })

  return NextResponse.json({ newId })
}
