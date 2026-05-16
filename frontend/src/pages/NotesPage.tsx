import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Pin, Archive, Plus, Tag, X } from 'lucide-react'
import {
  useNotes,
  useDeleteNote,
  useUpdateNote,
} from '../features/notes/hooks/useNotes'
import { useCreateNote } from '../features/notes/hooks/useNotes'
import { useDebounce } from '../hooks/useDebounce'
import { Note } from '../types'
import { timeAgo, truncate, stripMarkdown } from '../utils/helpers'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, Sparkles } from 'lucide-react'

export function NotesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const isArchive = location.pathname === '/archive'

  const [search, setSearch] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  const debouncedSearch = useDebounce(search, 400)

  const { data, isLoading } = useNotes({
    search: debouncedSearch,
    tags: selectedTag || undefined,
    archived: isArchive,
  })

  const createNote = useCreateNote()
  const deleteNote = useDeleteNote()
  const updateNote = useUpdateNote()

  const handleNewNote = async () => {
    const note = await createNote.mutateAsync({})
    navigate(`/notes/${note._id}`)
  }

  const handlePin = (note: Note, e: React.MouseEvent) => {
    e.preventDefault()
    updateNote.mutate({ id: note._id, data: { isPinned: !note.isPinned } })
  }

  const handleArchive = (note: Note, e: React.MouseEvent) => {
    e.preventDefault()
    updateNote.mutate({ id: note._id, data: { isArchived: !note.isArchived } })
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (confirm('Delete this note permanently?')) {
      deleteNote.mutate(id)
    }
  }

  // Collect all unique tags for filter UI
  const allTags = Array.from(
    new Set(data?.notes.flatMap((n) => n.tags) || [])
  )

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isArchive ? 'Archive' : 'Notes'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {data?.pagination.total || 0}{' '}
            {isArchive ? 'archived notes' : 'notes'}
          </p>
        </div>
        {!isArchive && (
          <Button
            onClick={handleNewNote}
            disabled={createNote.isPending}
            className="bg-violet-600 hover:bg-violet-700 gap-2"
            size="sm"
          >
            <Plus className="w-4 h-4" />
            New Note
          </Button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSelectedTag(selectedTag === tag ? '' : tag)
                }
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  selectedTag === tag
                    ? 'bg-violet-100 dark:bg-violet-950 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-200 dark:hover:border-violet-800'
                }`}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 dark:bg-slate-800" />
          ))}
        </div>
      ) : data?.notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Archive className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-1">
            {search || selectedTag ? 'No matching notes' : 'No notes yet'}
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            {search || selectedTag
              ? 'Try different search terms'
              : 'Create your first note to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onPin={handlePin}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Note Card Component
function NoteCard({
  note,
  onPin,
  onArchive,
  onDelete,
}: {
  note: Note
  onPin: (note: Note, e: React.MouseEvent) => void
  onArchive: (note: Note, e: React.MouseEvent) => void
  onDelete: (id: string, e: React.MouseEvent) => void
}) {
  const preview = stripMarkdown(note.content)

  return (
    <Link to={`/notes/${note._id}`}>
      <div className="group h-44 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/30 transition-all flex flex-col cursor-pointer">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight line-clamp-2 flex-1">
            {note.title || 'Untitled Note'}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            {note.isPinned && (
              <Pin className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 fill-violet-500 dark:fill-violet-400" />
            )}
            {note.aiSummary && (
              <span
                className="text-xs"
                title="Has AI summary"
              >
                ✨
              </span>
            )}
            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 dark:bg-slate-800 dark:border-slate-700"
              >
                <DropdownMenuItem
                  onClick={(e) => onPin(note, e as any)}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
                >
                  <Pin className="w-3.5 h-3.5 mr-2" />
                  {note.isPinned ? 'Unpin' : 'Pin'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => onArchive(note, e as any)}
                  className="dark:text-slate-300 dark:focus:bg-slate-700"
                >
                  <Archive className="w-3.5 h-3.5 mr-2" />
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => onDelete(note._id, e as any)}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 dark:focus:bg-slate-700"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Preview */}
        <p className="text-xs text-slate-500 dark:text-slate-400 flex-1 line-clamp-3 leading-relaxed">
          {preview || 'No content yet...'}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
          <div className="flex gap-1 flex-wrap">
            {note.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-1.5 py-0 h-4 dark:bg-slate-800 dark:text-slate-300"
              >
                {tag}
              </Badge>
            ))}
            {note.tags.length > 2 && (
              <span className="text-xs text-slate-400 dark:text-slate-500">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {timeAgo(note.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}