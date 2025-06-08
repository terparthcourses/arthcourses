// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Actions
import { createCourse } from '../actions/createCourse';
import { getCourses } from '../actions/getCourses';
import { updateCourse } from "../actions/updateCourse";
import { deleteCourse } from "../actions/deleteCourse";
import { toggleIsPublished } from "../actions/toggleIsPublished";

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
    mutationFn: (values: CourseFormValues) => createCourse({ values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      queryClient.invalidateQueries({ queryKey: ['published-courses'] });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      values
    }: {
      courseId: string;
      values: CourseFormValues;
    }) =>
      updateCourse({
        courseId,
        values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      queryClient.invalidateQueries({ queryKey: ['published-courses'] });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: ({
      courseId
    }: {
      courseId: string;
    }) => deleteCourse({ courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      queryClient.invalidateQueries({ queryKey: ['published-courses'] });
    },
  });

  const toggleIsPublishedMutation = useMutation({
    mutationFn: ({
      courseId
    }: {
      courseId: string;
    }) => toggleIsPublished({ courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-courses'] });
      queryClient.invalidateQueries({ queryKey: ['published-courses'] });
    },
  });

  return {
    ...coursesQuery,
    createCourse: createCourseMutation,
    updateCourse: updateCourseMutation,
    deleteCourse: deleteCourseMutation,
    toggleIsPublished: toggleIsPublishedMutation,
  };
}