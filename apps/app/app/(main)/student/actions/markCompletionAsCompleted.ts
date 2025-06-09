// Utilities
import { api } from '@/lib/api-handler';

// Constants
import type { Completion } from '@repo/database';

export async function markCompletionAsCompleted(completionId: string) {
  try {
    const completion = await api.put<Completion>(`/api/completions/${completionId}/complete`);
    return completion;
  } catch (error) {
    console.error('Error marking completion as completed:', error);
    throw error;
  }
}
