import { Search, X } from 'lucide-react'

export function SearchDialog({ isOpen, query, onQueryChange, results, onClose, onSelectTask }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-20 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search tasks, owners, projects, tags, Discord channels..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          />
          <button onClick={onClose} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {results.length ? (
            <div className="space-y-3">
              {results.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="block w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-left transition hover:border-zinc-700 hover:bg-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{task.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-zinc-300">{task.owner}</span>
                    <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-zinc-300">{task.project}</span>
                    {task.discordChannel ? <span className="rounded-full bg-zinc-950 px-2.5 py-1 text-zinc-300">{task.discordChannel}</span> : null}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900 p-10 text-center text-sm text-zinc-500">
              No matching tasks yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
