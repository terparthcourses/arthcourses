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

// Lucide Icons
import { BookOpenIcon, PaletteIcon, PlusIcon } from "lucide-react"

export default function Page() {
  const [activeTab, setActiveTab] = useState("artworks")

  const handleNewArtwork = () => {
    // Handle new artwork creation
    console.log("Creating new artwork")
  }

  const handleNewCourse = () => {
    // Handle new course creation
    console.log("Creating new course")
  }

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
                    onClick={handleNewArtwork}
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
          </>
        ) : (
          <>
            <header>
              <Container className="py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Your Courses</h2>
                  <Button
                    size="sm"
                    onClick={handleNewCourse}
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