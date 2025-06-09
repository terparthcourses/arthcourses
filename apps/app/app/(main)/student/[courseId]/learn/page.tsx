// ./(main)/student/[courseId]/learn/page.tsx

"use client";

// Next.js Hooks
import { useParams } from "next/navigation";

// React Query Hooks
import { useEnrollments } from "@/app/(main)/student/hooks/useEnrollments";
import { useCompletions } from "@/app/(main)/student/hooks/useCompletions";
import { usePublishedCourses } from "@/app/(main)/student/hooks/usePublishedCourses";

// Constants
import { type Course, type Artwork } from "@repo/database";

export default function Page() {
  const params = useParams();
  const courseId = params.courseId as string;

  const {
    data: completions,
    isLoading: isCompletionsLoading,
    isError: isCompletionsError
  } = useCompletions();

  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
    createEnrollment
  } = useEnrollments();

  const {
    data: publishedCourses,
    isLoading: isPublishedCoursesLoading,
    isError: isPublishedCoursesError
  } = usePublishedCourses();

  // Find the current course
  const course: Course & { artworks: Artwork[] } = publishedCourses?.find(course => course.id === courseId) as Course & { artworks: Artwork[] };

  return (
    <div>
      <h1>Learn</h1>
    </div>
  );
}