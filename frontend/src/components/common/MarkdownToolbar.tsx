import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Link,
  Image,
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../utils/helpers'

interface MarkdownToolbarProps {
  onFormat: (format: string, options?: { before: string; after: string }) => void
}

export function MarkdownToolbar({ onFormat }: MarkdownToolbarProps) {
  const formats = [
    {
      id: 'bold',
      icon: Bold,
      label: 'Bold',
      shortcut: 'Ctrl+B',
      onClick: () => onFormat('bold', { before: '**', after: '**' }),
    },
    {
      id: 'italic',
      icon: Italic,
      label: 'Italic',
      shortcut: 'Ctrl+I',
      onClick: () => onFormat('italic', { before: '*', after: '*' }),
    },
    {
      id: 'underline',
      icon: Underline,
      label: 'Underline',
      shortcut: 'Ctrl+U',
      onClick: () => onFormat('underline', { before: '<u>', after: '</u>' }),
    },
    {
      id: 'code',
      icon: Code,
      label: 'Code',
      shortcut: 'Ctrl+`',
      onClick: () => onFormat('code', { before: '`', after: '`' }),
    },
    {
      id: 'divider1',
      isDivider: true,
    },
    {
      id: 'h1',
      icon: Heading1,
      label: 'Heading 1',
      shortcut: 'Ctrl+Alt+1',
      onClick: () => onFormat('heading1', { before: '# ', after: '' }),
    },
    {
      id: 'h2',
      icon: Heading2,
      label: 'Heading 2',
      shortcut: 'Ctrl+Alt+2',
      onClick: () => onFormat('heading2', { before: '## ', after: '' }),
    },
    {
      id: 'divider2',
      isDivider: true,
    },
    {
      id: 'quote',
      icon: Quote,
      label: 'Quote',
      shortcut: 'Ctrl+Shift+.',
      onClick: () => onFormat('quote', { before: '> ', after: '' }),
    },
    {
      id: 'ul',
      icon: List,
      label: 'Bullet List',
      shortcut: 'Ctrl+Shift+8',
      onClick: () => onFormat('ul', { before: '- ', after: '' }),
    },
    {
      id: 'ol',
      icon: ListOrdered,
      label: 'Ordered List',
      shortcut: 'Ctrl+Shift+7',
      onClick: () => onFormat('ol', { before: '1. ', after: '' }),
    },
    {
      id: 'divider3',
      isDivider: true,
    },
    {
      id: 'link',
      icon: Link,
      label: 'Link',
      shortcut: 'Ctrl+K',
      onClick: () =>
        onFormat('link', { before: '[', after: '](https://example.com)' }),
    },
    {
      id: 'image',
      icon: Image,
      label: 'Image',
      shortcut: 'Ctrl+Shift+I',
      onClick: () =>
        onFormat('image', { before: '![alt text](', after: ')' }),
    },
  ]

  return (
    <div className="flex items-center gap-0.5 p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-wrap">
      {formats.map((format) => {
        if (format.isDivider) {
          return (
            <div
              key={format.id}
              className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"
            />
          )
        }

        const Icon = format.icon as any

        return (
          <Button
            key={format.id}
            variant="ghost"
            size="sm"
            title={`${format.label} (${format.shortcut})`}
            onClick={format.onClick}
            className="h-8 w-8 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Icon className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )
}