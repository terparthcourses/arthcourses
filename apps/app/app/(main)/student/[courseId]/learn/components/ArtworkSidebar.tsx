import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"

// `ArtworkCard` Component
import { ArtworkCard } from "./ArtworkCard"

// Constants
import { type Course, type Artwork, type Completion } from "@repo/database";

interface ArtworkSidebarProps extends React.ComponentProps<typeof Sidebar> {
  artworks: Artwork[];
  course: Course & { artworks: Artwork[] };
  completions: Completion[];
  activeArtworkId?: string;
  onArtworkSelect?: (artwork: Artwork) => void;
}

export function ArtworkSidebar({
  artworks,
  course,
  completions,
  activeArtworkId,
  onArtworkSelect,
  ...props
}: ArtworkSidebarProps) {

  const totalArtworks = artworks.length;
  const completedCount = completions.filter(c => c.isCompleted).length;
  const progressPercentage = totalArtworks > 0 ? Math.round((completedCount / totalArtworks) * 100) : 0;
  const remainingCount = totalArtworks - completedCount;

  const isArtworkCompleted = (artworkId: string): boolean =>
    completions.some(c => c.artworkId === artworkId && c.isCompleted);

  const getFirstIncompleteIndex = (): number => {
    return artworks.findIndex(artwork => {
      const completion = completions.find(c => c.artworkId === artwork.id);
      return !completion || !completion.isCompleted;
    }) ?? -1;
  };

  const isArtworkAccessible = (index: number): boolean => {
    const firstIncompleteIndex = getFirstIncompleteIndex();
    return index <= (firstIncompleteIndex === -1 ? artworks.length - 1 : firstIncompleteIndex);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="text-lg">Art History Courses</div>
      </SidebarHeader>

      <SidebarHeader className="border-b p-4">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{completedCount} completed</span>
              <span>{remainingCount} remaining</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="flex flex-col gap-2">
            {artworks.map((artwork, index) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                isCompleted={isArtworkCompleted(artwork.id)}
                isActive={activeArtworkId === artwork.id}
                isAccessible={isArtworkAccessible(index)}
                onClick={() => onArtworkSelect?.(artwork)}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
