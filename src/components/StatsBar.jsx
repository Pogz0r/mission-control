export function StatsBar({ stats }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-5 shadow-glow"
        >
          <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${stat.glow} to-transparent`} />
          <div className="relative flex items-end justify-between gap-4">
            <div>
              <div className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
              <div className="mt-2 text-sm text-zinc-400">{stat.label}</div>
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-600">Live</div>
          </div>
        </div>
      ))}
    </section>
  )
}
