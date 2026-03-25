import { ArrowRight, Clock3, FilePenLine, GripVertical, MessageSquareText, UserRound, X } from 'lucide-react'

const statusTone = {
  Today: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20',
  'In Progress': 'bg-violet-500/10 text-violet-300 ring-violet-500/20',
  Waiting: 'bg-orange-500/10 text-orange-300 ring-orange-500/20',
  Done: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',
}

export function TaskDetailPanel({ task, isOpen, onClose, onEdit, onMove }) {
  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 z-30 flex justify-end bg-black/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Task detail</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1.5 text-xs ring-1 ${statusTone[task.status] || 'bg-zinc-800 text-zinc-300 ring-zinc-700'}`}>
              {task.status}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 ring-1 ring-zinc-800">{task.priority}</span>
            <span className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 ring-1 ring-zinc-800">{task.project}</span>
          </div>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
            <h3 className="text-sm font-semibold text-white">Description</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{task.description || 'No description yet.'}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <InfoCard icon={UserRound} label="Owner" value={task.owner} />
            <InfoCard icon={ArrowRight} label="Assigned by" value={task.assignedBy} />
            <InfoCard icon={Clock3} label="Due date" value={task.dueDate || 'No due date'} />
            <InfoCard icon={MessageSquareText} label="Discord" value={task.discordThread || task.discordChannel || task.source} />
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Quick move</h3>
                <p className="mt-1 text-sm text-zinc-500">Drag between columns, or move from here.</p>
              </div>
              <GripVertical className="h-4 w-4 text-zinc-500" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Today', 'In Progress', 'Waiting', 'Done'].map((status) => (
                <button
                  key={status}
                  onClick={() => onMove(status)}
                  className={`rounded-2xl px-3 py-2 text-sm transition ${
                    task.status === status
                      ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20'
                      : 'bg-zinc-950 text-zinc-300 ring-1 ring-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
            <h3 className="text-sm font-semibold text-white">Notes</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{task.notes || 'No notes yet.'}</p>
            {task.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 ring-1 ring-zinc-800">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow">
            <h3 className="text-sm font-semibold text-white">History</h3>
            <div className="mt-4 space-y-3">
              {(task.history || []).length ? (
                task.history.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-200">{entry.action}</p>
                      <span className="text-xs text-zinc-500">{entry.time}</span>
                    </div>
                    {entry.detail ? <p className="mt-2 text-sm text-zinc-400">{entry.detail}</p> : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">No history yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-5">
          <div className="text-xs text-zinc-500">Created {formatTime(task.createdAt)} · Updated {formatTime(task.updatedAt)}</div>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400"
          >
            <FilePenLine className="h-4 w-4" />
            Edit task
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-glow">
      <div className="flex items-center gap-3 text-zinc-400">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <div className="mt-3 text-sm font-medium text-white">{value}</div>
    </div>
  )
}

function formatTime(value) {
  if (!value) return 'unknown'
  return new Date(value).toLocaleString()
}
