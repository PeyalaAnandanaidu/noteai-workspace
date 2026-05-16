import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../store/theme.store'
import { Button } from '../ui/button'

export function ThemeToggle() {
  const { isDark, toggle } = useThemeStore()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 p-0 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  )
}