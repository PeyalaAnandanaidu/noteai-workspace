import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,

      toggle: () => {
        const newDark = !get().isDark
        set({ isDark: newDark })
        applyTheme(newDark)
      },

      setDark: (dark: boolean) => {
        set({ isDark: dark })
        applyTheme(dark)
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

// Apply dark class to <html> element
function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}