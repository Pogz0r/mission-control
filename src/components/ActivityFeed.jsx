import { ChevronRight } from 'lucide-react'
import { iconMap } from './IconMap'

export function ActivityFeed({ items, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="Close activity feed"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
      />

      <aside className="absolute inset-y-0 right-0 flex h-full w-full max-w-[24rem] flex-col border-l border-zinc-800 bg-zinc-950/95 px-4 py-5 shadow-2xl backdrop-blur xl:max-w-[20rem] 2xl:max-w-[22rem] 2xl:px-5 2xl:py-6">
        <div className="mb-5 flex items-center justify-between 2xl:mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Live</p>
            <h2 className="mt-1 text-base font-semibold text-white 2xl:text-lg">Activity</h2>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1 2xl:space-y-3">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <div key={`${item.agent}-${index}`} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-glow">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-zinc-300 2xl:h-10 2xl:w-10">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs leading-5 text-zinc-300 2xl:text-sm 2xl:leading-6">
                      <span className={`font-semibold ${item.color}`}>{item.agent}</span>{' '}
                      {item.action}
                    </p>
                    <span className="shrink-0 text-[10px] text-zinc-500 2xl:text-xs">{item.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
