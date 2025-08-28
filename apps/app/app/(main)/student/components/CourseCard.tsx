"use client";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Next.js Hooks
import { useRouter } from "next/navigation";

// React Query Hooks
import { useEnrollments } from '../hooks/useEnrollments';

// Constants
import { type Course, type Artwork, type Completion } from "@repo/database";

// Icons
import {
  ArrowRightIcon,
  ClockIcon,
  GraduationCapIcon,
  PaletteIcon,
  UserIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";

interface CourseCardProps {
  course: Course & { artworks?: Artwork[], studentsEnrolled: number };
  type: "enrolled" | "unenrolled";
  completions?: Completion[];
}

export function CourseCard({ course, type, completions = [] }: CourseCardProps) {
  const router = useRouter();

  const {
    title,
    description,
    artworks = [],
  } = course;

  const {
    createEnrollment
  } = useEnrollments();

  const isEnrolled = type === "enrolled";
  const progress = isEnrolled && completions.length > 0
    ? Math.round((completions.filter(c => c.isCompleted).length / completions.length) * 100)
    : 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="py-6">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow px-6">
        <div>
          <h4 className="mb-2 flex items-center justify-between gap-2 text-md font-medium text-foreground">
            Artworks
            <Badge className="bg-primary/10 text-primary h-5 min-w-5 rounded-sm px-1 text-xs tabular-nums">
              {artworks.length} artwork{artworks.length !== 1 ? "s" : ""}
            </Badge>
          </h4>
          {artworks.length > 0 ? (
            <div className="space-y-2">
              {artworks.slice(0, 3).map((artwork) => (
                <div
                  key={artwork.id}
                  className="flex w-full items-center gap-2 rounded-md border border-[var(--border)] bg-card px-3 py-2"
                >
                  {artwork.images?.[0] ? (
                    <img
                      src={artwork.images[0]}
                      alt={artwork.title}
                      className="size-12 rounded border border-[var(--border)] object-cover"
                    />
                  ) : (
                    <div className="size-12 flex items-center justify-center rounded border border-[var(--border)] bg-muted">
                      <PaletteIcon className="size-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 flex flex-col gap-0.25">
                    <span className="truncate text-sm font-medium">{artwork.title}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <UserIcon className="size-3" />
                      <span className="truncate">{artwork.author}</span>
                    </div>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {artwork.description}
                    </span>
                  </div>
                </div>
              ))}
              {artworks.length > 3 && (
                <p className="text-sm text-muted-foreground">
                  +{artworks.length - 3} more artwork{artworks.length - 3 !== 1 ? "s" : ""}
                </p>
              )}
            </div>) : (
            <p className="text-sm text-muted-foreground">No artworks assigned</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t px-6 py-4">
        {isEnrolled ? (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ClockIcon className="h-3.5 w-3.5 mr-0.5" />
              {progress}% completed
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => router.push(`/student/${course.id}/flashcards`)}
              >
                <ZapIcon className="h-3.5 w-3.5 mr-1" />
                Flashcards
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => router.push(`/student/${course.id}/learn`)}
              >
                Continue Learning
                <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <UsersIcon className="h-3.5 w-3.5 mr-0.5" />
              {course.studentsEnrolled} student{course.studentsEnrolled !== 1 ? "s" : ""}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => router.push(`/student/${course.id}/flashcards`)}
              >
                <ZapIcon className="h-3.5 w-3.5 mr-1" />
                Preview Flashcards
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs"
                onClick={() => createEnrollment.mutate({ courseId: course.id })}
              >
                <GraduationCapIcon className="h-3.5 w-3.5" />
                Enroll
              </Button>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
