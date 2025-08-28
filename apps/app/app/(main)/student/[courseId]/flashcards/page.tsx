// ./(main)/student/[courseId]/flashcards/page.tsx

"use client"

// React Hooks
import { useState } from 'react';

// Next.js Hooks
import { useParams } from 'next/navigation';

// Framer Motion
import { motion, AnimatePresence } from 'framer-motion';

// UI Components
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// React Query Hooks
import { usePublishedCourses } from '../../hooks/usePublishedCourses';

// Constants
import { type Course, type Artwork } from "@repo/database";

// Icons
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  RotateCcwIcon,
  ShuffleIcon,
  LoaderCircle,
  PaletteIcon,
  ZoomInIcon
} from "lucide-react";

// Next.js Components
import Link from 'next/link';

export default function Page() {
  const params = useParams<{ courseId: string }>();

  // State for current flashcard index
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for whether card is flipped
  const [isFlipped, setIsFlipped] = useState(false);

  // State for whether to shuffle cards
  const [isShuffled, setIsShuffled] = useState(false);

  // State for shuffled order
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const {
    data: publishedCourses,
    isLoading: isPublishedCoursesLoading,
    isError: isPublishedCoursesError
  } = usePublishedCourses();

  // Early return if data is loading
  if (isPublishedCoursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Find the current course
  const course: Course & { artworks: Artwork[] } = publishedCourses?.find(course => course.id === params.courseId) as Course & { artworks: Artwork[] };
  const artworks = course?.artworks || [];



  // Get the order of artworks to display
  const getArtworkOrder = (): number[] => {
    if (isShuffled && shuffledIndices.length === artworks.length) {
      return shuffledIndices;
    }
    return artworks.map((_, index) => index);
  };

  // Shuffle function
  const handleShuffle = () => {
    if (artworks.length === 0) return;

    const indices = artworks.map((_, index) => index);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setShuffledIndices(shuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Reset to original order
  const handleReset = () => {
    setIsShuffled(false);
    setShuffledIndices([]);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
    setIsFlipped(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
    setIsFlipped(false);
  };

  // Flip card function
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  if (artworks.length === 0) {
    return (
      <main className="py-8">
        <Container>
          <div className="text-center py-16">
            <div className="flex items-center justify-center mb-4">
              <PaletteIcon className="size-12 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-medium mb-2">No artworks in this course</h2>
            <p className="text-sm text-muted-foreground">This course doesn't have any artworks to study yet.</p>
          </div>
        </Container>
      </main>
    );
  }

  const artworkOrder = getArtworkOrder();
  const currentArtworkIndex = artworkOrder[currentIndex];
  const currentArtwork = artworks[currentArtworkIndex];

  // Helper function to get image URL from different formats
  const getImageUrl = (image: any): string | null => {
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    if (image?.src) return image.src;
    return null;
  };

  const currentImageUrl = currentArtwork.images?.[0] ? getImageUrl(currentArtwork.images[0]) : null;

  // Debug logging to see what's in the images array
  if (currentArtwork && currentArtwork.images) {
    console.log('Current artwork images:', currentArtwork.images);
    console.log('First image:', currentArtwork.images[0]);
    console.log('Parsed image URL:', currentImageUrl);
  }

  // Card flip animation variants
  const cardVariants = {
    front: {
      rotateY: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    },
    back: {
      rotateY: 180,
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.1,
        duration: 0.4
      }
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <main className="py-8">
      <Container>
        {/* Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-medium">Flashcards</span>
              <Badge variant="outline" className="text-sm">
                {currentIndex + 1} of {artworks.length}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={!isShuffled}
              >
                <RotateCcwIcon className="size-4 mr-1" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShuffle}
              >
                <ShuffleIcon className="size-4 mr-1" />
                Shuffle
              </Button>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto">
          <div className="relative h-[500px] perspective-1000">
            <motion.div
              className="relative w-full h-full cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              variants={cardVariants}
              animate={isFlipped ? "back" : "front"}
              onClick={flipCard}
            >
              {/* Front of card (Image) */}
              <motion.div
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`front-${currentArtworkIndex}`}
                    className="w-full h-full rounded-xl border border-[var(--border)] bg-card overflow-hidden shadow-lg"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="relative w-full h-full flex items-center justify-center bg-muted">
                      {currentImageUrl ? (
                        <img
                          src={currentImageUrl}
                          alt={currentArtwork.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <PaletteIcon className="size-16 mb-4" />
                          <p className="text-sm">No image available</p>
                        </div>
                      )}

                      {/* Zoom button - only show if image exists */}
                      {currentImageUrl && (
                        <div className="absolute top-4 left-4">
                          <Button
                            asChild
                            size="sm"
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                            onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking zoom
                          >
                            <Link
                              href={`/student/${params.courseId}/learn/${encodeURIComponent(currentImageUrl)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ZoomInIcon className="size-4 mr-1" />
                              Open Image Viewer
                            </Link>
                          </Button>
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
                          Click to flip
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Back of card (Details) */}
              <motion.div
                className="absolute inset-0 w-full h-full backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`back-${currentArtworkIndex}`}
                    className="w-full h-full rounded-xl border border-[var(--border)] bg-card p-8 shadow-lg overflow-y-auto"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    <div className="space-y-6">
                      {/* Title and Author */}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">
                          {currentArtwork.title}
                        </h2>
                        <p className="text-lg text-muted-foreground">
                          by {currentArtwork.author}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                          Description
                        </h3>
                        <p className="text-sm leading-relaxed">
                          {currentArtwork.description}
                        </p>
                      </div>

                      {/* Tags */}
                      {((currentArtwork.periodTags?.length ?? 0) > 0 || (currentArtwork.mediumTags?.length ?? 0) > 0) && (
                        <div className="space-y-3">
                          {(currentArtwork.periodTags?.length ?? 0) > 0 && (
                            <div>
                              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                                Period
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {currentArtwork.periodTags?.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {(currentArtwork.mediumTags?.length ?? 0) > 0 && (
                            <div>
                              <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                                Medium
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {currentArtwork.mediumTags?.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
                          Click to flip back
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              disabled={artworks.length <= 1}
            >
              <ChevronLeftIcon className="size-4 mr-1" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground px-4">
              {currentIndex + 1} of {artworks.length}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              disabled={artworks.length <= 1}
            >
              Next
              <ChevronRightIcon className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
