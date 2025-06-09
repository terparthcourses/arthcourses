// ./(main)/student/[courseId]/page.tsx

"use client"

// React Hooks
import { useState, useEffect } from "react";

// Next.js Hooks
import { useParams } from 'next/navigation';

// UI Components
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  ScrollArea,
  ScrollBar
} from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { UserDropdown } from "@/app/(auth)/UserDropdown";

// Next.js Components
import Link from 'next/link';

// Lucide Icons
import { ArrowUpRightIcon, ImagesIcon, ZapIcon } from "lucide-react";

export default function Page() {
  // Parameters
  const params = useParams<{ courseId: string }>();

  // State to track if component has mounted
  const [hasMounted, setHasMounted] = useState(false);

  // State for the active tab
  const [activeTab, setActiveTab] = useState("catalog");

  useEffect(() => {
    const storedActiveTab = localStorage.getItem(`student-course-${params.courseId}-active-tab`);
    if (storedActiveTab) setActiveTab(storedActiveTab);
    setHasMounted(true);
  }, [params.courseId]);

  const handleSetActiveTab = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`student-course-${params.courseId}-active-tab`, value);
  };

  if (!hasMounted) return null;

  return (
    <>

      <header className="border-b border-[var(--border)]">
        <Container>
          <nav className="flex justify-between items-center py-4">
            <h1 className="text-xl font-medium flex items-center gap-4">
              Art History Courses
            </h1>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <UserDropdown />
            </div>
          </nav>
        </Container>
      </header>

      <header className="border-b border-[var(--border)]">
        <Container className="py-2">
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={handleSetActiveTab}>
              <ScrollArea>
                <TabsList>
                  <TabsTrigger value="catalog">
                    <ImagesIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Catalog
                  </TabsTrigger>
                  <TabsTrigger value="flashcards">
                    <ZapIcon
                      className="-ms-0.5 me-1.5 opacity-60"
                      size={16}
                      aria-hidden="true"
                    />
                    Flashcards
                  </TabsTrigger>
                </TabsList>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </Tabs>

            <Button asChild>
              <Link href={`/student/${params.courseId}/learn`}>
                Learn
                <ArrowUpRightIcon />
              </Link>
            </Button>
          </div>
        </Container>
      </header>

      {activeTab === "catalog" ? (
        <main className="mb-8">
          <Container>
            <h1>Catalog</h1>
          </Container>
        </main>
      ) : (
        <main className="mb-8">
          <Container>
            <h1>Flashcards</h1>
          </Container>
        </main>
      )}
    </>
  );
}