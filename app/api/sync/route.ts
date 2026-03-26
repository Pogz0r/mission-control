import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1485079400016904253'
const TASKS_FILE = process.env.TASKS_FILE_PATH || '/data/.openclaw/workspace/automations/tasks.json'

const CHANNEL_IDS: Record<string, string> = {
  'decisions': '1486485471734534145',
  'app-ideas': '1485126619202064535',
  'dev-log': '1485126620325875733',
  'admin-commands': '1486601631440175213',
  'deep-research': '1486485471360975061',
  'content-research': '1485486866877780081',
}

function readTasks() {
  try {
    return JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
  } catch {
    return { version: '1.0', lastSync: new Date().toISOString(), channels: {}, tasks: [] }
  }
}

function writeTasks(data: any) {
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2))
}

// GET: Full bidirectional sync — pull Discord messages, update tasks.json, push task board state to dev-log
export async function GET(request: NextRequest) {
  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Discord bot token not configured' }, { status: 500 })
  }

  try {
    const data = readTasks()
    const syncReport = {
      channelsChecked: [] as string[],
      newTaskSignals: [] as any[],
      staleTasks: [] as any[],
      boardStats: {
        total: data.tasks.length,
        done: data.tasks.filter((t: any) => t.completed).length,
        active: data.tasks.filter((t: any) => !t.completed).length,
        highPriority: data.tasks.filter((t: any) => t.priority === 'High' && !t.completed).length,
      },
      lastSync: data.lastSync,
    }

    const now = Date.now()
    const staleThreshold = 24 * 60 * 60 * 1000 // 24 hours

    // Check each channel for task signals
    for (const [channelKey, channelId] of Object.entries(CHANNEL_IDS)) {
      const response = await fetch(
        `https://discord.com/api/v10/channels/${channelId}/messages?limit=10`,
        {
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) continue

      const messages = await response.json()
      syncReport.channelsChecked.push(channelKey)

      for (const msg of messages) {
        const content = msg.content.toLowerCase()
        // Detect task-like signals
        if (
          content.includes('task') ||
          content.includes('cypher') ||
          content.includes('sage:') ||
          content.includes('kent:') ||
          content.includes('done:') ||
          content.includes('blocked:')
        ) {
          // Check if we already have this Discord message linked
          const existing = data.tasks.find(
            (t: any) => t.discordMessage === msg.id && t.discordChannel === channelKey
          )

          if (!existing) {
            syncReport.newTaskSignals.push({
              channel: channelKey,
              messageId: msg.id,
              author: msg.author.username,
              preview: msg.content.substring(0, 100),
              url: `https://discord.com/channels/${GUILD_ID}/${channelId}/${msg.id}`,
            })
          }
        }
      }
    }

    // Check for stale tasks
    for (const task of data.tasks) {
      if (!task.discordMessage || task.completed) continue
      const updatedAt = new Date(task.updatedAt).getTime()
      if (now - updatedAt > staleThreshold) {
        syncReport.staleTasks.push({
          id: task.id,
          title: task.title,
          owner: task.owner,
          status: task.status,
          lastUpdated: task.updatedAt,
        })
      }
    }

    // Update lastSync
    data.lastSync = new Date().toISOString()
    writeTasks(data)

    return NextResponse.json(syncReport)
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

// POST: Trigger a board summary post to dev-log
export async function POST(request: NextRequest) {
  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Discord bot token not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { action } = body

    const data = readTasks()

    if (action === 'post-summary') {
      const total = data.tasks.length
      const done = data.tasks.filter((t: any) => t.completed).length
      const active = total - done
      const high = data.tasks.filter((t: any) => t.priority === 'High' && !t.completed).length
      const blocked = data.tasks.filter((t: any) => t.status === 'Blocked').length

      const content = [
        `**📋 Mission Control Board Summary** — ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}`,
        `Total: ${total} | Active: ${active} | Done: ${done}`,
        `High Priority: ${high} | Blocked: ${blocked}`,
        `_Auto-posted by Mission Control_`,
      ].join('\n')

      const response = await fetch(
        `https://discord.com/api/v10/channels/${CHANNEL_IDS['dev-log']}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      )

      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to post summary' }, { status: response.status })
      }

      return NextResponse.json({ success: true, posted: 'board-summary' })
    }

    if (action === 'post-stale-alert' && data.staleTasks?.length > 0) {
      const content = [
        `**🚨 Stale Task Alert** — ${data.staleTasks.length} task(s) need attention`,
        data.staleTasks.map((t: any) => `• **${t.id}** (${t.owner}) — ${t.title}`).join('\n'),
      ].join('\n')

      await fetch(
        `https://discord.com/api/v10/channels/${CHANNEL_IDS['dev-log']}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      )

      return NextResponse.json({ success: true, posted: 'stale-alert' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
