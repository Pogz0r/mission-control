'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface DiscordMessage {
  id: string
  content: string
  author: { username: string; id: string }
  timestamp: string
  channelId: string
  channelName: string
  messageUrl: string
  isCypherTask: boolean
  isDevLog: boolean
}

interface ChannelData {
  channel: string
  channelId: string
  messages: DiscordMessage[]
  count: number
}

const CHANNEL_LABELS: Record<string, string> = {
  'decisions': '#decisions',
  'app-ideas': '#app-ideas',
  'dev-log': '#dev-log',
}

const CHANNEL_COLORS: Record<string, string> = {
  'decisions': 'text-amber-400',
  'app-ideas': 'text-emerald-400',
  'dev-log': 'text-sky-400',
}

export function DiscordSync({ className = '' }) {
  const [channels, setChannels] = useState<Record<string, ChannelData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const channelKeys = ['decisions', 'app-ideas', 'dev-log']
      const results: Record<string, ChannelData> = {}

      await Promise.all(
        channelKeys.map(async (key) => {
          try {
            const response = await fetch(`/api/discord/messages?channel=${key}&limit=5`)
            if (response.ok) {
              const data = await response.json()
              results[key] = data
            }
          } catch (e) {
            console.error(`Failed to fetch ${key}:`, e)
          }
        })
      )

      setChannels(results)
      setLastSync(new Date())
    } catch (e) {
      setError('Failed to sync with Discord')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMessages, 60000)
    return () => clearInterval(interval)
  }, [])

  const getTaskStatus = (content: string) => {
    if (content.includes('✅') || content.includes('Done')) {
      return { icon: CheckCircle, color: 'text-emerald-400', label: 'Done' }
    }
    if (content.includes('Cypher Task') || content.includes('TODO')) {
      return { icon: Clock, color: 'text-amber-400', label: 'In Progress' }
    }
    if (content.includes('⚠️') || content.includes('Error')) {
      return { icon: AlertCircle, color: 'text-red-400', label: 'Blocked' }
    }
    return { icon: MessageSquare, color: 'text-zinc-400', label: 'Active' }
  }

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Discord Pipeline</h3>
            {lastSync && (
              <p className="text-xs text-zinc-500">
                Synced {lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-400 transition hover:border-zinc-600 hover:text-white disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(channels).map(([key, data]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${CHANNEL_COLORS[key]}`}>
                {CHANNEL_LABELS[key]}
              </span>
              <span className="text-xs text-zinc-600">
                ({data.count} messages)
              </span>
            </div>

            <div className="space-y-1.5">
              {data.messages.slice(0, 3).map((msg) => {
                const status = getTaskStatus(msg.content)
                const StatusIcon = status.icon
                const title = msg.content.split('\n')[0].slice(0, 60)

                return (
                  <a
                    key={msg.id}
                    href={msg.messageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950/50 p-2 text-xs transition hover:border-zinc-700"
                  >
                    <StatusIcon className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${status.color}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-zinc-300">{title}</p>
                      <p className="text-zinc-600">
                        {msg.author.username} • {new Date(msg.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {loading && Object.keys(channels).length === 0 && (
        <div className="flex items-center justify-center py-8 text-zinc-500">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Syncing with Discord...
        </div>
      )}
    </div>
  )
}
