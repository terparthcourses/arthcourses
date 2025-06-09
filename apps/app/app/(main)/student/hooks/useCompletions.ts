// React Query
import { useQuery } from '@tanstack/react-query';

// Actions
import { getCompletions } from '../actions/getCompletions';

// Constants
import type { Completion } from '@repo/database';

export function useCompletions() {
  return useQuery<Completion[]>({
    queryKey: ['student-completions'],
    queryFn: getCompletions,
  });
}