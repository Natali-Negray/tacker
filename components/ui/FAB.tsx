'use client'

interface FABProps {
  onClick: () => void
}

export function FAB({ onClick }: FABProps) {
  return (
    <div className="fixed bottom-20 left-0 right-0 pointer-events-none z-40">
      <div className="max-w-2xl mx-auto px-4 flex justify-end">
        <button
          onClick={onClick}
          className="pointer-events-auto w-14 h-14 bg-slate-800 text-white rounded-2xl shadow-lg flex items-center justify-center text-2xl hover:bg-slate-700 active:scale-95 transition-all"
          aria-label="Добавить задачу"
        >
          +
        </button>
      </div>
    </div>
  )
}
