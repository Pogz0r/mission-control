import { NextRequest, NextResponse } from 'next/server'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID || '1485079400016904253'

const CHANNEL_IDS: Record<string, string> = {
  'decisions': '1486485471734534145',
  'app-ideas': '1485126619202064535',
  'dev-log': '1485126620325875733',
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const channelKey = searchParams.get('channel') || 'decisions'
  const limit = parseInt(searchParams.get('limit') || '10')

  const channelId = CHANNEL_IDS[channelKey] || CHANNEL_IDS['decisions']

  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'Discord bot token not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      return NextResponse.json(
        { error: 'Failed to fetch Discord messages', details: error },
        { status: response.status }
      )
    }

    const messages = await response.json()

    // Transform messages to a cleaner format
    const transformed = messages.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      author: {
        username: msg.author.username,
        id: msg.author.id,
      },
      timestamp: msg.timestamp,
      channelId: msg.channel_id,
      channelName: channelKey,
      messageUrl: `https://discord.com/channels/${GUILD_ID}/${channelId}/${msg.id}`,
      isCypherTask: msg.content.includes('Cypher Task'),
      isDevLog: msg.content.includes('Cypher Dev Log'),
      mentions: msg.mentions?.map((m: any) => m.username) || [],
    }))

    return NextResponse.json({
      channel: channelKey,
      channelId,
      messages: transformed,
      count: transformed.length,
    })
  } catch (error) {
    console.error('Discord API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
