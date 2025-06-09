// ./(main)/student/[courseId]/learn/page.tsx

"use client";

// React Hooks
import { useState, useEffect } from "react";

// UI Components
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

// `ArtworkInsetContent` Component
import { ArtworkInsetContent } from "./components/ArtworkInsetContent"

// `ArtworkInsetFooter` Component
import { ArtworkInsetFooter } from "./components/ArtworkInsetFooter"

// `ArtworkInsetHeader` Component
import { ArtworkInsetHeader } from "./components/ArtworkInsetHeader"

// `ArtworkSidebar` Component
import { ArtworkSidebar } from "./components/ArtworkSidebar"

// Next.js Hooks
import { useParams } from "next/navigation";

// React Query Hooks
import { useEnrollments } from "@/app/(main)/student/hooks/useEnrollments";
import { useCompletions } from "@/app/(main)/student/hooks/useCompletions";
import { usePublishedCourses } from "@/app/(main)/student/hooks/usePublishedCourses";

// Constants
import { type Course, type Artwork } from "@repo/database";

// Lucide Icons
import { LoaderCircle } from "lucide-react"

export default function Page() {
  // Parameters
  const params = useParams();
  const courseId = params.courseId as string;

  // State for selected artwork
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  // State for analysis timer
  const [analysisTimeRemaining, setAnalysisTimeRemaining] = useState<number | null>(null);

  // State for analysis complete
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false);

  // Store the interval ID
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const {
    data: completions,
    isLoading: isCompletionsLoading,
    isError: isCompletionsError,
    markCompletionAsCompleted
  } = useCompletions();

  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
    createEnrollment
  } = useEnrollments();

  const {
    data: publishedCourses,
    isLoading: isPublishedCoursesLoading,
    isError: isPublishedCoursesError
  } = usePublishedCourses();

  // Helper function to determine the first incomplete artwork
  const getFirstIncompleteArtworkIndex = (artworks: Artwork[]): number => {
    // If no artworks exist, return -1
    if (artworks.length === 0) return -1;

    // Find the first artwork that is not completed
    for (let i = 0; i < artworks.length; i++) {
      const artwork = artworks[i];
      const completion = completions?.find(c => c.artworkId === artwork.id);

      // If no completion record exists or artwork is not completed
      if (!completion || !completion.isCompleted) {
        return i;
      }
    }

    // If all artworks are completed, return the last artwork index
    return artworks.length - 1;
  };

  useEffect(() => {
    // Don't run effect if data is not available yet
    if (!completions || !enrollments || !publishedCourses) {
      return;
    }

    // Find the current course and artworks
    const course = publishedCourses.find(course => course.id === courseId) as (Course & { artworks: Artwork[] }) | undefined;
    const artworks = course?.artworks || [];

    if (artworks.length === 0 || selectedArtwork) {
      return;
    }

    const firstIncompleteIndex = getFirstIncompleteArtworkIndex(artworks);

    if (firstIncompleteIndex >= 0) {
      // Navigate to the artwork
      const targetArtwork = artworks[firstIncompleteIndex];
      handleArtworkSelect(targetArtwork);
    }
  }, [completions, enrollments, publishedCourses, courseId, selectedArtwork]);

  // Cleanup effect for timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Early return after all hooks have been called
  if (!completions || !enrollments || !publishedCourses) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Find the current course and artworks
  const course: Course & { artworks: Artwork[] } = publishedCourses?.find(course => course.id === courseId) as Course & { artworks: Artwork[] };
  const artworks = course?.artworks || [];

  // Helper function to check if an artwork is accessible
  const isArtworkAccessible = (artworkIndex: number): boolean => {
    // Access artworks up to and including the first incomplete one
    const firstIncompleteIndex = getFirstIncompleteArtworkIndex(artworks);
    return artworkIndex <= firstIncompleteIndex;
  };

  // Helper function to handle artwork selection
  const handleArtworkSelect = (artwork: Artwork) => {
    // Find the index of the artwork
    const artworkIndex = artworks.findIndex(a => a.id === artwork.id);

    // Check if the artwork is accessible
    if (isArtworkAccessible(artworkIndex)) {
      // Clear existing timer
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      setSelectedArtwork(artwork);

      // Check if this artwork is already completed
      const completion = completions.find(c => c.artworkId === artwork.id);
      const isCompleted = completion?.isCompleted || false;

      if (isCompleted) {
        // If artwork already completed
        setIsAnalysisComplete(true);
        setAnalysisTimeRemaining(null);
      } else {
        // If artwork is not completed
        setIsAnalysisComplete(false);
        setAnalysisTimeRemaining(300); // 5 minutes = 300 seconds

        // Start countdown timer
        const interval = setInterval(() => {
          setAnalysisTimeRemaining(prev => {
            if (prev === null || prev <= 1) {
              // If timer completed
              setIsAnalysisComplete(true);
              clearInterval(interval);
              setTimerInterval(null);
              return null;
            }
            return prev - 1;
          });
        }, 1000);

        setTimerInterval(interval);
      }
    }
  };

  // Get the index of the current artwork
  const currentArtworkIndex = selectedArtwork
    ? artworks.findIndex(artwork => artwork.id === selectedArtwork.id)
    : -1;

  // Check if there is a previous artwork
  const hasPrevious = currentArtworkIndex > 0;

  // Check if there is a next artwork
  const hasNext = currentArtworkIndex >= 0 &&
    currentArtworkIndex < artworks.length - 1 &&
    isArtworkAccessible(currentArtworkIndex + 1);

  // Check if current artwork is completed
  const currentCompletion = selectedArtwork
    ? completions.find(completion => completion.artworkId === selectedArtwork.id)
    : null;
  const isCurrentArtworkCompleted = currentCompletion?.isCompleted || false;

  // Helper function to handle previous artwork selection
  const handlePrevious = () => {
    if (hasPrevious) {
      const previousArtwork = artworks[currentArtworkIndex - 1];
      handleArtworkSelect(previousArtwork);
    }
  };

  // Helper function to handle next artwork selection
  const handleNext = () => {
    if (hasNext) {
      const nextArtwork = artworks[currentArtworkIndex + 1];
      handleArtworkSelect(nextArtwork);
    }
  };

  // Helper function to handle artwork completion
  const handleMarkAsComplete = async () => {
    if (!selectedArtwork || !currentCompletion) return;

    try {
      // Mark the current artwork as completed
      await markCompletionAsCompleted.mutateAsync(currentCompletion.id);

      // Move to the next incomplete artwork after a brief delay
      setTimeout(() => {
        const currentIndex = artworks.findIndex(a => a.id === selectedArtwork.id);
        const nextIndex = currentIndex + 1;

        // If there is a next artwork
        if (nextIndex < artworks.length) {
          // Navigate to the next artwork
          const nextArtwork = artworks[nextIndex];
          handleArtworkSelect(nextArtwork);
        }
      }, 500);

    } catch (error) {
      console.error('Failed to mark artwork as complete:', error);
    }
  };

  // Helper function to skip the analysis timer
  const handleSkipAnalysis = () => {
    // Clear the active timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Reset timer state and mark analysis as complete
    setAnalysisTimeRemaining(null);
    setIsAnalysisComplete(true);
  };



  return (
    <>
      <SidebarProvider>
        <ArtworkSidebar
          artworks={artworks}
          course={course}
          completions={completions}
          activeArtworkId={selectedArtwork?.id}
          onArtworkSelect={handleArtworkSelect}
        />

        <SidebarInset>
          <ArtworkInsetHeader
            courseId={courseId}
            course={course}
            selectedArtwork={selectedArtwork}
          />

          <ArtworkInsetContent
            selectedArtwork={selectedArtwork}
            isAnalysisComplete={isAnalysisComplete}
            analysisTimeRemaining={analysisTimeRemaining}
            isCurrentArtworkCompleted={isCurrentArtworkCompleted}
            onSkipAnalysis={handleSkipAnalysis}
            courseId={courseId}
          />

          <ArtworkInsetFooter
            selectedArtwork={selectedArtwork}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            isCurrentArtworkCompleted={isCurrentArtworkCompleted}
            isAnalysisComplete={isAnalysisComplete}
            analysisTimeRemaining={analysisTimeRemaining}
            currentArtworkIndex={currentArtworkIndex}
            artworks={artworks}
            isMarkingComplete={markCompletionAsCompleted.isPending}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMarkAsComplete={handleMarkAsComplete}
          />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}