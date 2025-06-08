// Utilities
import { api } from '@/lib/api-handler';

// Types
import type { Enrollment } from '@repo/database';

export async function getEnrollments() {
  try {
    const enrollments = await api.get<Enrollment[]>('/api/enrollments');
    return enrollments;
  } catch (error) {
    console.error('Error getting enrollments:', error);
    return [];
  }
}
