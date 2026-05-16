import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookOpen, Sparkles, Clock } from 'lucide-react';
import { notesService } from '../services/notes.service';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { timeAgo } from '../utils/helpers';

export function SharedNotePage() {
  const { shareId } = useParams<{ shareId: string }>();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['shared-note', shareId],
    queryFn: () => notesService.getSharedNote(shareId!),
    enabled: !!shareId,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900">NoteAI</span>
          </Link>
          <Link
            to="/signup"
            className="text-sm text-violet-600 font-medium hover:underline"
          >
            Create your own notes →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Note not found
            </h1>
            <p className="text-slate-500">
              This note doesn't exist or is no longer public.
            </p>
          </div>
        )}

        {note && (
          <article>
            {/* Note Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {note.title || 'Untitled Note'}
              </h1>

              <div className="flex items-center gap-3 flex-wrap">
                {note.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  Updated {timeAgo(note.updatedAt)}
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {note.content || '*This note has no content.*'}
                </ReactMarkdown>
              </div>
            </div>

            {/* AI Summary (if exists) */}
            {note.aiSummary && (
              <div className="bg-violet-50 rounded-xl border border-violet-100 p-5">
                <h2 className="font-semibold text-sm text-violet-900 flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  AI Summary
                </h2>

                <p className="text-sm text-violet-800 leading-relaxed mb-4">
                  {note.aiSummary.summary}
                </p>

                {note.aiSummary.actionItems?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-2">
                      Action Items
                    </h3>
                    <ul className="space-y-1">
                      {note.aiSummary.actionItems.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-violet-800 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        )}
      </main>
    </div>
  );
}