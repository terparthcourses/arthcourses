// Utilities
import { api } from '@/lib/api-handler'

// Constants
import type { CourseFormValues } from '../consants'

export async function createCourse(values: CourseFormValues) {
  try {
    // Submit the course
    await api.post(`/api/courses`, values)
  } catch (error) {
    console.error('Error creating course:', error)
  }
}