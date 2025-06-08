// Utilities
import { api } from '@/lib/api-handler';

// Constants
import type { Course } from "@repo/database";

export async function getPublishedCourses() {
  try {
    const courses = await api.get<Course[]>('/api/courses/published');
    console.log("inside getPublishedCourses", courses);
    return courses;
  } catch (error) {
    console.error('Error getting published courses:', error);
    return [];
  }
}
