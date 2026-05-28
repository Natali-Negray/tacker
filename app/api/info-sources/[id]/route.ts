import { NextRequest, NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { infoSources } from '@/lib/schema'
import { verifySession } from '@/lib/dal'

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/info-sources/[id]'>) {
  const { userId } = await verifySession()
  const { id } = await ctx.params

  await db.delete(infoSources).where(and(eq(infoSources.id, id), eq(infoSources.userId, userId)))
  return NextResponse.json({ ok: true })
}
