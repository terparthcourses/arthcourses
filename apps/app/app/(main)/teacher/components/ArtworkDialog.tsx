"use client"

// React Hooks
import { useEffect, useState } from "react"

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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

// `ArtworkForm` Component
import { ArtworkForm } from "./ArtworkForm"

// React Query
import { UseMutationResult } from "@tanstack/react-query"

// Constants
import { type ArtworkFormValues } from "../consants"

// Lucide Icons
import { LoaderCircle } from "lucide-react"

interface ArtworkDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSubmit: UseMutationResult<unknown, Error, ArtworkFormValues, unknown>;
}

export function ArtworkDialog({
  isDialogOpen,
  setIsDialogOpen,
  onSubmit,
}: ArtworkDialogProps) {

  // State for alert dialog
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  useEffect(() => {
    if (onSubmit.isSuccess) {
      setIsDialogOpen(false);
    }
  }, [onSubmit.isSuccess, setIsDialogOpen]);

  const handleSetDialogOpen = (newOpen: boolean) => {
    if (!newOpen) {
      setIsAlertDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  // Handle alert dialog action
  const handleAlertDialogAction = () => {
    setIsAlertDialogOpen(false);
    setIsDialogOpen(false);
  };

  // Handle alert dialog cancel
  const handleAlertDialogCancel = () => {
    setIsAlertDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleSetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create Artwork
            </DialogTitle>
            <DialogDescription>
              Enter the details of your artwork below
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto">
            <ScrollArea className="max-h-[80vh]">
              <div className="px-6 py-4">
                <ArtworkForm
                  onSubmit={onSubmit}
                />
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSetDialogOpen(false)}
              disabled={onSubmit.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="artwork-form"
              className="hover:cursor-pointer"
              disabled={onSubmit.isPending}
            >
              {onSubmit.isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Creating artwork
                </>
              ) : (
                "Create artwork"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this form? Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertDialogCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAlertDialogAction}>Discard changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}