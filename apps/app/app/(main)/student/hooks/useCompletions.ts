// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Actions
import { getCompletions } from '../actions/getCompletions';
import { markCompletionAsCompleted } from '../actions/markCompletionAsCompleted';

// Constants
import type { Completion } from '@repo/database';

export function useCompletions() {
  const queryClient = useQueryClient();

  const completionsQuery = useQuery<Completion[]>({
    queryKey: ['student-completions'],
    queryFn: getCompletions,
  });

  const markCompletionAsCompletedMutation = useMutation({
    mutationFn: markCompletionAsCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-completions'] });
    },
  });

  return {
    ...completionsQuery,
    markCompletionAsCompleted: markCompletionAsCompletedMutation,
  };
}