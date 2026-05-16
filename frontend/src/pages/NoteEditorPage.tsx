// frontend/src/pages/NoteEditorPage.tsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {
    ArrowLeft, Sparkles, Share2, Pin, Archive,
    ArchiveRestore, Eye, Edit3, Copy, Check,
    Loader2, X, HelpCircle,
} from 'lucide-react'
import {
    useNote, useUpdateNote,
    useGenerateShareLink, useRemoveShareLink,
} from '../features/notes/hooks/useNotes'
import { useGenerateSummary } from '../features/ai/hooks/useAI'
import { useDebounce } from '../hooks/useDebounce'
import { useMarkdownFormatter } from '../hooks/useMarkdownFormatter'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useCollaboration } from '../hooks/useCollaboration'    // ✅ ADD
import { useAuthStore } from '../store/auth.store'               // ✅ ADD
import { getShareUrl } from '../utils/helpers'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Separator } from '../components/ui/separator'
import { MarkdownToolbar } from '../components/common/MarkdownToolbar'
import { ShortcutsHelp } from '../components/common/ShortcutsHelp'
import { CollaborationBar } from '../components/common/CollaborationBar' // ✅ ADD

export function NoteEditorPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    // ✅ Get current user from your auth store
    const { user } = useAuthStore()

    const { data: note, isLoading } = useNote(id!)
    const updateNote = useUpdateNote()
    const generateSummary = useGenerateSummary()
    const generateShareLink = useGenerateShareLink()
    const removeShareLink = useRemoveShareLink()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tagInput, setTagInput] = useState('')
    const [isPreview, setIsPreview] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const [isArchived, setIsArchived] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const initializedRef = useRef(false)

    const { formatText, formatLine } = useMarkdownFormatter(textareaRef)

    // ✅ Real-time collaboration
    const { activeUsers, typingUser, sendContentChange, sendTitleChange, sendTyping } =
        useCollaboration({
            noteId: id!,
            userId: user?.id ?? '',
            userName: user?.name ?? 'Anonymous',
            onContentChange: (newContent) => setContent(newContent),
            onTitleChange: (newTitle) => setTitle(newTitle),
        })

    // Sync server data to local state
    useEffect(() => {
        if (note && !initializedRef.current) {
            setTitle(note.title)
            setContent(note.content)
            setIsPinned(note.isPinned)
            setIsArchived(note.isArchived)
            initializedRef.current = true
        }
    }, [note])

    useEffect(() => {
        if (note && initializedRef.current) {
            setIsPinned(note.isPinned)
            setIsArchived(note.isArchived)
        }
    }, [note?.isPinned, note?.isArchived])

    // Debounced autosave
    const debouncedTitle = useDebounce(title, 1500)
    const debouncedContent = useDebounce(content, 1500)

    const save = useCallback(
        async (newTitle: string, newContent: string) => {
            if (!note) return
            if (newTitle === note.title && newContent === note.content) return
            setIsSaving(true)
            try {
                await updateNote.mutateAsync({
                    id: note._id,
                    data: { title: newTitle, content: newContent },
                })
            } finally {
                setIsSaving(false)
            }
        },
        [note, updateNote]
    )

    useEffect(() => {
        if (!initializedRef.current) return
        save(debouncedTitle, debouncedContent)
    }, [debouncedTitle, debouncedContent])

    useKeyboardShortcuts(
        [
            { key: 'b', ctrl: true, handler: () => formatText('**', '**', setContent) },
            { key: 'i', ctrl: true, handler: () => formatText('_', '_', setContent) },
            { key: 'u', ctrl: true, handler: () => formatText('<u>', '</u>', setContent) },
            { key: '`', ctrl: true, handler: () => formatText('`', '`', setContent) },
            { key: '1', ctrl: true, alt: true, handler: () => formatLine('# ', setContent) },
            { key: '2', ctrl: true, alt: true, handler: () => formatLine('## ', setContent) },
            { key: '.', ctrl: true, shift: true, handler: () => formatLine('> ', setContent) },
            { key: '8', ctrl: true, shift: true, handler: () => formatLine('- ', setContent) },
            { key: '7', ctrl: true, shift: true, handler: () => formatLine('1. ', setContent) },
            { key: 'k', ctrl: true, handler: () => formatText('[', '](https://example.com)', setContent) },
        ],
        !isPreview
    )

    // ── Handlers ─────────────────────────────────────────────

    const handleAddTag = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim() && note) {
            const newTags = [...(note.tags || []), tagInput.trim().toLowerCase()]
            await updateNote.mutateAsync({ id: note._id, data: { tags: newTags } })
            setTagInput('')
        }
    }

    const handleRemoveTag = async (tag: string) => {
        if (!note) return
        const newTags = note.tags.filter((t) => t !== tag)
        await updateNote.mutateAsync({ id: note._id, data: { tags: newTags } })
    }

    const handlePin = async () => {
        if (!note || isArchived) return
        const newPinned = !isPinned
        setIsPinned(newPinned)
        try {
            await updateNote.mutateAsync({ id: note._id, data: { isPinned: newPinned } })
        } catch {
            setIsPinned(!newPinned)
        }
    }

    const handleArchive = async () => {
        if (!note) return
        const newArchived = !isArchived
        setIsArchived(newArchived)
        if (newArchived) setIsPinned(false)
        try {
            await updateNote.mutateAsync({
                id: note._id,
                data: { isArchived: newArchived, ...(newArchived && { isPinned: false }) },
            })
            if (newArchived) navigate('/notes')
        } catch {
            setIsArchived(!newArchived)
            if (newArchived) setIsPinned(isPinned)
        }
    }

    const handleGenerateAI = () => {
        if (!note) return
        generateSummary.mutate(note._id)
    }

    const handleShare = async () => {
        if (!note) return
        if (note.shareId) {
            await removeShareLink.mutateAsync(note._id)
        } else {
            await generateShareLink.mutateAsync(note._id)
        }
    }

    const handleCopyLink = async () => {
        if (!note?.shareId) return
        await navigator.clipboard.writeText(getShareUrl(note.shareId))
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
    }

    const handleApplySuggestedTitle = () => {
        if (note?.aiSummary?.suggestedTitle) {
            setTitle(note.aiSummary.suggestedTitle)
        }
    }

    const handleFormat = (format: string, options?: { before: string; after: string }) => {
        if (!options) return
        if (['heading1', 'heading2', 'quote', 'ul', 'ol'].includes(format)) {
            formatLine(options.before, setContent)
        } else {
            formatText(options.before, options.after, setContent)
        }
        textareaRef.current?.focus()
    }

    // ✅ Content change — sends to socket + triggers autosave
    const handleContentChange = (value: string) => {
        setContent(value)
        sendContentChange(value)  // ✅ broadcast to others
        sendTyping()              // ✅ show typing indicator
    }

    // ✅ Title change — sends to socket + triggers autosave
    const handleTitleChange = (value: string) => {
        setTitle(value)
        sendTitleChange(value)    // ✅ broadcast to others
    }

    // ── Render ───────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
                <Skeleton className="h-8 w-full dark:bg-slate-800" />
                <Skeleton className="h-96 w-full dark:bg-slate-800" />
            </div>
        )
    }

    if (!note) {
        return (
            <div className="p-6 text-center">
                <p className="text-slate-500 dark:text-slate-400">Note not found</p>
                <Button variant="ghost" className="mt-4" onClick={() => navigate('/notes')}>
                    Back to Notes
                </Button>
            </div>
        )
    }

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">

                {/* Toolbar — unchanged */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/notes')}
                            className="gap-1 text-slate-600 dark:text-slate-400"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                        <Separator orientation="vertical" className="h-4" />
                        {isSaving ? (
                            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">Saved</span>
                        )}
                        {isArchived && (
                            <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                                Archived
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowHelp(true)}
                            className="text-slate-500 dark:text-slate-400"
                            title="Keyboard shortcuts"
                        >
                            <HelpCircle className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={isPreview ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setIsPreview(!isPreview)}
                            className="gap-1.5 text-xs"
                        >
                            {isPreview ? (
                                <><Edit3 className="w-3.5 h-3.5" />Edit</>
                            ) : (
                                <><Eye className="w-3.5 h-3.5" />Preview</>
                            )}
                        </Button>
                        {!isArchived && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handlePin}
                                title={isPinned ? 'Unpin note' : 'Pin note'}
                                className={isPinned ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'}
                            >
                                <Pin className={`w-4 h-4 ${isPinned ? 'fill-violet-600 dark:fill-violet-400' : ''}`} />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleArchive}
                            title={isArchived ? 'Unarchive note' : 'Archive note'}
                            className={isArchived ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}
                        >
                            {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleGenerateAI}
                            disabled={generateSummary.isPending}
                            className="gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950"
                        >
                            {generateSummary.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium">AI Summary</span>
                        </Button>
                        <Button
                            variant={note.isPublic ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={handleShare}
                            className="gap-1.5 text-xs"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {note.isPublic ? 'Shared' : 'Share'}
                        </Button>
                    </div>
                </div>

                {/* Markdown Toolbar */}
                {!isPreview && <MarkdownToolbar onFormat={handleFormat} />}

                {/* ✅ Collaboration Bar — shows active users + typing */}
                <CollaborationBar
                    activeUsers={activeUsers}
                    typingUser={typingUser}
                />

                {/* Share Link Bar */}
                {note.shareId && (
                    <div className="flex items-center gap-2 px-6 py-2 bg-violet-50 dark:bg-violet-950 border-b border-violet-100 dark:border-violet-900">
                        <span className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                            Public link:
                        </span>
                        <code className="text-xs text-violet-600 dark:text-violet-400 flex-1 truncate">
                            {getShareUrl(note.shareId)}
                        </code>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-violet-600 dark:text-violet-400"
                            onClick={handleCopyLink}
                        >
                            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                    </div>
                )}

                {/* Editor Content */}
                <div className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900">
                    <input
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)} // ✅ updated
                        placeholder="Untitled Note"
                        className="w-full text-3xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none outline-none bg-transparent resize-none mb-4"
                    />

                    <div className="flex items-center gap-2 mb-6 flex-wrap">
                        {note.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="gap-1 pr-1 text-xs dark:bg-slate-800 dark:text-slate-300"
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="ml-0.5 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add tag (press Enter)..."
                            className="text-xs text-slate-500 dark:text-slate-400 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none outline-none bg-transparent w-40"
                        />
                    </div>

                    {isPreview ? (
                        <div className="prose dark:prose-invert prose-slate max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}   // ✅ MUST BE HERE
                            >
                                {content || '*No content yet...*'}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => handleContentChange(e.target.value)} // ✅ updated
                            placeholder="Start writing... (Markdown supported)"
                            className="w-full min-h-[60vh] text-slate-700 dark:text-slate-300 text-sm leading-relaxed border-none outline-none bg-transparent resize-none font-mono placeholder:text-slate-300 dark:placeholder:text-slate-700"
                        />
                    )}
                </div>
            </div>

            {/* AI Panel — unchanged */}
            {note.aiSummary && (
                <div className="w-72 border-l border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-auto shrink-0">
                    <div className="p-4">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-4">
                            <Sparkles className="w-4 h-4 text-violet-500" />
                            AI Insights
                        </h3>
                        <div className="mb-4">
                            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                Summary
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                {note.aiSummary.summary}
                            </p>
                        </div>
                        {note.aiSummary.actionItems?.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Action Items
                                </h4>
                                <ul className="space-y-1.5">
                                    {note.aiSummary.actionItems.map((item, i) => (
                                        <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                            <span className="w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs flex items-center justify-center shrink-0 mt-0.5 font-medium">
                                                {i + 1}
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {note.aiSummary.suggestedTitle && note.aiSummary.suggestedTitle !== title && (
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    Suggested Title
                                </h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-slate-700 dark:text-slate-300 flex-1 italic">
                                        "{note.aiSummary.suggestedTitle}"
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-violet-600 dark:text-violet-400 px-2 h-7"
                                        onClick={handleApplySuggestedTitle}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ShortcutsHelp open={showHelp} onOpenChange={setShowHelp} />
        </div>
    )
}