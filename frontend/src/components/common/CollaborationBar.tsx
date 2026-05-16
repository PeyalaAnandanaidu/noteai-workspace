// frontend/src/components/common/CollaborationBar.tsx

import { Users } from 'lucide-react'

interface CollabUser {
  userId: string
  name: string
}

interface CollaborationBarProps {
  activeUsers: CollabUser[]
  typingUser: string | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Generate consistent color per user
const COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-cyan-500',
]

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function CollaborationBar({
  activeUsers,
  typingUser,
}: CollaborationBarProps) {
  if (activeUsers.length === 0 && !typingUser) return null

  return (
    <div className="flex items-center gap-3 px-6 py-1.5 bg-violet-50 dark:bg-violet-950/40 border-b border-violet-100 dark:border-violet-900">
      {/* Active users avatars */}
      {activeUsers.length > 0 && (
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
          <div className="flex -space-x-1.5">
            {activeUsers.slice(0, 5).map((user) => (
              <div
                key={user.userId}
                title={user.name}
                className={`w-6 h-6 rounded-full ${getColor(user.name)} flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white dark:ring-slate-900`}
              >
                {getInitials(user.name)}
              </div>
            ))}
            {activeUsers.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-semibold ring-2 ring-white dark:ring-slate-900">
                +{activeUsers.length - 5}
              </div>
            )}
          </div>
          <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
            {activeUsers.length === 1
              ? `${activeUsers[0].name} is also editing`
              : `${activeUsers.length} others editing`}
          </span>
        </div>
      )}

      {/* Typing indicator */}
      {typingUser && (
        <span className="text-xs text-violet-500 dark:text-violet-400 flex items-center gap-1">
          <span className="flex gap-0.5">
            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 bg-violet-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
          {typingUser} is typing...
        </span>
      )}
    </div>
  )
}