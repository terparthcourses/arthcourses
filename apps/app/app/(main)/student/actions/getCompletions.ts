// Utilities
import { api } from '@/lib/api-handler';

// Constants
import type { Completion } from '@repo/database';

export async function getCompletions() {
  try {
    const completions = await api.get<Completion[]>('/api/completions');
    return completions;
  } catch (error) {
    console.error('Error getting completions:', error);
    return [];
  }
}
