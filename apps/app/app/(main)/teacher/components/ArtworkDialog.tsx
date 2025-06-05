"use client"

// React Hooks
import { useEffect } from "react"

// UI Components
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
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: UseMutationResult<unknown, Error, ArtworkFormValues, unknown>;
}

export function ArtworkDialog({
  open,
  setOpen,
  onSubmit,
}: ArtworkDialogProps) {

  useEffect(() => {
    if (onSubmit.isSuccess) {
      setOpen(false);
    }
  }, [onSubmit.isSuccess, setOpen]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              New Artwork
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
    </>
  );
}