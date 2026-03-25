import { ChevronDown, Plus } from 'lucide-react'

export function Toolbar({ filters, activeFilter, onFilterChange, onCreateTask, isPaused, missionScope, onMissionScopeChange }) {
  const focusOptions = ['All', ...filters]
  const missionOptions = ['All missions', 'Mission Control', 'Discord Ops', 'Agent Ops']

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-glow lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onCreateTask}
          disabled={isPaused}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
        <div className="flex flex-wrap gap-2">
          {focusOptions.map((filter) => {
            const active = activeFilter === filter
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`rounded-2xl px-4 py-2 text-sm transition ${
                  active
                    ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {filter}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative inline-flex min-w-56 items-center rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white">
          <select
            value={activeFilter}
            onChange={(event) => onFilterChange(event.target.value)}
            className="w-full appearance-none bg-transparent pr-8 text-sm text-zinc-300 outline-none"
          >
            {focusOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All focus' : `${option} focus`}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-zinc-500" />
        </label>

        <label className="relative inline-flex min-w-48 items-center rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white">
          <select
            value={missionScope}
            onChange={(event) => onMissionScopeChange(event.target.value)}
            className="w-full appearance-none bg-transparent pr-8 text-sm text-zinc-300 outline-none"
          >
            {missionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-zinc-500" />
        </label>
      </div>
    </section>
  )
}
