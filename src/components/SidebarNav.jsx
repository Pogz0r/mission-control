import { iconMap } from './IconMap'

export function SidebarNav({ items }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-24 border-r border-zinc-800 bg-zinc-950/95 px-3 py-6 backdrop-blur">
      <div className="mb-8 flex items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20">
          <span className="text-lg font-semibold">MC</span>
        </div>
      </div>
      <nav className="flex h-[calc(100vh-6rem)] flex-col gap-2 overflow-y-auto pr-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <button
              key={item.label}
              className={`group flex flex-col items-center gap-2 rounded-2xl px-2 py-3 text-[11px] transition ${
                item.active
                  ? 'bg-white text-zinc-950 shadow-glow'
                  : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="leading-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
