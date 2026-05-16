import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useThemeStore } from '../store/theme.store'
import { ThemeToggle } from '../components/common/ThemeToggle'

export function AuthLayout() {
  const { isDark, setDark } = useThemeStore()

  useEffect(() => {
    setDark(isDark)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">

      {/* Theme toggle top right */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            NoteAI
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}