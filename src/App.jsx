import { ActivityFeed } from './components/ActivityFeed'
import { Header } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { SidebarNav } from './components/SidebarNav'
import { StatsBar } from './components/StatsBar'
import { TasksOverview } from './components/TasksOverview'
import { Toolbar } from './components/Toolbar'
import {
  activityItems,
  boardColumns,
  dueToday,
  filters,
  navItems,
  recurringChecklist,
  stats,
  topPriorities,
} from './data/mockData'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SidebarNav items={navItems} />
      <ActivityFeed items={activityItems} />

      <div className="pl-24 2xl:pr-[22rem]">
        <Header />

        <main className="space-y-6 px-6 py-6">
          <StatsBar stats={stats} />
          <Toolbar filters={filters} />
          <TasksOverview priorities={topPriorities} checklist={recurringChecklist} dueToday={dueToday} />

          <div className="overflow-x-auto pb-4">
            <KanbanBoard columns={boardColumns} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
