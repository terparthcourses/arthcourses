// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

// Lucide Icons
import { Clock, CheckCircle } from "lucide-react";

interface ArtworkInsetBannerProps {
  isAnalysisComplete: boolean;
  analysisTimeRemaining: number | null;
  isCurrentArtworkCompleted: boolean;
  onSkipAnalysis: () => void;
}

export function ArtworkInsetBanner({
  isAnalysisComplete,
  analysisTimeRemaining,
  isCurrentArtworkCompleted,
  onSkipAnalysis,
}: ArtworkInsetBannerProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const showTimer = analysisTimeRemaining !== null;
  const showCompleteNotification =
    isAnalysisComplete && !showTimer && !isCurrentArtworkCompleted;

  return (
    <>
      {showTimer && (
        <Card className="mb-6 border bg-muted p-4 rounded-2xl">
          <CardContent className="p-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Visual Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Observe the artwork carefully.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-foreground font-mono">
                    {formatTime(analysisTimeRemaining)}
                  </div>
                  <Button variant="default" size="sm" onClick={onSkipAnalysis}>
                    Skip Analysis
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showCompleteNotification && (
        <Card className="mb-6 border bg-muted p-4 rounded-2xl">
          <CardContent className="p-0">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-foreground">Analysis Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  You can now view the artwork details and continue your study.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
