import { Pause, Rocket, Search, Send, RefreshCw, PanelRightClose, PanelRightOpen } from 'lucide-react'

export function Header({
  actions,
  isPaused,
  onTogglePause,
  onPingSage,
  onSearchOpen,
  onRefresh,
  isActivityOpen,
  onToggleActivity,
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-3 border-b border-zinc-800 bg-zinc-950/90 px-4 py-4 backdrop-blur sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/20 lg:h-11 lg:w-11">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500 lg:text-xs">Operations</p>
          <h1 className="text-xl font-semibold text-white lg:text-2xl">Mission Control</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <button
          onClick={onSearchOpen}
          className="hidden items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-zinc-700 hover:text-white md:flex"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
          <span className="rounded-lg border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500">⌘K</span>
        </button>
        {actions}
        <button
          onClick={onTogglePause}
          className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition lg:px-4 lg:py-2.5 lg:text-sm ${
            isPaused
              ? 'border-orange-500/30 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20'
              : 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800'
          }`}
        >
          <Pause className="h-4 w-4" />
          {isPaused ? 'Paused' : 'Pause'}
        </button>
        <button
          onClick={onPingSage}
          className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-400 lg:px-4 lg:py-2.5 lg:text-sm"
        >
          <Send className="h-4 w-4" />
          Ping Sage
        </button>
        <button
          onClick={onToggleActivity}
          className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 lg:px-4 lg:py-2.5 lg:text-sm"
        >
          {isActivityOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          {isActivityOpen ? 'Hide Activity' : 'Show Activity'}
        </button>
        <button
          onClick={onRefresh}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-400 transition hover:border-zinc-700 hover:text-white lg:h-11 lg:w-11"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
