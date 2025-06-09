// UI Components
import Container from "@/components/container";
import Link from "next/link";

// `ArtworkInsetBanner` Component
import { ArtworkInsetBanner } from "./ArtworkInsetBanner";

// Constants
import { type Artwork } from "@repo/database";

interface ArtworkInsetContentProps {
  selectedArtwork: Artwork | null;
  isAnalysisComplete: boolean;
  analysisTimeRemaining: number | null;
  isCurrentArtworkCompleted: boolean;
  onSkipAnalysis: () => void;
  courseId: string;
}

export function ArtworkInsetContent({
  selectedArtwork,
  isAnalysisComplete,
  analysisTimeRemaining,
  isCurrentArtworkCompleted,
  onSkipAnalysis,
  courseId,
}: ArtworkInsetContentProps) {
  const images = (selectedArtwork as any)?.images || [];

  return (
    <main className="flex-1 p-6 flex flex-col">
      <Container>
        <div className="flex-1">
          {selectedArtwork && (
            <div className="space-y-6">
              <ArtworkInsetBanner
                isAnalysisComplete={isAnalysisComplete}
                analysisTimeRemaining={analysisTimeRemaining}
                isCurrentArtworkCompleted={isCurrentArtworkCompleted}
                onSkipAnalysis={onSkipAnalysis}
              />

              {!isAnalysisComplete && analysisTimeRemaining !== null ? (
                <div className="space-y-4">
                  {images.length === 0 ? (
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <p className="text-gray-600">No images available for this artwork.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image: any, index: number) => (
                        <Link
                          key={index}
                          href={`/student/${courseId}/learn/${encodeURIComponent(image.url || image.src || image)}`}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden block"
                          scroll={false}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={image.url || image.src || image}
                            alt={`Artwork image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{selectedArtwork.title}</h2>

                    {selectedArtwork.author && (
                      <p className="text-lg text-muted-foreground">by {selectedArtwork.author}</p>
                    )}

                    {selectedArtwork.description && (
                      <p className="text-foreground/80">{selectedArtwork.description}</p>
                    )}

                    {selectedArtwork.content && (
                      <p className="text-foreground text-md">{selectedArtwork.content}</p>
                    )}

                    <div className="pt-4">
                      <h3 className="text-lg font-semibold mb-4">Artwork Images</h3>

                      {images.length === 0 ? (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <p className="text-gray-600">No images available for this artwork.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {images.map((image: any, index: number) => (
                            <Link
                              key={index}
                              href={`/student/${courseId}/learn/${encodeURIComponent(image.url || image.src || image)}`}
                              className="aspect-square bg-gray-100 rounded-lg overflow-hidden block"
                              scroll={false}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={image.url || image.src || image}
                                alt={`Artwork image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                              />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
