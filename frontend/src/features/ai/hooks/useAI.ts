import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiService } from '../../../services/ai.service';
import { noteKeys } from '../../notes/hooks/useNotes';
import { useToast } from '../../../components/ui/use-toast';

export function useGenerateSummary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: aiService.generateSummary,
    onSuccess: (summary, noteId) => {
      // Update the cached note with the new AI summary
      queryClient.invalidateQueries({ queryKey: noteKeys.detail(noteId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast({
        title: '✨ AI Summary generated',
        description: 'Your note has been analyzed successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'AI generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}