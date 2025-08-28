// ./(main)/student/[courseId]/flashcards/layout.tsx

"use client"

// React Hooks
import { useParams } from 'next/navigation';

// UI Components
import Container from "@/components/container";
import { ModeToggle } from "@/components/mode-toggle";
import { UserDropdown } from "@/app/(auth)/UserDropdown";

// React Query Hooks
import { usePublishedCourses } from '../../hooks/usePublishedCourses';

// Constants
import { type Course, type Artwork } from "@repo/database";

// Icons
import { LoaderCircle } from "lucide-react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ courseId: string }>();

  const {
    data: publishedCourses,
    isLoading: isPublishedCoursesLoading,
    isError: isPublishedCoursesError
  } = usePublishedCourses();

  // Show loading state while data is being fetched
  if (isPublishedCoursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Show error state if data fetch failed
  if (isPublishedCoursesError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-medium text-destructive mb-2">Error loading data</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Find the current course
  const course: Course & { artworks: Artwork[] } = publishedCourses?.find(course => course.id === params.courseId) as Course & { artworks: Artwork[] };

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Course not found</h2>
          <p className="text-sm text-muted-foreground">The course you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
