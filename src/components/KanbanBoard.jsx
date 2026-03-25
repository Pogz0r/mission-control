const statusConfig = {
  Today: { accent: 'bg-emerald-500', dot: 'bg-emerald-400' },
  'In Progress': { accent: 'bg-violet-500', dot: 'bg-violet-400' },
  Waiting: { accent: 'bg-orange-500', dot: 'bg-orange-400' },
  Done: { accent: 'bg-sky-500', dot: 'bg-sky-400' },
}

const priorityStyles = {
  High: 'text-red-300',
  Medium: 'text-orange-300',
  Low: 'text-zinc-300',
}

const tagStyles = {
  Kent: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
  Sage: 'bg-violet-500/15 text-violet-300 ring-violet-500/20',
  Cypher: 'bg-sky-500/15 text-sky-300 ring-sky-500/20',
  Iso: 'bg-orange-500/15 text-orange-300 ring-orange-500/20',
  Reyna: 'bg-rose-500/15 text-rose-300 ring-rose-500/20',
}

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function KanbanBoard({ columns, onSelectTask }) {
  return (
    <section className="grid min-w-max grid-cols-4 gap-5 xl:min-w-0 xl:grid-cols-4">
      {columns.map((column) => {
        const config = statusConfig[column.title]

        return (
          <div key={column.title} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${config.accent}`} />
                <h2 className="text-sm font-semibold text-white">{column.title}</h2>
              </div>
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">{column.tasks.length}</span>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="block w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-left transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                        <span className="text-xs text-zinc-500">{task.status}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    </div>
                    <span className={`rounded-full bg-zinc-900 px-2 py-1 text-[10px] uppercase tracking-[0.22em] ${priorityStyles[task.priority] || 'text-zinc-400'}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{task.description}</p>

                  <div className="mt-4 grid gap-2 text-xs text-zinc-500">
                    <div className="flex items-center justify-between gap-3">
                      <span>Project</span>
                      <span className="text-zinc-300">{task.project}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span>Source</span>
                      <span className="truncate text-zinc-300">{task.discordChannel || task.source}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-800 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-white">
                        {initials(task.owner)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-zinc-200">{task.owner}</div>
                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ${tagStyles[task.owner] || 'bg-zinc-500/15 text-zinc-300 ring-zinc-500/20'}`}>
                          {task.tags?.[0] || 'Task'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">{task.dueDate || 'No due date'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}
