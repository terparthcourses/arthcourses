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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// `ArtworkDialog` Component
import { ArtworkDialog } from "./ArtworkDialog";

// Next.js Components
import Image from "next/image";

// Constants
import { type ArtworkFormValues } from "../consants";
import { type Artwork } from "@repo/database";

// Lucide Icons
import {
  ClockIcon,
  PencilIcon,
  Trash2Icon,
  LockIcon
} from "lucide-react";

interface ArtworkCardProps {
  artwork: Artwork;
  // Optional accessibility props for consistency with student cards
  isAccessible?: boolean;
  isActive?: boolean;
  onDelete?: ({
    artwork
  }: {
    artwork: Artwork;
  }) => void;
  onUpdate?: ({
    artwork,
    values
  }: {
    artwork: Artwork;
    values: ArtworkFormValues;
  }) => void;
}

export function ArtworkCard({
  artwork,
  isAccessible = true,
  isActive = false,
  onUpdate,
  onDelete
}: ArtworkCardProps) {
  const {
    id,
    title,
    author,
    description,
    content,
    images,
    mediumTags = [],
    periodTags = [],
    updatedAt,
  } = artwork;

  // State for the artwork dialog
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false)

  // State for alert dialog
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // Handle alert dialog action
  const handleAlertDialogAction = () => {
    setIsAlertDialogOpen(false);
    onDelete?.({
      artwork: artwork,
    });
  };

  // Handle alert dialog cancel
  const handleAlertDialogCancel = () => {
    setIsAlertDialogOpen(false);
  };

  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validImages = (images ?? []).filter(
    (img) => typeof img === "string" && isValidImageUrl(img)
  );

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
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all",
          // Apply active state styling
          isActive && "ring-2 ring-primary ring-offset-2",
          // Apply disabled state styling for inaccessible artworks
          !isAccessible && "opacity-60 cursor-not-allowed bg-muted/30"
        )}
      >
        {validImages.length > 0 && (
          <CardHeader className="p-0">
            <div className="relative h-72 w-full overflow-x-auto px-4 py-4">
              {/* Lock overlay for inaccessible artworks */}
              {!isAccessible && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg mx-4 my-4">
                  <div className="flex flex-col items-center text-white">
                    <LockIcon className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Locked</span>
                  </div>
                </div>
              )}
              <ScrollArea className="h-full w-full">
                <div className="absolute inset-0 flex gap-4">
                  {validImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-full min-w-[300px] flex-shrink-0 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={url}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        sizes="300px"
                        className={cn(
                          "border border-border object-cover",
                          // Blur effect for inaccessible artworks
                          !isAccessible && "blur-sm"
                        )}
                      />
                    </div>
                  ))}
                  <div className="relative h-full w-6 flex-shrink-0 right-4" />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </CardHeader>
        )}

        <CardContent className={cn(
          "flex-grow space-y-4 px-6",
          validImages.length === 0 && "pt-6"
        )}>
          <div>
            <h2 className={cn(
              "line-clamp-1 text-xl font-semibold text-foreground",
              // Muted text for inaccessible artworks
              !isAccessible && "text-muted-foreground"
            )}>
              {title}
              {/* Lock indicator in title for inaccessible artworks */}
              {!isAccessible && (
                <LockIcon className="inline h-4 w-4 ml-2" />
              )}
            </h2>
            {author && (
              <p className={cn(
                "mt-1 text-sm text-muted-foreground",
                !isAccessible && "text-muted-foreground/70"
              )}>
                by {author}
              </p>
            )}
          </div>

          {description && (
            <p className={cn(
              "line-clamp-3 text-sm text-foreground/80",
              !isAccessible && "text-muted-foreground/70"
            )}>
              {description}
            </p>
          )}

          {content && (
            <div className="relative">
              <p className={cn(
                "line-clamp-4 text-sm text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-card after:to-transparent after:content-['']",
                !isAccessible && "text-muted-foreground/70"
              )}>
                {content}
              </p>
            </div>
          )}

          {/* Accessibility status message for inaccessible artworks */}
          {!isAccessible && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md border border-muted">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <LockIcon className="h-3 w-3" />
                <span className="italic">This artwork is currently locked</span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-6 py-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            Last updated {formattedDate(updatedAt)}
          </div>

          <div className="flex gap-2">
            {/* Disable action buttons for inaccessible artworks */}
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
              onClick={() => setIsAlertDialogOpen(true)}
              disabled={!isAccessible}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setIsArtworkDialogOpen(true)}
              disabled={!isAccessible}
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Only show dialogs if artwork is accessible */}
      {isAccessible && (
        <>
          <ArtworkDialog
            isDialogOpen={isArtworkDialogOpen}
            setIsDialogOpen={setIsArtworkDialogOpen}
            onSubmit={onUpdate}
            onSubmitType="update"
            artwork={artwork}
          />

          <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleAlertDialogCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleAlertDialogAction}>
                  Delete artwork
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
