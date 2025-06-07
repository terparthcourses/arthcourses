"use client"

// DnD-Kit
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Utilities
import { cn } from "@/lib/clsx-handler"

// UI Components
import { Button } from "@/components/ui/button"

// Constants
import { type Artwork } from "@repo/database"

// Lucide Icons
import {
  GripVerticalIcon,
  PaletteIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

interface ArtworkSelectItemProps {
  artwork: Artwork
  onRemove: (artworkId: string) => void
}

export function ArtworkSelectItem({
  artwork,
  onRemove
}: ArtworkSelectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: artwork.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center w-full gap-2 bg-card px-3 py-2 rounded-md border border-[var(--border)]",
        isDragging && "opacity-50"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </div>

      {artwork.images && artwork.images.length > 0 ? (
        <img
          src={artwork.images[0]}
          alt={artwork.title}
          className="size-12 rounded object-cover"
        />
      ) : (
        <div className="size-12 rounded bg-muted flex items-center justify-center">
          <PaletteIcon className="text-muted-foreground size-4" />
        </div>
      )}
      <div className="flex flex-col gap-0.25 min-w-0 flex-1">
        <span className="text-sm font-medium truncate">{artwork.title}</span>
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
          <UserIcon className="size-3" />
          <span className="truncate">{artwork.author}</span>
        </div>
        <span className="text-muted-foreground text-xs line-clamp-1">{artwork.description}</span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
        onClick={() => onRemove(artwork.id)}
        aria-label="Remove artwork"
      >
        <XIcon aria-hidden="true" />
      </Button>
    </div>
  )
} 