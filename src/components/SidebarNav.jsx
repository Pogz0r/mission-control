import { iconMap } from './IconMap'

export function SidebarNav({ items, activeView, onViewChange }) {
  return (
    <aside className="sticky top-0 h-screen w-16 shrink-0 border-r border-zinc-800 bg-zinc-950/95 px-2 py-4 backdrop-blur lg:w-20 lg:px-2.5 lg:py-6 2xl:w-24 2xl:px-3">
      <div className="mb-6 flex items-center justify-center lg:mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20 lg:h-11 lg:w-11">
          <span className="text-sm font-semibold lg:text-lg">MC</span>
        </div>
      </div>
      <nav className="flex h-[calc(100vh-5.5rem)] flex-col gap-1.5 overflow-y-auto pr-0.5 lg:gap-2 lg:pr-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = activeView === item.label.toLowerCase()
          return (
            <button
              key={item.label}
              onClick={() => onViewChange(item.label.toLowerCase())}
              className={`group flex flex-col items-center gap-1.5 rounded-2xl px-1.5 py-2 text-[10px] transition lg:gap-2 lg:px-2 lg:py-3 lg:text-[11px] ${
                isActive
                  ? 'bg-white text-zinc-950 shadow-glow'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span className="leading-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
