// UI Components
import { Button } from "@/components/ui/button";

// Constants
import { type Artwork } from "@repo/database";

// Lucide Icons
import {
  CircleCheckBigIcon,
  ChevronLeft,
  ChevronRight,
  LoaderCircle
} from "lucide-react";

interface ArtworkInsetFooterProps {
  selectedArtwork: Artwork | null;
  hasPrevious: boolean;
  hasNext: boolean;
  isCurrentArtworkCompleted: boolean;
  isAnalysisComplete: boolean;
  analysisTimeRemaining: number | null;
  currentArtworkIndex: number;
  artworks: Artwork[];
  isMarkingComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkAsComplete: () => void;
}

export function ArtworkInsetFooter({
  selectedArtwork,
  hasPrevious,
  hasNext,
  isCurrentArtworkCompleted,
  isAnalysisComplete,
  analysisTimeRemaining,
  currentArtworkIndex,
  artworks,
  isMarkingComplete,
  onPrevious,
  onNext,
  onMarkAsComplete,
}: ArtworkInsetFooterProps) {
  if (!selectedArtwork) return null;

  return (
    <footer className="border-t p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious || (!isAnalysisComplete && analysisTimeRemaining !== null)}
            size="sm"
            className="flex items-center gap-2"
            title={(!isAnalysisComplete && analysisTimeRemaining !== null) ?
              "Navigation disabled during analysis phase" : ""}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            variant="outline"
            onClick={onNext}
            disabled={!hasNext || (!isAnalysisComplete && analysisTimeRemaining !== null)}
            size="sm"
            className="flex items-center gap-2"
            title={(!isAnalysisComplete && analysisTimeRemaining !== null) ?
              "Navigation disabled during analysis phase" :
              (!hasNext && currentArtworkIndex < artworks.length - 1 ?
                "Complete this artwork to unlock the next one" : "")}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant={isCurrentArtworkCompleted ? "secondary" : "default"}
          size="sm"
          className="flex items-center gap-2"
          onClick={onMarkAsComplete}
          disabled={
            isCurrentArtworkCompleted ||
            isMarkingComplete ||
            (!isAnalysisComplete && analysisTimeRemaining !== null)
          }
        >
          {isMarkingComplete ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Marking as complete
            </>
          ) : isCurrentArtworkCompleted ? (
            <>
              <CircleCheckBigIcon className="h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <CircleCheckBigIcon className="h-4 w-4" />
              Mark as complete
            </>
          )}
        </Button>
      </div>
    </footer>
  );
}
