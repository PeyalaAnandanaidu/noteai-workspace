import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Archive,
  LogOut,
  BookOpen,
  PlusCircle,
} from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { useThemeStore } from '../store/theme.store'
import { useCreateNote } from '../features/notes/hooks/useNotes'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/common/ThemeToggle'
import { cn } from '../utils/helpers'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/archive', icon: Archive, label: 'Archive' },
]

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const { isDark, setDark } = useThemeStore()
  const navigate = useNavigate()
  const createNote = useCreateNote()

  // ✅ Sync theme on mount
  useEffect(() => {
    setDark(isDark)
  }, [])

  const handleNewNote = async () => {
    const note = await createNote.mutateAsync({})
    navigate(`/notes/${note._id}`)
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">

        {/* Logo */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              NoteAI
            </span>
          </div>
        </div>

        {/* New Note Button */}
        <div className="p-3">
          <Button
            onClick={handleNewNote}
            disabled={createNote.isPending}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2"
            size="sm"
          >
            <PlusCircle className="w-4 h-4" />
            New Note
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: Theme toggle + user */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">

          {/* Theme Toggle Row */}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Dark mode
            </span>
            <ThemeToggle />
          </div>

          {/* User info */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center text-xs font-semibold text-violet-700 dark:text-violet-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-950">
        <Outlet />
      </main>
    </div>
  )
}