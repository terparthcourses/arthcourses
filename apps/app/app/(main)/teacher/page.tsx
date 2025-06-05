// ./(main)/teacher/page.tsx

// UI Components
import { Badge } from "@/components/ui/badge"
import Container from "@/components/container";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Lucide Icons
import { PaletteIcon, BookOpenIcon } from "lucide-react"

export default function Page() {
  return (
    <>
      <header className="border-b border-[var(--border)]">
        <Container className="py-2">
          <Tabs defaultValue="artworks">
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

      <div>
        Teacher Page
      </div>
    </>
  );
}