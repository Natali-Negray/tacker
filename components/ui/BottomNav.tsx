'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/day', label: 'Сегодня', icon: '📅' },
  { href: '/plans', label: 'Планы', icon: '📋' },
  { href: '/reflection', label: 'Рефлексия', icon: '🪞' },
  { href: '/info', label: 'Инфо', icon: '📰' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-pb">
      <div className="max-w-2xl mx-auto flex">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors
                ${active ? 'text-slate-800' : 'text-gray-400 hover:text-gray-600'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-medium ${active ? 'text-slate-800' : ''}`}>
                {item.label}
              </span>
              {active && (
                <div className="w-1 h-1 rounded-full bg-slate-800 mt-0.5" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
