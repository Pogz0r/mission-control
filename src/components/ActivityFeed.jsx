import { iconMap } from './IconMap'

export function ActivityFeed({ items }) {
  return (
    <aside className="fixed inset-y-0 right-0 hidden w-[22rem] border-l border-zinc-800 bg-zinc-950/95 px-5 py-6 backdrop-blur 2xl:block">
      <div className="flex h-full flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Live</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Activity</h2>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
            Streaming
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto pr-1">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon]
            return (
              <div key={`${item.agent}-${index}`} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 p-3 shadow-glow">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-zinc-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-6 text-zinc-300">
                      <span className={`font-semibold ${item.color}`}>{item.agent}</span>{' '}
                      {item.action}
                    </p>
                    <span className="shrink-0 text-xs text-zinc-500">{item.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
