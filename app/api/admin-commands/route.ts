import { NextRequest, NextResponse } from 'next/server'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const ADMIN_CHANNEL_ID = process.env.ADMIN_CHANNEL_ID || '1486601631440175213'
const DEVLOG_CHANNEL_ID = process.env.DEVLOG_CHANNEL_ID || '1485126620325875733'
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1485079400016904253'

// GET: Fetch messages from admin-commands channel
export async function GET(request: NextRequest) {
  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Discord bot token not configured' }, { status: 500 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const response = await fetch(
      `https://discord.com/api/v10/channels/${ADMIN_CHANNEL_ID}/messages?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch admin commands' }, { status: response.status })
    }

    const messages = await response.json()

    const transformed = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      author: { username: msg.author.username, id: msg.author.id },
      timestamp: msg.timestamp,
      command: parseCommand(msg.content),
      messageUrl: `https://discord.com/channels/${GUILD_ID}/${ADMIN_CHANNEL_ID}/${msg.id}`,
    }))

    return NextResponse.json({ messages: transformed, count: transformed.length })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Process a command (done, blocked, priority, assign, new, remove)
// Body: { action: 'done'|'blocked'|'priority'|'assign'|'new'|'remove', taskId?, title?, owner?, priority?, channel? }
export async function POST(request: NextRequest) {
  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json({ error: 'Discord bot token not configured' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { action, taskId, title, owner, priority, channel, status } = body

    // Build command string for Discord
    let cmd = ''
    switch (action) {
      case 'done':
        cmd = `done ${taskId}`
        break
      case 'blocked':
        cmd = `blocked ${taskId}`
        break
      case 'priority':
        cmd = `priority ${taskId} ${priority}`
        break
      case 'assign':
        cmd = `assign ${taskId} ${owner}`
        break
      case 'new':
        cmd = `new ${title} | owner:${owner || 'Kent'} priority:${priority || 'Medium'} channel:${channel || 'app-ideas'}`
        break
      case 'remove':
        cmd = `remove ${taskId}`
        break
      case 'status':
        cmd = `status ${taskId} ${status}`
        break
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    // Post command to admin-commands channel
    const postResponse = await fetch(
      `https://discord.com/api/v10/channels/${ADMIN_CHANNEL_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: cmd }),
      }
    )

    if (!postResponse.ok) {
      return NextResponse.json({ error: 'Failed to post command' }, { status: postResponse.status })
    }

    const posted = await postResponse.json()

    // Post acknowledgment to dev-log
    await fetch(
      `https://discord.com/api/v10/channels/${DEVLOG_CHANNEL_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: `Cypher Dev Log: Command queued → ${action}${taskId ? ' ' + taskId : ''}` }),
      }
    )

    return NextResponse.json({
      success: true,
      command: cmd,
      messageId: posted.id,
      messageUrl: `https://discord.com/channels/${GUILD_ID}/${ADMIN_CHANNEL_ID}/${posted.id}`,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function parseCommand(content: string): { type: string; taskId?: string; args?: string[] } | null {
  const trimmed = content.trim().toLowerCase()

  if (/^done\s+task-\d+/.test(trimmed)) {
    return { type: 'done', taskId: content.match(/task-\d+/)?.[0] || '' }
  }
  if (/^blocked\s+task-\d+/.test(trimmed)) {
    return { type: 'blocked', taskId: content.match(/task-\d+/)?.[0] || '' }
  }
  if (/^priority\s+task-\d+/.test(trimmed)) {
    const match = content.match(/task-\d+/g)
    return { type: 'priority', taskId: match?.[0] || '', args: match?.slice(1) }
  }
  if (/^assign\s+task-\d+/.test(trimmed)) {
    return { type: 'assign', taskId: content.match(/task-\d+/)?.[0] || '', args: [content.split(/\s+/)[2]] }
  }
  if (/^new\s+/.test(trimmed)) {
    return { type: 'new', args: [content.replace(/^new\s+/i, '')] }
  }
  if (/^remove\s+task-\d+/.test(trimmed)) {
    return { type: 'remove', taskId: content.match(/task-\d+/)?.[0] || '' }
  }
  if (/^status\s+task-\d+/.test(trimmed)) {
    const parts = content.split(/\s+/)
    return { type: 'status', taskId: parts[1], args: [parts[2]] }
  }

  return null
}
