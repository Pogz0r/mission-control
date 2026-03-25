import { Send, X } from 'lucide-react'

export function PingSageModal({ isOpen, draft, onChange, onClose, onSubmit }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Ping Sage</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Create a request for Sage</h2>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Request title</span>
            <input name="title" value={draft.title} onChange={onChange} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">What do you want Sage to do?</span>
            <textarea name="description" value={draft.description} onChange={onChange} rows={5} className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Source / context</span>
            <input name="context" value={draft.context} onChange={onChange} placeholder="#app-ideas or task context" className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-violet-500" />
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-zinc-800 px-6 py-5">
          <button onClick={onClose} className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white">
            Cancel
          </button>
          <button onClick={onSubmit} className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400">
            <Send className="h-4 w-4" />
            Send to Sage
          </button>
        </div>
      </div>
    </div>
  )
}
