import { ChevronDown, Plus } from 'lucide-react'

export function Toolbar({ filters, activeFilter, onFilterChange, onCreateTask }) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-4 shadow-glow lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onCreateTask}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange('All')}
            className={`rounded-2xl px-4 py-2 text-sm transition ${
              activeFilter === 'All'
                ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            All
          </button>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`rounded-2xl px-4 py-2 text-sm transition ${
                activeFilter === filter
                  ? 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <button className="inline-flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white lg:min-w-56">
        <span>{activeFilter === 'All' ? 'All missions' : `${activeFilter} focus`}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    </section>
  )
}
