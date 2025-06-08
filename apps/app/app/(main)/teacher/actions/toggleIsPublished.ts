// Utilities
import { api } from '@/lib/api-handler';

export async function toggleIsPublished({
  courseId
}: {
  courseId: string;
}) {
  try {
    await api.put(`/api/courses/${courseId}/is-published`);
  } catch (error) {
    throw error;
  }
} 