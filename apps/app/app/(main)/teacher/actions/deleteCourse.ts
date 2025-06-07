// Utilities
import { api } from '@/lib/api-handler'

export async function deleteCourse(courseId: string) {
  try {
    // Submit the course
    await api.delete(`/api/courses/${courseId}`)
  } catch (error) {
    console.error('Error deleting course:', error)
  }
}