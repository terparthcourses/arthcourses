// Utilities
import { api } from '@/lib/api-handler'

// Constants
import type { CourseFormValues } from '../consants'

export async function updateCourse({
  courseId,
  values
}: {
  courseId: string;
  values: CourseFormValues;
}) {
  try {
    // Submit the course
    await api.put(`/api/courses/${courseId}`, values)
  } catch (error) {
    console.error('Error updating course:', error)
  }
}