'use client'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 bg-slate-800 text-white rounded-2xl shadow-lg flex items-center justify-center text-2xl hover:bg-slate-700 active:scale-95 transition-all z-40"
      aria-label="Добавить задачу"
    >
      +
    </button>
  )
}
