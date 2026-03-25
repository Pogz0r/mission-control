import { X } from 'lucide-react'

export function TaskEditor({
  isOpen,
  task,
  draft,
  owners,
  statuses,
  priorities,
  sources,
  onChange,
  onClose,
  onSave,
  onDelete,
}) {
  if (!isOpen) return null

  const isNew = !task

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Task editor</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{isNew ? 'Create task' : 'Edit task'}</h2>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto px-6 py-6 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-400">Title</span>
            <input name="title" value={draft.title} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-400">Description</span>
            <textarea name="description" value={draft.description} onChange={onChange} rows={4} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <FieldSelect label="Owner" name="owner" value={draft.owner} options={owners} onChange={onChange} />
          <FieldSelect label="Assigned by" name="assignedBy" value={draft.assignedBy} options={owners} onChange={onChange} />
          <FieldSelect label="Status" name="status" value={draft.status} options={statuses} onChange={onChange} />
          <FieldSelect label="Priority" name="priority" value={draft.priority} options={priorities} onChange={onChange} />
          <FieldSelect label="Source" name="source" value={draft.source} options={sources} onChange={onChange} />

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Project</span>
            <input name="project" value={draft.project} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Due date</span>
            <input name="dueDate" value={draft.dueDate} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Discord channel</span>
            <input name="discordChannel" value={draft.discordChannel} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Discord thread</span>
            <input name="discordThread" value={draft.discordThread} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Discord message id</span>
            <input name="discordMessage" value={draft.discordMessage} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label>
            <span className="mb-2 block text-sm text-zinc-400">Discord message URL</span>
            <input name="discordMessageUrl" value={draft.discordMessageUrl} onChange={onChange} placeholder="https://discord.com/channels/..." className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-400">Tags</span>
            <input name="tags" value={draft.tags} onChange={onChange} placeholder="comma, separated, tags" className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-400">Discord references JSON</span>
            <textarea name="refs" value={draft.refs} onChange={onChange} rows={6} placeholder='[{"label":"Thread","url":"https://discord.com/channels/...","note":"Originated from dev-log"}]' className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 font-mono text-sm text-white outline-none transition focus:border-violet-500" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-2 block text-sm text-zinc-400">Notes</span>
            <textarea name="notes" value={draft.notes} onChange={onChange} rows={5} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500" />
          </label>

          <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <input type="checkbox" name="recurring" checked={draft.recurring} onChange={onChange} className="h-4 w-4 accent-violet-500" />
            <span className="text-sm text-zinc-300">Recurring task</span>
          </label>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 px-6 py-5">
          <div>
            {!isNew ? (
              <button onClick={onDelete} className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20">
                Delete task
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white">
              Cancel
            </button>
            <button onClick={onSave} className="rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400">
              {isNew ? 'Create task' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldSelect({ label, name, value, options, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-sm text-zinc-400">{label}</span>
      <select name={name} value={value} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-violet-500">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}
