// Utilities
import { api } from '@/lib/api-handler';

// Types
import type { Enrollment } from '@repo/database';

export const createEnrollment = async ({ courseId }: { courseId: string }) => {
  try {
    const enrollment = await api.post<Enrollment>('/api/enrollments', { courseId });
    return enrollment;
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return null;
  }
};