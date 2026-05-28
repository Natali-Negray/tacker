import type { Config } from 'drizzle-kit'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env.local manually since drizzle-kit doesn't read it automatically
try {
  const envPath = join(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) process.env[match[1]] = match[2]
  }
} catch { /* file not found */ }

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
