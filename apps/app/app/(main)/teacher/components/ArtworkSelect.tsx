"use client"

// React Hooks
import { useState, useEffect } from "react"

// DnD-Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

// Utilities
import { cn } from "@/lib/clsx-handler"
import { api } from "@/lib/api-handler"

// UI Components
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// `ArtworkSelectItem` Component
import { ArtworkSelectItem } from "./ArtworkSelectItem"

// Constants
import { type Artwork } from "@repo/database"

// Lucide Icons
import {
  ChevronsUpDownIcon,
  PaletteIcon,
  UserIcon,
} from "lucide-react"

interface ArtworkMultiSelectProps {
  value: string[] | undefined
  onChange: (value: string[]) => void
  disabled?: boolean
  className?: string
}

export function ArtworkSelect({
  value = [],
  onChange,
  disabled = false,
  className,
}: ArtworkMultiSelectProps) {
  // State for popover
  const [open, setOpen] = useState(false)

  // State for artworks
  const [artworks, setArtworks] = useState<Artwork[]>([])

  // State for loading
  const [isLoading, setIsLoading] = useState(true)

  // DnD-Kit Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true)
        const response = await api.get<Artwork[]>('/api/artworks')
        setArtworks(response)
      } catch (error) {
        console.error('Failed to fetch artworks:', error)
        setArtworks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  // Get selected artworks
  const selectedArtworks = value.map(id => artworks.find(artwork => artwork.id === id)).filter(Boolean) as Artwork[]

  const handleSelect = (artworkId: string) => {
    const isSelected = value.includes(artworkId)
    if (isSelected) {
      onChange(value.filter((id) => id !== artworkId))
    } else {
      onChange([...value, artworkId])
    }
  }

  const handleRemove = (artworkId: string) => {
    onChange(value.filter((id) => id !== artworkId))
  }

  const handleRemoveAll = () => {
    onChange([])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string)
      const newIndex = value.indexOf(over.id as string)

      const newOrder = arrayMove(value, oldIndex, newIndex)
      onChange(newOrder)
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
            disabled={disabled}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <PaletteIcon className="size-4" />
              {selectedArtworks.length > 0
                ? `${selectedArtworks.length} artwork${selectedArtworks.length > 1 ? 's' : ''} selected`
                : "Select artworks"
              }
            </div>
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] max-w-[var(--radix-popper-anchor-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search artworks..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? "Loading artworks..." : "No artwork found."}
              </CommandEmpty>
              <CommandGroup>
                {artworks.map((artwork) => (
                  <CommandItem
                    key={artwork.id}
                    value={artwork.title}
                    onSelect={() => {
                      handleSelect(artwork.id)
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center w-full gap-2">
                      <Checkbox
                        checked={value.includes(artwork.id)}
                        onCheckedChange={() => handleSelect(artwork.id)}
                      />
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
                        <span className="font-medium truncate">{artwork.title}</span>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <UserIcon className="size-3" />
                          <span className="truncate">{artwork.author}</span>
                        </div>
                        <span className="text-muted-foreground text-xs line-clamp-1">{artwork.description}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedArtworks.length > 0 && (
        <div className="space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={value} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-2">
                {selectedArtworks.map((artwork) => (
                  <ArtworkSelectItem
                    key={artwork.id}
                    artwork={artwork}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {selectedArtworks.length > 0 && (
            <div className="mt-3">
              <Button size="sm" variant="outline" onClick={handleRemoveAll}>
                Remove all artworks
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 