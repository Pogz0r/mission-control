import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const TASKS_FILE = process.env.TASKS_FILE_PATH || '/data/.openclaw/workspace/automations/tasks.json'

function readTasks() {
  try {
    const data = readFileSync(TASKS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return { version: '1.0', lastSync: new Date().toISOString(), channels: {}, tasks: [] }
  }
}

function writeTasks(data: any) {
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const taskId = searchParams.get('id')
  const status = searchParams.get('status')
  const owner = searchParams.get('owner')
  const project = searchParams.get('project')

  const data = readTasks()

  let tasks = data.tasks || []

  if (taskId) {
    tasks = tasks.filter((t: any) => t.id === taskId)
  }
  if (status) {
    tasks = tasks.filter((t: any) => t.status === status)
  }
  if (owner) {
    tasks = tasks.filter((t: any) => t.owner === owner)
  }
  if (project) {
    tasks = tasks.filter((t: any) => t.project === project)
  }

  return NextResponse.json({
    tasks,
    total: tasks.length,
    lastSync: data.lastSync,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = readTasks()

    // Generate new task ID
    const maxId = data.tasks.reduce((max: number, t: any) => {
      const num = parseInt(t.id.split('-')[1] || '0')
      return num > max ? num : max
    }, 0)
    const newId = `task-${maxId + 1}`

    const newTask = {
      id: newId,
      title: body.title || 'Untitled Task',
      description: body.description || '',
      owner: body.owner || 'Kent',
      assignedBy: body.assignedBy || 'Sage',
      status: body.status || 'Today',
      priority: body.priority || 'Medium',
      source: body.source || 'Mission Control',
      discordChannel: body.discordChannel || '',
      discordMessage: body.discordMessage || '',
      refs: body.refs || [],
      project: body.project || 'Mission Control',
      tags: body.tags || [],
      dueDate: body.dueDate || 'Today',
      recurring: body.recurring || false,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    data.tasks.push(newTask)
    data.lastSync = new Date().toISOString()
    writeTasks(data)

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const taskId = body.id

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
    }

    const data = readTasks()
    const taskIndex = data.tasks.findIndex((t: any) => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Apply updates
    const allowedFields = [
      'title', 'description', 'owner', 'assignedBy', 'status', 'priority',
      'discordChannel', 'discordMessage', 'refs', 'project', 'tags',
      'dueDate', 'recurring', 'completed',
    ]

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        (data.tasks[taskIndex] as any)[field] = body[field]
      }
    })

    data.tasks[taskIndex].updatedAt = new Date().toISOString()
    if (body.status === 'Done') {
      data.tasks[taskIndex].completed = true
    }

    data.lastSync = new Date().toISOString()
    writeTasks(data)

    return NextResponse.json({ task: data.tasks[taskIndex] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const taskId = searchParams.get('id')

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID required' }, { status: 400 })
    }

    const data = readTasks()
    const initialLength = data.tasks.length
    data.tasks = data.tasks.filter((t: any) => t.id !== taskId)

    if (data.tasks.length === initialLength) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    data.lastSync = new Date().toISOString()
    writeTasks(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
