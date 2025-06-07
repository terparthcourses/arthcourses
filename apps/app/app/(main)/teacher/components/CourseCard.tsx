"use client";

// React Hooks
import { useState } from "react";

// Utilities
import { cn } from "@/lib/clsx-handler";

// UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Constants
import { type Course, type Artwork } from "@repo/database";

// Lucide Icons
import {
  ClockIcon,
  PencilIcon,
  PaletteIcon,
  UserIcon,
  Trash2Icon,
} from "lucide-react";

interface CourseCardProps {
  course: Course & { artworks?: Artwork[] };
  onDelete?: ({
    course
  }: {
    course: Course;
  }) => void;
}

export function CourseCard({ course, onDelete }: CourseCardProps) {
  const {
    id,
    title,
    description,
    artworks = [],
    updatedAt,
    createdAt
  } = course

  // State for alert dialog
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const handleDelete = () => {
    setIsAlertDialogOpen(false)
    onDelete?.({ course })
  }

  const formattedDate = (date?: Date | string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "N/A"

  return (
    <>
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
                {artworks.length} artwork{artworks.length > 1 ? "s" : ""}
              </Badge>
            </h4>

            {artworks.length > 0 ? (
              <div className="space-y-2">
                {artworks.slice(0, 3).map((art) => (
                  <div
                    key={art.id}
                    className="flex w-full items-center gap-2 rounded-md border border-[var(--border)] bg-card px-3 py-2"
                  >
                    {art.images?.length ? (
                      <img
                        src={art.images[0]}
                        alt={art.title}
                        className="size-12 rounded border border-[var(--border)] object-cover"
                      />
                    ) : (
                      <div className="size-12 flex items-center justify-center rounded border border-[var(--border)] bg-muted">
                        <PaletteIcon className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 flex flex-col gap-0.25">
                      <span className="truncate text-sm font-medium">{art.title}</span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <UserIcon className="size-3" />
                        <span className="truncate">{art.author}</span>
                      </div>
                      <span className="line-clamp-1 text-xs text-muted-foreground">{art.description}</span>
                    </div>
                  </div>
                ))}
                {artworks.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    +{artworks.length - 3} more artworks
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No artworks assigned</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="mr-1 h-3.5 w-3.5" />
            Last updated {formattedDate(updatedAt)}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
              onClick={() => setIsAlertDialogOpen(true)}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete artwork
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
