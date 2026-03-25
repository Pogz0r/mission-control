import { CheckSquare2, Clock3, Focus } from 'lucide-react'

export function TasksOverview({ priorities, checklist, dueToday, onToggleChecklist }) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr_0.95fr]">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20">
            <Focus className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Top 3 priorities</p>
            <h2 className="text-lg font-semibold text-white">What matters most today</h2>
          </div>
        </div>

        <div className="space-y-3">
          {priorities.map((item, index) => (
            <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.2em] text-zinc-500">Priority 0{index + 1}</div>
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${item.ring} ${item.accent}`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">Owner: {item.owner}</span>
                <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">Project: {item.project}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/20">
            <CheckSquare2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Recurring checklist</p>
            <h2 className="text-lg font-semibold text-white">Daily operating rhythm</h2>
          </div>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleChecklist(item.id)}
              className="flex w-full items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:border-zinc-700"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900">
                {item.done ? <span className="h-2 w-2 rounded-sm bg-emerald-400" /> : null}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">{item.owner}</span>
                  <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-zinc-300">{item.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/20">
            <Clock3 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Due today</p>
            <h2 className="text-lg font-semibold text-white">Time-sensitive work</h2>
          </div>
        </div>

        <div className="space-y-3">
          {dueToday.map((item) => (
            <article key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <div className="mt-3 space-y-2 text-xs text-zinc-500">
                <div className="flex items-center justify-between gap-3">
                  <span>Owner</span>
                  <span className="text-zinc-300">{item.owner}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Due</span>
                  <span className="text-zinc-300">{item.dueDate}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Source</span>
                  <span className="text-zinc-300">{item.discordChannel || item.source}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
