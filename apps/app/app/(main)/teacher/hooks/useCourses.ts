// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Actions
import { createCourse } from '../actions/createCourse';
import { getCourses } from '../actions/getCourses';

// Constants
import { type CourseFormValues } from '../consants';
import { type Course } from '@repo/database';

export function useCourses() {
  const queryClient = useQueryClient();

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['teacher-courses'],
    queryFn: () => getCourses(),
  });

  const createCourseMutation = useMutation({
    mutationFn: (values: CourseFormValues) => createCourse(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
    },
  });

  return {
    ...coursesQuery,
    createCourse: createCourseMutation,
  };
}