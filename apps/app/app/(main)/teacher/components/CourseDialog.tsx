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

// `CourseForm` Component
import { CourseForm } from "./CourseForm"

// Constants
import { type Course } from "@repo/database"

// Lucide Icons
import { LoaderCircle } from "lucide-react"

interface CourseDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  onSubmit: any;
  onSubmitType: "create" | "update";
  course?: Course;
}

export function CourseDialog({
  isDialogOpen,
  setIsDialogOpen,
  onSubmit,
  onSubmitType,
  course,
}: CourseDialogProps) {

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
              {
                onSubmitType === "create" ? "Create Course" : "Update Course"
              }
            </DialogTitle>
            <DialogDescription>
              Enter the details of your course below
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto">
            <ScrollArea className="max-h-[80vh]">
              <div className="px-6 py-4">
                <CourseForm
                  onSubmit={onSubmit}
                  onSubmitType={onSubmitType}
                  course={course}
                />
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleSetDialogOpen(false)}
              disabled={onSubmit.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              form={`course-${onSubmitType}-form`}
              className="hover:cursor-pointer"
              onClick={() => setIsDialogOpen(false)}
              disabled={onSubmit.isPending}
            >
              {
                onSubmitType === "create" ? (
                  onSubmit.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Creating course
                    </>
                  ) : (
                    "Create course"
                  )
                ) : (
                  onSubmit.isPending ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Updating course
                    </>
                  ) : (
                    "Update course"
                  )
                )
              }
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