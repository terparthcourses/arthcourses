"use client";

// React Hooks
import { useState } from "react";

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
  Trash2Icon
} from "lucide-react";

interface ArtworkCardProps {
  artwork: Artwork;
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

export function ArtworkCard({ artwork, onUpdate, onDelete }: ArtworkCardProps) {
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
        className="flex h-full flex-col overflow-hidden"
      >
        <CardHeader className="p-0">
          <div className="relative h-72 w-full overflow-x-auto px-4 py-4">
            {validImages.length > 0 && (
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
                        className="border border-border object-cover"
                      />
                    </div>
                  ))}
                  <div className="relative h-full w-6 flex-shrink-0 right-4" />
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-4 px-6">
          <div>
            <h2 className="line-clamp-1 text-xl font-semibold text-foreground">{title}</h2>
            {author && <p className="mt-1 text-sm text-muted-foreground">by {author}</p>}
          </div>

          {description && (
            <p className="line-clamp-3 text-sm text-foreground/80">{description}</p>
          )}

          {content && (
            <div className="relative">
              <p className="line-clamp-4 text-sm text-foreground/70 after:absolute after:bottom-0 after:left-0 after:h-full after:w-full after:bg-gradient-to-t after:from-card after:to-transparent after:content-['']">
                {content}
              </p>
            </div>
          )}
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
              onClick={() => setIsArtworkDialogOpen(true)}
            >
              <PencilIcon className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>

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
            <AlertDialogCancel onClick={handleAlertDialogCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertDialogAction}>Delete artwork</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
