// ./(main)/student/page.tsx

"use client"

// UI Components
import Container from '@/components/container';

// `CourseCard` Component
import { CourseCard } from './components/CourseCard';

// Hooks
import { usePublishedCourses } from './hooks/usePublishedCourses';

export default function Page() {
  const {
    data: publishedCourses,
    isLoading: isPublishedCoursesLoading,
    isError: isPublishedCoursesError
  } = usePublishedCourses();

  return (
    <>
      <header>
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Available Courses</h2>
          </div>
        </Container>
      </header>

      <main className="mb-16">
        <Container>
          {publishedCourses && publishedCourses.length > 0 && (
            <div className="columns-1 lg:columns-2 xl:columns-3 gap-6 space-y-6 break-inside-avoid">
              {publishedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollmentStatus="unenrolled"
                />
              ))}
            </div>
          )}
        </Container>
      </main>
    </>
  );
}