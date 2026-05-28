import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { dayTasks } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// PATCH /api/day-tasks/[id]  — update fields
export async function PATCH(req: NextRequest, ctx: RouteContext<'/api/day-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params
  const patch = await req.json()

  const allowed = ['body', 'timeType', 'timeValue', 'status', 'type', 'date', 'movedFrom', 'movedTo'] as const
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (key in patch) update[key] = patch[key]
  }

  await db.update(dayTasks)
    .set(update)
    .where(and(eq(dayTasks.id, id), eq(dayTasks.userId, userId)))

  return NextResponse.json({ ok: true })
}

// DELETE /api/day-tasks/[id]
export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/day-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params

  await db.delete(dayTasks).where(and(eq(dayTasks.id, id), eq(dayTasks.userId, userId)))
  return NextResponse.json({ ok: true })
}

// POST /api/day-tasks/[id]  — move task to another date
export async function POST(req: NextRequest, ctx: RouteContext<'/api/day-tasks/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params
  const { targetDate, taskData } = await req.json()

  // Mark original as moved
  await db.update(dayTasks)
    .set({ status: 'moved', movedTo: targetDate })
    .where(and(eq(dayTasks.id, id), eq(dayTasks.userId, userId)))

  // Create copy at target date
  const newId = uid()
  await db.insert(dayTasks).values({
    id: newId,
    userId,
    body: taskData.body,
    timeType: 'slot',
    timeValue: 'morning',
    status: 'in_progress',
    type: taskData.type,
    date: targetDate,
    movedFrom: taskData.date,
    movedTo: null,
    createdAt: Date.now(),
  })

  return NextResponse.json({ newId })
}
