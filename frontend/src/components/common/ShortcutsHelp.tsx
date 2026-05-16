import { HelpCircle, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface ShortcutsHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  const shortcuts = [
    { category: 'Text Formatting', items: [
      { keys: 'Ctrl+B', action: 'Bold' },
      { keys: 'Ctrl+I', action: 'Italic' },
      { keys: 'Ctrl+U', action: 'Underline' },
      { keys: 'Ctrl+`', action: 'Code' },
    ]},
    { category: 'Headings', items: [
      { keys: 'Ctrl+Alt+1', action: 'Heading 1' },
      { keys: 'Ctrl+Alt+2', action: 'Heading 2' },
      { keys: 'Ctrl+Alt+3', action: 'Heading 3' },
    ]},
    { category: 'Lists & Quotes', items: [
      { keys: 'Ctrl+Shift+8', action: 'Bullet List' },
      { keys: 'Ctrl+Shift+7', action: 'Ordered List' },
      { keys: 'Ctrl+Shift+.', action: 'Quote' },
    ]},
    { category: 'Links & Media', items: [
      { keys: 'Ctrl+K', action: 'Link' },
      { keys: 'Ctrl+Shift+I', action: 'Image' },
    ]},
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="dark:text-slate-100">
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {shortcuts.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 text-sm uppercase tracking-wider">
                {group.category}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => (
                  <div
                    key={item.keys}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.action}
                    </span>
                    <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-700 dark:text-slate-300">
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}