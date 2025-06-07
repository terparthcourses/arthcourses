// Utilities
import { api } from '@/lib/api-handler'

// Constants
import type { Course } from "@repo/database"

export async function getCourses() {
  try {
    const courses = await api.get<Course[]>('/api/courses')
    return courses
  } catch (error) {
    console.error('Error getting courses:', error)
    return []
  }
}
