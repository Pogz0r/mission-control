const toneMap = {
  Kent: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
  Sage: 'bg-violet-500/15 text-violet-300 ring-violet-500/20',
  Cypher: 'bg-sky-500/15 text-sky-300 ring-sky-500/20',
  Iso: 'bg-orange-500/15 text-orange-300 ring-orange-500/20',
  Reyna: 'bg-rose-500/15 text-rose-300 ring-rose-500/20',
}

export function AgentQueues({ queues, onSelectTask }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Agent queues</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Per-agent workload snapshot</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-5 md:grid-cols-2">
        {queues.map((queue) => (
          <article key={queue.owner} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`rounded-full px-3 py-1.5 text-xs ring-1 ${toneMap[queue.owner] || 'bg-zinc-800 text-zinc-300 ring-zinc-700'}`}>
                {queue.owner}
              </span>
              <span className="text-xs text-zinc-500">{queue.total} tasks</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <Metric label="Today" value={queue.today} />
              <Metric label="In progress" value={queue.inProgress} />
              <Metric label="Waiting" value={queue.waiting} />
              <Metric label="Done" value={queue.done} />
            </div>

            <div className="mt-4 border-t border-zinc-800 pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Next up</p>
              {queue.nextUp ? (
                <button onClick={() => onSelectTask(queue.nextUp)} className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-3 text-left transition hover:border-zinc-700 hover:bg-zinc-800">
                  <div className="text-sm font-medium text-white">{queue.nextUp.title}</div>
                  <div className="mt-2 text-xs text-zinc-500">{queue.nextUp.priority} priority · {queue.nextUp.status}</div>
                </button>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Queue is clear.</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-900 px-3 py-2">
      <div className="text-zinc-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  )
}
