// ./(main)/teacher/page.tsx

"use client"

// React Hooks
import { useState } from "react"

// UI Components
import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// `ArtworkDialog` Component
import { ArtworkDialog } from "./components/ArtworkDialog"

// React Query
import { useArtworks } from "./hooks/useArtworks"

// Lucide Icons
import { BookOpenIcon, PaletteIcon, PlusIcon } from "lucide-react"

export default function Page() {
  // State for the active tab
  const [activeTab, setActiveTab] = useState("artworks")

  // State for the artwork dialog
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false)

  // Artworks
  const {
    data: artworks,
    isLoading,
    isError,
    createArtwork,
  } = useArtworks()

  return (
    <>
      <header className="border-b border-[var(--border)]">
        <Container className="py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollArea>
              <TabsList>
                <TabsTrigger value="artworks" className="group">
                  <PaletteIcon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Artworks
                </TabsTrigger>
                <TabsTrigger value="courses" className="group">
                  <BookOpenIcon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Courses
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </Container>
      </header>

      {
        activeTab === "artworks" ? (
          <>
            <header>
              <Container className="py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Your Artworks</h2>
                  <Button
                    size="sm"
                    onClick={() => setIsArtworkDialogOpen(true)}
                  >
                    <PlusIcon
                      size={16}
                      aria-hidden="true"
                    />
                    New artwork
                  </Button>
                </div>
              </Container>
            </header>

            <ArtworkDialog
              open={isArtworkDialogOpen}
              setOpen={setIsArtworkDialogOpen}
              onSubmit={createArtwork}
            />
          </>
        ) : (
          <>
            <header>
              <Container className="py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Your Courses</h2>
                  <Button
                    size="sm"
                  >
                    <PlusIcon
                      size={16}
                      aria-hidden="true"
                    />
                    New course
                  </Button>
                </div>
              </Container>
            </header>
          </>
        )
      }
    </>
  );
}