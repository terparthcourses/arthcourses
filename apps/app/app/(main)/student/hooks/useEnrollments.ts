// React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Actions
import { createEnrollment } from '../actions/createEnrollment';
import { getEnrollments } from '../actions/getEnrollments';

// Types
import { type Enrollment } from '@repo/database';

export function useEnrollments() {
  const queryClient = useQueryClient();

  const enrollmentsQuery = useQuery<Enrollment[]>({
    queryKey: ['student-enrollments'],
    queryFn: () => getEnrollments(),
  });

  const createEnrollmentMutation = useMutation({
    mutationFn: ({ courseId }: { courseId: string }) => createEnrollment({ courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
    },
  });

  return {
    ...enrollmentsQuery,
    createEnrollment: createEnrollmentMutation,
  };
}
