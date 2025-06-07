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

export function ArtworkSelectItem({ artwork, onRemove }: ArtworkSelectItemProps) {
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
        "flex w-full items-center gap-2 rounded-md border border-input bg-card px-3 py-2 dark:bg-input/30",
        isDragging && "opacity-50"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </div>

      {artwork.images?.length ? (
        <img
          src={artwork.images[0]}
          alt={artwork.title}
          className="size-12 rounded border border-[var(--border)] object-cover"
        />
      ) : (
        <div className="size-12 flex items-center justify-center rounded border border-[var(--border)] bg-muted">
          <PaletteIcon className="size-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-0.25">
        <span className="truncate text-sm font-medium">{artwork.title}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <UserIcon className="size-3" />
          <span className="truncate">{artwork.author}</span>
        </div>
        <span className="line-clamp-1 text-xs text-muted-foreground">{artwork.description}</span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground"
        onClick={() => onRemove(artwork.id)}
        aria-label="Remove artwork"
      >
        <XIcon aria-hidden="true" />
      </Button>
    </div>
  )
}
