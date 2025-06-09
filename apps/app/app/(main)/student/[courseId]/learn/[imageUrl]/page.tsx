// ./(main)/student/[courseId]/learn/[imageId]/page.tsx

"use client";

// Utilities
import { api } from "@/lib/api-handler";

// React Hooks
import { useEffect, useState } from "react";

// Next.js Hooks
import { useParams } from "next/navigation";

// React Zoom Pan Pinch
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// UI Components
import { Button } from "@/components/ui/button";

// Constants
import { type Image } from "@repo/database";

// Lucide Icons
import { LoaderCircle } from "lucide-react";

export default function Page() {
  // Parameters
  const params = useParams();
  const imageUrl = params.imageUrl as string;

  // State for image
  const [image, setImage] = useState<Image | null>(null);

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    setLoading(true);
    setError(null);

    api
      .get<Image>(`/api/images/${encodeURIComponent(imageUrl)}`)
      .then((data) => {
        setImage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err?.body?.message || err?.message || "Failed to load image."
        );
        setLoading(false);
      });
  }, [imageUrl]);

  if (loading || !image) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute top-4 left-4 bg-muted px-3 py-1 rounded-md text-sm font-medium inline-flex items-center z-20">
        {image.name}
      </div>

      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={10}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <Button variant="default" type="button" onClick={() => zoomIn()}>
                Zoom In
              </Button>
              <Button variant="default" type="button" onClick={() => zoomOut()}>
                Zoom Out
              </Button>
              <Button variant="secondary" type="button" onClick={() => resetTransform()}>
                Reset
              </Button>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <TransformComponent wrapperStyle={{ width: "100vw", height: "100vh" }}>
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-3/4 h-automax-w-full max-h-full select-none"
                    draggable={false}
                  />
                </div>
              </TransformComponent>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
