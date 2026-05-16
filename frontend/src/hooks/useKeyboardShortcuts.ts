import { useEffect } from 'react'

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  handler: () => void
}

export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey

      for (const shortcut of shortcuts) {
        const keyMatch =
          e.key.toLowerCase() === shortcut.key.toLowerCase()

        const ctrlMatch =
          shortcut.ctrl === undefined || shortcut.ctrl === ctrlKey

        const shiftMatch =
          shortcut.shift === undefined || shortcut.shift === e.shiftKey

        const altMatch =
          shortcut.alt === undefined || shortcut.alt === e.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled])
}