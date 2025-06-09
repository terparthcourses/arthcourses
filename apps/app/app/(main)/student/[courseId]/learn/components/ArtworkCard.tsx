// UI Components
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// Constants
import { type Artwork } from "@repo/database";

// Lucide Icons
import {
  UserIcon,
  LockIcon,
  CheckIcon,
  XIcon
} from "lucide-react";

interface ArtworkCardProps {
  artwork: Artwork;
  isCompleted?: boolean;
  isActive?: boolean;
  isAccessible?: boolean;
  onClick?: () => void;
}

export function ArtworkCard({
  artwork,
  isCompleted = false,
  isActive = false,
  isAccessible = true,
  onClick
}: ArtworkCardProps) {
  const { title, author, images, description } = artwork;
  const imageUrl = images?.[0] ?? null;

  const handleClick = () => {
    if (isAccessible) {
      onClick?.();
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all ${isActive
        ? "bg-primary/5 border-primary/20"
        : !isAccessible
          ? "opacity-60 cursor-not-allowed"
          : "hover:bg-muted/50 cursor-pointer"
        }`}
      onClick={handleClick}
      role="button"
      tabIndex={isAccessible ? 0 : -1}
      aria-selected={isActive}
      aria-disabled={!isAccessible}
    >
      <CardContent className="p-0">
        {imageUrl && (
          <div className="relative w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-32 object-cover border-b transition-all duration-300 ${isActive ? "border-primary/20" : !isAccessible ? "opacity-70 blur-sm overflow-hidden" : ""
                }`}
            />
            {!isAccessible && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <LockIcon size={20} className="text-white" />
              </div>
            )}
          </div>
        )}

        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <CardTitle className={`text-sm text-primary/80 mb-1 line-clamp-1 ${isActive ? "text-primary" : !isAccessible ? "text-muted-foreground" : ""} flex items-center`}>
              <span className="truncate">{title}</span>
              <span className={`ml-2 text-xs flex items-center gap-1 ${isCompleted ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {isCompleted ? (
                  <>
                    <CheckIcon size={14} className="inline-block" /> Completed
                  </>
                ) : (
                  <>
                    <XIcon size={14} className="inline-block" /> Incomplete
                  </>
                )}
              </span>
            </CardTitle>

            {description && (
              <CardDescription className={`text-xs mb-2 line-clamp-2 ${!isAccessible ? "text-muted-foreground/70" : ""
                }`}>
                {description}
              </CardDescription>
            )}
          </div>

          {author && (
            <div className={`flex items-center gap-1 text-xs text-muted-foreground ${!isAccessible ? "text-muted-foreground/70" : ""
              }`}>
              <UserIcon size={14} className="inline-block mr-1" aria-hidden="true" />
              <span>by {author}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
