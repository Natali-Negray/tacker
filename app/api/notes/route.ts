import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { dailyNotes, periodNotes } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

// GET /api/notes?type=day&key=2026-05-28
// GET /api/notes?type=period&key=2026-W22
export async function GET(req: NextRequest) {
  const { userId } = await verifySession()
  const type = req.nextUrl.searchParams.get('type')
  const key = req.nextUrl.searchParams.get('key')

  if (!type || !key) return NextResponse.json({ error: 'type and key required' }, { status: 400 })

  if (type === 'day') {
    const rows = await db.select().from(dailyNotes).where(
      and(eq(dailyNotes.userId, userId), eq(dailyNotes.date, key))
    )
    return NextResponse.json({ note: rows[0]?.note ?? '' })
  }

  if (type === 'period') {
    const rows = await db.select().from(periodNotes).where(
      and(eq(periodNotes.userId, userId), eq(periodNotes.period, key))
    )
    return NextResponse.json({ note: rows[0]?.note ?? '' })
  }

  return NextResponse.json({ error: 'invalid type' }, { status: 400 })
}

// PUT /api/notes   body: { type, key, note }
export async function PUT(req: NextRequest) {
  const { userId } = await verifySession()
  const { type, key, note } = await req.json()

  if (type === 'day') {
    await db.insert(dailyNotes)
      .values({ userId, date: key, note })
      .onConflictDoUpdate({ target: [dailyNotes.userId, dailyNotes.date], set: { note } })
    return NextResponse.json({ ok: true })
  }

  if (type === 'period') {
    await db.insert(periodNotes)
      .values({ userId, period: key, note })
      .onConflictDoUpdate({ target: [periodNotes.userId, periodNotes.period], set: { note } })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'invalid type' }, { status: 400 })
}
