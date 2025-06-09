// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Actions
import { getPublishedCourses } from '../actions/getPublishedCourses';

// Constants
import { type Course } from '@repo/database';

export function usePublishedCourses() {
  const publishedCoursesQuery = useQuery<Course[]>({
    queryKey: ['published-courses'],
    queryFn: () => getPublishedCourses(),
  });

  return {
    ...publishedCoursesQuery,
  };
}