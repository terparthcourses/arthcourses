// ./(main)/student/page.tsx

"use client"

// UI Components
import Container from '@/components/container';
import { ModeToggle } from '@/components/mode-toggle';
import { UserDropdown } from '@/app/(auth)/UserDropdown';

// `CourseCard` Component
import { CourseCard } from './components/CourseCard';

// Hooks
import { useCompletions } from './hooks/useCompletions';
import { useEnrollments } from './hooks/useEnrollments';
import { usePublishedCourses } from './hooks/usePublishedCourses';

export default function Page() {
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

  // Get enrolled course IDs from enrollments
  const enrolledCourseIds = enrollments?.map((enrollment: any) => enrollment.courseId) || [];

  // Filter published courses into enrolled and unenrolled
  const enrolledCourses = publishedCourses?.filter((course: any) => enrolledCourseIds.includes(course.id)) || [];
  const unenrolledCourses = publishedCourses?.filter((course: any) => !enrolledCourseIds.includes(course.id)) || [];

  // Map `courseId` to `enrollmentId` for quick lookup
  const courseIdToEnrollmentId = enrollments?.reduce((acc: Record<string, string>, enrollment: any) => {
    acc[enrollment.courseId] = enrollment.id;
    return acc;
  }, {}) || {};

  // Helper to get completions for a course
  function getCourseCompletions(courseId: string) {
    const enrollmentId = courseIdToEnrollmentId[courseId];
    if (!enrollmentId) return [];
    return completions?.filter((c: any) => c.enrollmentId === enrollmentId) || [];
  }

  return (
    <>
      <header className="border-b border-[var(--border)]">
        <Container>
          <nav className="flex justify-between items-center py-4">
            <h1 className="text-xl font-medium flex items-center gap-4">
              Art History Courses
            </h1>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserDropdown />
            </div>
          </nav>
        </Container>
      </header>

      <main className="mb-8">
        <Container className="py-4">
          {enrolledCourses.length > 0 && (
            <section>
              <h3 className="text-xl font-medium mb-4">Enrolled Courses</h3>
              <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6 break-inside-avoid">
                {enrolledCourses.map((course: any) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    type="enrolled"
                    completions={getCourseCompletions(course.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {unenrolledCourses.length > 0 && (
            <section className="py-4">
              <h3 className="text-xl font-medium mb-4">Unenrolled Courses</h3>
              <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6 break-inside-avoid">
                {unenrolledCourses.map((course: any) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    type="unenrolled"
                  />
                ))}
              </div>
            </section>
          )}
        </Container>
      </main>
    </>
  );
}