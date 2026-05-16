import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '../../../services/notes.service';
import { Note } from '../../../types';
import { useToast } from '../../../components/ui/use-toast';

// Query keys — centralized to avoid typos and enable targeted invalidation
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: object) => [...noteKeys.lists(), filters] as const,
  detail: (id: string) => [...noteKeys.all, 'detail', id] as const,
};

interface NotesQuery {
  search?: string;
  tags?: string;
  archived?: boolean;
}

export function useNotes(query: NotesQuery = {}) {
  return useQuery({
    queryKey: noteKeys.list(query),
    queryFn: () => notesService.getNotes(query),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesService.getNoteById(id),
    enabled: !!id, // Only fetch if id exists
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesService.createNote,
    onSuccess: () => {
      // Invalidate notes list so it refetches
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) =>
      notesService.updateNote(id, data),
    onSuccess: (updatedNote) => {
      // Optimistic update — update cache immediately
      queryClient.setQueryData(noteKeys.detail(updatedNote._id), updatedNote);
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: notesService.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
      toast({ title: 'Note deleted' });
    },
  });
}

export function useGenerateShareLink() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: notesService.generateShareLink,
    onSuccess: (shareId, noteId) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(noteId) });
      toast({ title: 'Share link generated!' });
    },
  });
}

export function useRemoveShareLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesService.removeShareLink,
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(noteId) });
    },
  });
}