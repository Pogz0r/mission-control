export function KanbanBoard({ columns }) {
  return (
    <section className="grid min-w-max grid-cols-4 gap-5 xl:min-w-0 xl:grid-cols-4">
      {columns.map((column) => (
        <div key={column.title} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
              <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            </div>
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
              {column.count}
            </span>
          </div>

          <div className="space-y-3">
            {column.cards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${card.dot}`} />
                      <span className="text-xs text-zinc-500">{card.status}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{card.description}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                      {card.owner}
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${card.tagClass}`}>
                      {card.tag}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">{card.time}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
