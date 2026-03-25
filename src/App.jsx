import { useEffect, useMemo, useState } from 'react'
import { ActivityFeed } from './components/ActivityFeed'
import { Header } from './components/Header'
import { KanbanBoard } from './components/KanbanBoard'
import { SidebarNav } from './components/SidebarNav'
import { StatsBar } from './components/StatsBar'
import { TaskEditor } from './components/TaskEditor'
import { TasksOverview } from './components/TasksOverview'
import { Toolbar } from './components/Toolbar'
import {
  activityItems,
  filters,
  initialTasks,
  navItems,
  owners,
  priorities,
  sources,
  statuses,
} from './data/mockData'

const STORAGE_KEY = 'mission-control.tasks.v1'

const createEmptyDraft = () => ({
  id: '',
  title: '',
  description: '',
  owner: 'Kent',
  assignedBy: 'Sage',
  status: 'Today',
  priority: 'Medium',
  source: 'Manual',
  discordChannel: '',
  discordThread: '',
  project: 'Mission Control',
  tags: '',
  dueDate: '',
  recurring: false,
  notes: '',
})

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [draft, setDraft] = useState(createEmptyDraft())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'All') return tasks
    return tasks.filter((task) => task.owner === activeFilter || task.assignedBy === activeFilter)
  }, [tasks, activeFilter])

  const stats = useMemo(() => {
    const openToday = filteredTasks.filter((task) => task.status === 'Today').length
    const inProgress = filteredTasks.filter((task) => task.status === 'In Progress').length
    const waiting = filteredTasks.filter((task) => task.status === 'Waiting').length
    const done = filteredTasks.filter((task) => task.status === 'Done').length
    const total = filteredTasks.length || 1
    const completion = `${Math.round((done / total) * 100)}%`

    return [
      { label: 'Open today', value: String(openToday), color: 'text-emerald-400', glow: 'from-emerald-500/20' },
      { label: 'In progress', value: String(inProgress), color: 'text-violet-400', glow: 'from-violet-500/20' },
      { label: 'Waiting', value: String(waiting), color: 'text-orange-300', glow: 'from-orange-500/20' },
      { label: 'Completion', value: completion, color: 'text-sky-400', glow: 'from-sky-500/20' },
    ]
  }, [filteredTasks])

  const columns = useMemo(
    () =>
      statuses.map((status) => ({
        title: status,
        tasks: filteredTasks.filter((task) => task.status === status),
      })),
    [filteredTasks],
  )

  const topPriorities = useMemo(() => {
    const accentMap = {
      Today: { accent: 'text-emerald-300', ring: 'ring-emerald-500/20 bg-emerald-500/10' },
      'In Progress': { accent: 'text-violet-300', ring: 'ring-violet-500/20 bg-violet-500/10' },
      Waiting: { accent: 'text-orange-300', ring: 'ring-orange-500/20 bg-orange-500/10' },
      Done: { accent: 'text-sky-300', ring: 'ring-sky-500/20 bg-sky-500/10' },
    }

    const sorted = [...filteredTasks]
      .filter((task) => task.status !== 'Done')
      .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
      .slice(0, 3)

    return sorted.map((task) => ({ ...task, ...accentMap[task.status] }))
  }, [filteredTasks])

  const recurringChecklist = useMemo(() => {
    return filteredTasks
      .filter((task) => task.recurring)
      .slice(0, 4)
      .map((task) => ({
        id: task.id,
        title: task.title,
        owner: task.owner,
        status: task.status,
        done: task.status === 'Done',
      }))
  }, [filteredTasks])

  const dueToday = useMemo(() => {
    return filteredTasks.filter((task) => /today|eod/i.test(task.dueDate || '')).slice(0, 3)
  }, [filteredTasks])

  const openCreateTask = () => {
    setSelectedTask(null)
    setDraft(createEmptyDraft())
    setIsEditorOpen(true)
  }

  const openEditTask = (task) => {
    setSelectedTask(task)
    setDraft({
      ...task,
      tags: (task.tags || []).join(', '),
    })
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setSelectedTask(null)
    setDraft(createEmptyDraft())
  }

  const handleDraftChange = (event) => {
    const { name, value, type, checked } = event.target
    setDraft((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSaveTask = () => {
    const now = new Date().toISOString()
    const payload = {
      ...draft,
      id: selectedTask?.id || `task-${Date.now()}`,
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      completed: draft.status === 'Done',
      createdAt: selectedTask?.createdAt || now,
      updatedAt: now,
    }

    setTasks((current) => {
      if (selectedTask) {
        return current.map((task) => (task.id === selectedTask.id ? payload : task))
      }
      return [payload, ...current]
    })

    closeEditor()
  }

  const handleDeleteTask = () => {
    if (!selectedTask) return
    setTasks((current) => current.filter((task) => task.id !== selectedTask.id))
    closeEditor()
  }

  const toggleChecklistTask = (taskId) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'Done' ? 'Today' : 'Done',
              completed: task.status !== 'Done',
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <SidebarNav items={navItems} />
      <ActivityFeed items={activityItems} />
      <TaskEditor
        isOpen={isEditorOpen}
        task={selectedTask}
        draft={draft}
        owners={owners}
        statuses={statuses}
        priorities={priorities}
        sources={sources}
        onChange={handleDraftChange}
        onClose={closeEditor}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <div className="pl-24 2xl:pr-[22rem]">
        <Header />

        <main className="space-y-6 px-6 py-6">
          <StatsBar stats={stats} />
          <Toolbar
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onCreateTask={openCreateTask}
          />
          <TasksOverview
            priorities={topPriorities}
            checklist={recurringChecklist}
            dueToday={dueToday}
            onToggleChecklist={toggleChecklistTask}
          />

          <div className="overflow-x-auto pb-4">
            <KanbanBoard columns={columns} onSelectTask={openEditTask} />
          </div>
        </main>
      </div>
    </div>
  )
}

function priorityWeight(priority) {
  if (priority === 'High') return 3
  if (priority === 'Medium') return 2
  return 1
}

export default App
