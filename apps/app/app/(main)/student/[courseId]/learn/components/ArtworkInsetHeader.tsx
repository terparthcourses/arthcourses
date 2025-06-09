// UI Components
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Constants
import { type Course, type Artwork } from "@repo/database";

// Lucide Icons
import { HomeIcon } from "lucide-react";

interface ArtworkInsetHeaderProps {
  courseId: string;
  course: Course | undefined;
  selectedArtwork: Artwork | null;
}

export function ArtworkInsetHeader({
  courseId,
  course,
  selectedArtwork,
}: ArtworkInsetHeaderProps) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b p-4">
      <div className="flex items-center gap-2 mr-2">
        <SidebarTrigger />
      </div>
      <Separator orientation="vertical" />
      <div className="flex items-center gap-2 ml-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/student">
                <HomeIcon size={16} aria-hidden="true" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbLink href={`/student/${courseId}`} className="max-w-48 truncate">
              {course?.title || 'Course'}
            </BreadcrumbLink>
            <BreadcrumbSeparator />
            {selectedArtwork && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-48 truncate">{selectedArtwork.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
