'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BellRing, Download, Upload } from 'lucide-react'
import { ActivityFeed } from '../src/components/ActivityFeed'
import { Header } from '../src/components/Header'
import { KanbanBoard } from '../src/components/KanbanBoard'
import { PingSageModal } from '../src/components/PingSageModal'
import { SearchDialog } from '../src/components/SearchDialog'
import { SidebarNav } from '../src/components/SidebarNav'
import { StatsBar } from '../src/components/StatsBar'
import { TaskDetailPanel } from '../src/components/TaskDetailPanel'
import { TaskEditor } from '../src/components/TaskEditor'
import { TasksOverview } from '../src/components/TasksOverview'
import { Toolbar } from '../src/components/Toolbar'
import { AgentQueues } from '../src/components/AgentQueues'
import {
  activityItems,
  filters,
  initialTasks,
  navItems,
  owners,
  priorities,
  sources,
  statuses,
} from '../src/data/mockData'

const STORAGE_KEY = 'mission-control.tasks.v2'
const UI_STORAGE_KEY = 'mission-control.ui.v1'

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
  discordMessage: '',
  discordMessageUrl: '',
  project: 'Mission Control',
  tags: '',
  dueDate: '',
  recurring: false,
  notes: '',
  refs: '[]',
})

const createPingDraft = () => ({
  title: 'Need Sage review',
  description: '',
  context: '#app-ideas',
})

export default function MissionControlApp() {
  const fileInputRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeFilter, setActiveFilter] = useState('All')
  const [missionScope, setMissionScope] = useState('All missions')
  const [selectedTask, setSelectedTask] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isPingOpen, setIsPingOpen] = useState(false)
  const [pingDraft, setPingDraft] = useState(createPingDraft())
  const [draft, setDraft] = useState(createEmptyDraft())
  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [banner, setBanner] = useState('')
  const [feedItems, setFeedItems] = useState(activityItems)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setTasks(parsed)
      }
      const savedUi = window.localStorage.getItem(UI_STORAGE_KEY)
      if (savedUi) {
        const parsedUi = JSON.parse(savedUi)
        if (typeof parsedUi.isPaused === 'boolean') setIsPaused(parsedUi.isPaused)
        if (typeof parsedUi.isActivityOpen === 'boolean') setIsActivityOpen(parsedUi.isActivityOpen)
        if (typeof parsedUi.missionScope === 'string') setMissionScope(parsedUi.missionScope)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [mounted, tasks])

  useEffect(() => {
    if (!mounted) return
    window.localStorage.setItem(
      UI_STORAGE_KEY,
      JSON.stringify({ isPaused, isActivityOpen, missionScope }),
    )
  }, [mounted, isPaused, isActivityOpen, missionScope])

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsPingOpen(false)
        setIsActivityOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const scopedTasks = useMemo(() => {
    if (missionScope === 'All missions') return tasks
    return tasks.filter((task) => task.project === missionScope)
  }, [tasks, missionScope])

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'All') return scopedTasks
    return scopedTasks.filter((task) => task.owner === activeFilter || task.assignedBy === activeFilter)
  }, [scopedTasks, activeFilter])

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return filteredTasks.slice(0, 8)
    return filteredTasks.filter((task) => {
      const haystack = [
        task.title,
        task.description,
        task.owner,
        task.assignedBy,
        task.project,
        task.discordChannel,
        task.discordThread,
        task.notes,
        ...(task.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [filteredTasks, searchQuery])

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

  const agentQueues = useMemo(() => {
    return owners.map((owner) => {
      const owned = filteredTasks.filter((task) => task.owner === owner)
      const today = owned.filter((task) => task.status === 'Today').length
      const inProgress = owned.filter((task) => task.status === 'In Progress').length
      const waiting = owned.filter((task) => task.status === 'Waiting').length
      const done = owned.filter((task) => task.status === 'Done').length
      const nextUp = owned
        .filter((task) => task.status !== 'Done')
        .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))[0]

      return { owner, total: owned.length, today, inProgress, waiting, done, nextUp }
    })
  }, [filteredTasks])

  const withPauseGuard = (action, message = 'Mission Control is paused. Resume to make changes.') => {
    if (isPaused) {
      setBanner(message)
      return
    }
    action()
  }

  const pushFeedItem = (item) => setFeedItems((current) => [item, ...current].slice(0, 12))

  const openCreateTask = () => withPauseGuard(() => {
    setSelectedTask(null)
    setIsDetailOpen(false)
    setDraft(createEmptyDraft())
    setIsEditorOpen(true)
  })

  const openDetailTask = (task) => {
    setSelectedTask(task)
    setIsDetailOpen(true)
  }

  const openEditTask = (task = selectedTask) => {
    if (!task) return
    withPauseGuard(() => {
      setSelectedTask(task)
      setDraft({
        ...task,
        tags: (task.tags || []).join(', '),
        refs: JSON.stringify(task.refs || [], null, 2),
      })
      setIsDetailOpen(false)
      setIsEditorOpen(true)
    })
  }

  const closeDetail = () => setIsDetailOpen(false)

  const closeEditor = () => {
    setIsEditorOpen(false)
    setDraft(createEmptyDraft())
  }

  const handleDraftChange = (event) => {
    const { name, value, type, checked } = event.target
    setDraft((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSaveTask = () => withPauseGuard(() => {
    const now = new Date().toISOString()
    const parsedRefs = safeParseRefs(draft.refs)
    const payload = {
      ...draft,
      id: selectedTask?.id || `task-${Date.now()}`,
      tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      refs: parsedRefs,
      completed: draft.status === 'Done',
      createdAt: selectedTask?.createdAt || now,
      updatedAt: now,
      history: appendHistory(selectedTask?.history || [], {
        id: `history-${Date.now()}`,
        action: selectedTask ? 'Task updated' : 'Task created',
        detail: selectedTask
          ? `Saved changes to ${draft.title || 'untitled task'}.`
          : `Created ${draft.title || 'untitled task'} and assigned it to ${draft.owner}.`,
        time: formatHistoryTime(now),
      }),
    }

    setTasks((current) => {
      const next = selectedTask
        ? current.map((task) => (task.id === selectedTask.id ? payload : task))
        : [payload, ...current]
      setSelectedTask(payload)
      setIsDetailOpen(true)
      return next
    })

    pushFeedItem({ icon: 'Bot', agent: payload.owner, color: 'text-emerald-400', action: selectedTask ? `updated ${payload.title}` : `picked up ${payload.title}`, time: 'now' })
    setBanner(selectedTask ? 'Task updated.' : 'Task created.')
    setIsEditorOpen(false)
  })

  const handleDeleteTask = () => withPauseGuard(() => {
    if (!selectedTask) return
    const deletedTitle = selectedTask.title
    setTasks((current) => current.filter((task) => task.id !== selectedTask.id))
    setSelectedTask(null)
    setIsDetailOpen(false)
    setIsEditorOpen(false)
    setDraft(createEmptyDraft())
    pushFeedItem({ icon: 'ShieldAlert', agent: 'Mission Control', color: 'text-red-400', action: `removed ${deletedTitle}`, time: 'now' })
    setBanner('Task deleted.')
  })

  const toggleChecklistTask = (taskId) => withPauseGuard(() => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === 'Done' ? 'Today' : 'Done',
              completed: task.status !== 'Done',
              updatedAt: new Date().toISOString(),
              history: appendHistory(task.history || [], {
                id: `history-${Date.now()}`,
                action: task.status === 'Done' ? 'Checklist reopened' : 'Checklist completed',
                detail: task.status === 'Done' ? 'Moved back into Today.' : 'Marked recurring task complete.',
                time: formatHistoryTime(new Date().toISOString()),
              }),
            }
          : task,
      ),
    )
  })

  const moveTaskToStatus = (taskId, nextStatus) => withPauseGuard(() => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== taskId || task.status === nextStatus) return task
        const updated = {
          ...task,
          status: nextStatus,
          completed: nextStatus === 'Done',
          updatedAt: new Date().toISOString(),
          history: appendHistory(task.history || [], {
            id: `history-${Date.now()}`,
            action: 'Status moved',
            detail: `Moved from ${task.status} to ${nextStatus}.`,
            time: formatHistoryTime(new Date().toISOString()),
          }),
        }
        if (selectedTask?.id === task.id) setSelectedTask(updated)
        return updated
      }),
    )
  }, 'Mission Control is paused. Unpause before moving tasks.')

  const handleDropTask = (status) => {
    if (!draggingTaskId) return
    moveTaskToStatus(draggingTaskId, status)
    setDraggingTaskId(null)
  }

  const handleExportJson = () => {
    const payload = { exportedAt: new Date().toISOString(), version: 2, tasks }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mission-control-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    setBanner('Task snapshot exported as JSON.')
  }

  const handleImportJson = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (isPaused) {
      setBanner('Mission Control is paused. Resume before importing JSON.')
      event.target.value = ''
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const nextTasks = Array.isArray(parsed) ? parsed : parsed.tasks
      if (!Array.isArray(nextTasks)) throw new Error('Invalid import format')
      setTasks(nextTasks)
      setSelectedTask(null)
      setIsDetailOpen(false)
      setBanner('Task snapshot imported.')
    } catch {
      window.alert('Could not import JSON. Expected an array of tasks or { tasks: [...] }.')
    } finally {
      event.target.value = ''
    }
  }

  const handleSearchSelect = (task) => {
    setIsSearchOpen(false)
    setSearchQuery('')
    openDetailTask(task)
  }

  const handlePingDraftChange = (event) => {
    const { name, value } = event.target
    setPingDraft((current) => ({ ...current, [name]: value }))
  }

  const handleSubmitPing = () => withPauseGuard(() => {
    const now = new Date().toISOString()
    const title = pingDraft.title.trim() || 'Need Sage review'
    const payload = {
      id: `task-${Date.now()}`,
      title,
      description: pingDraft.description.trim() || 'Requested direct Sage attention from Mission Control.',
      owner: 'Sage',
      assignedBy: activeFilter === 'All' ? 'Kent' : activeFilter,
      status: 'Today',
      priority: 'High',
      source: 'Internal',
      discordChannel: pingDraft.context.trim(),
      discordThread: '',
      discordMessage: '',
      discordMessageUrl: '',
      project: missionScope === 'All missions' ? 'Mission Control' : missionScope,
      tags: ['Ping Sage'],
      dueDate: 'Today',
      recurring: false,
      completed: false,
      notes: 'Created from the Ping Sage quick action.',
      refs: [],
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: `history-${Date.now()}`,
          action: 'Pinged Sage',
          detail: pingDraft.description.trim() || 'Quick request created from header control.',
          time: formatHistoryTime(now),
        },
      ],
    }

    setTasks((current) => [payload, ...current])
    setPingDraft(createPingDraft())
    setIsPingOpen(false)
    setBanner('Sage has a new task in Today.')
    pushFeedItem({ icon: 'MessagesSquare', agent: 'Sage', color: 'text-violet-400', action: `received ${title}`, time: 'now' })
  })

  const handleTogglePause = () => {
    setIsPaused((current) => !current)
    setBanner((current) => (isPaused ? 'Mission Control resumed.' : 'Mission Control paused. Mutations are temporarily locked.'))
  }

  const handleRefresh = () => {
    setBanner('Dashboard refreshed against current local state.')
    setFeedItems((current) => [...current])
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <SidebarNav items={navItems} />

      <div className="min-w-0 flex-1 overflow-x-hidden">
        <Header
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
          onPingSage={() => setIsPingOpen(true)}
          onSearchOpen={() => setIsSearchOpen(true)}
          onRefresh={handleRefresh}
          isActivityOpen={isActivityOpen}
          onToggleActivity={() => setIsActivityOpen((current) => !current)}
          actions={
            <>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportJson} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-800 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                <Upload className="h-4 w-4" />
                Import JSON
              </button>
              <button
                onClick={handleExportJson}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-400 lg:px-4 lg:py-2.5 lg:text-sm"
              >
                <Download className="h-4 w-4" />
                Export JSON
              </button>
            </>
          }
        />

        <main className="min-w-0 space-y-5 overflow-x-hidden px-4 py-4 sm:px-5 lg:space-y-6 lg:px-6 lg:py-6">
          {(banner || isPaused) ? (
            <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-glow ${
              isPaused
                ? 'border-orange-500/20 bg-orange-500/10 text-orange-200'
                : 'border-sky-500/20 bg-sky-500/10 text-sky-100'
            }`}>
              <BellRing className="h-4 w-4" />
              <span>{banner || 'Mission Control is paused.'}</span>
            </div>
          ) : null}

          <StatsBar stats={stats} />
          <Toolbar
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onCreateTask={openCreateTask}
            isPaused={isPaused}
            missionScope={missionScope}
            onMissionScopeChange={setMissionScope}
          />
          <TasksOverview priorities={topPriorities} checklist={recurringChecklist} dueToday={dueToday} onToggleChecklist={toggleChecklistTask} />
          <AgentQueues queues={agentQueues} onSelectTask={openDetailTask} />
          <div className="min-w-0 overflow-x-auto pb-4">
            <KanbanBoard
              columns={columns}
              onSelectTask={openDetailTask}
              onDropTask={handleDropTask}
              draggingTaskId={draggingTaskId}
              onDragStart={setDraggingTaskId}
              onDragEnd={() => setDraggingTaskId(null)}
            />
          </div>
        </main>
      </div>

      <ActivityFeed items={feedItems} isOpen={isActivityOpen} onClose={() => setIsActivityOpen(false)} />
      <SearchDialog
        isOpen={isSearchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        results={searchResults}
        onClose={() => setIsSearchOpen(false)}
        onSelectTask={handleSearchSelect}
      />
      <PingSageModal
        isOpen={isPingOpen}
        draft={pingDraft}
        onChange={handlePingDraftChange}
        onClose={() => setIsPingOpen(false)}
        onSubmit={handleSubmitPing}
      />
      <TaskDetailPanel
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={closeDetail}
        onEdit={() => openEditTask(selectedTask)}
        onMove={(status) => selectedTask && moveTaskToStatus(selectedTask.id, status)}
      />
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
    </div>
  )
}

function safeParseRefs(value) {
  if (!value?.trim()) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function appendHistory(history, entry) {
  return [entry, ...history].slice(0, 12)
}

function priorityWeight(priority) {
  return { High: 3, Medium: 2, Low: 1 }[priority] || 0
}

function formatHistoryTime(value) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
