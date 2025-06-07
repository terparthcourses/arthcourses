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
  } = course;

  // State for alert dialog
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);


  // Handle alert dialog action
  const handleAlertDialogAction = () => {
    setIsAlertDialogOpen(false);
    // TODO: Delete course
  };

  // Handle alert dialog cancel
  const handleAlertDialogCancel = () => {
    setIsAlertDialogOpen(false);
  };


  const formattedDate = (date?: Date | string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "N/A";

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden">
        <CardHeader className="py-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow px-6">
          <div>
            <h4 className="text-md font-medium text-foreground mb-2 flex items-center justify-between gap-2">
              Artworks
              <Badge className="h-5 min-w-5 rounded-sm px-1 text-xs tabular-nums bg-primary/10 text-primary">
                {artworks.length} artworks
              </Badge>
            </h4>
            {artworks.length > 0 ? (
              <div className="space-y-2">
                {artworks.slice(0, 3).map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className="flex items-center w-full gap-2 bg-card px-3 py-2 rounded-md border border-[var(--border)]"
                  >
                    <div className="flex items-center w-full gap-2">
                      {artwork.images && artwork.images.length > 0 ? (
                        <img
                          src={artwork.images[0]}
                          alt={artwork.title}
                          className="size-12 rounded object-cover"
                        />
                      ) : (
                        <div className="size-12 rounded bg-muted flex items-center justify-center">
                          <PaletteIcon className="text-muted-foreground size-4" />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.25 min-w-0 flex-1">
                        <span className="text-sm font-medium truncate">{artwork.title}</span>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <UserIcon className="size-3" />
                          <span className="truncate">{artwork.author}</span>
                        </div>
                        <span className="text-muted-foreground text-xs line-clamp-1">{artwork.description}</span>
                      </div>
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
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
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

            <Button
              variant="outline"
              size="sm"
              className="text-xs"
            >
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
            <AlertDialogCancel onClick={handleAlertDialogCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertDialogAction}>Delete artwork</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
