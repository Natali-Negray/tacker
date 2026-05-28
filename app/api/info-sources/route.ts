import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { infoSources } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export async function GET() {
  const { userId } = await verifySession()
  const rows = await db.select().from(infoSources).where(eq(infoSources.userId, userId))
  return NextResponse.json(rows.map(r => ({
    id: r.id, name: r.name, url: r.url, createdAt: r.createdAt,
  })))
}

export async function POST(req: NextRequest) {
  const { userId } = await verifySession()
  const body = await req.json()

  const id = uid()
  const now = Date.now()
  await db.insert(infoSources).values({
    id,
    userId,
    name: body.name,
    url: body.url ?? '',
    createdAt: now,
  })
  return NextResponse.json({ id, createdAt: now })
}
