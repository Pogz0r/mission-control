import { Pause, Rocket, Search, Send, RefreshCw } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 py-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/20">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Operations</p>
          <h1 className="text-2xl font-semibold text-white">Mission Control</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white md:flex">
          <Search className="h-4 w-4" />
          <span>Search</span>
          <span className="rounded-lg border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500">⌘K</span>
        </button>
        <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800">
          <Pause className="h-4 w-4" />
          Pause
        </button>
        <button className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400">
          <Send className="h-4 w-4" />
          Ping Sage
        </button>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
