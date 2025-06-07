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

interface ArtworkSelectProps {
  value?: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  className?: string
}

export function ArtworkSelect({
  value = [],
  onChange,
  disabled = false,
  className,
}: ArtworkSelectProps) {
  // State for popover
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // State for artworks
  const [artworks, setArtworks] = useState<Artwork[]>([])

  // State for loading
  const [isLoading, setIsLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    const fetchArtworks = async () => {
      setIsLoading(true)
      try {
        const data = await api.get<Artwork[]>('/api/artworks')
        setArtworks(data)
      } catch (error) {
        console.error('Failed to fetch artworks:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchArtworks()
  }, [])

  const selectedArtworks = value
    .map((id) => artworks.find((art) => art.id === id))
    .filter(Boolean) as Artwork[]

  const toggleSelect = (id: string) => {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id])
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onChange(arrayMove(value, value.indexOf(active.id as string), value.indexOf(over.id as string)))
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isPopoverOpen}
            disabled={disabled}
            className="w-full justify-between border border-input bg-background px-3 font-normal hover:bg-background outline-none focus-visible:outline-[3px]"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <PaletteIcon className="size-4" />
              {selectedArtworks.length
                ? `${selectedArtworks.length} artwork${selectedArtworks.length > 1 ? 's' : ''} selected`
                : "Select artworks"}
            </span>
            <ChevronsUpDownIcon className="size-4 text-muted-foreground/80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 border border-input" align="start">
          <Command>
            <CommandInput placeholder="Search artworks..." />
            <CommandList>
              <CommandEmpty>{isLoading ? "Loading..." : "No artworks found."}</CommandEmpty>
              <CommandGroup>
                {artworks.map((art) => (
                  <CommandItem
                    key={art.id}
                    onSelect={() => toggleSelect(art.id)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      checked={value.includes(art.id)}
                      onCheckedChange={() => toggleSelect(art.id)}
                    />
                    {art.images?.length ? (
                      <img
                        src={art.images[0]}
                        alt={art.title}
                        className="size-12 rounded border object-cover"
                      />
                    ) : (
                      <div className="size-12 rounded border bg-muted flex items-center justify-center">
                        <PaletteIcon className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 truncate">
                      <span className="block truncate font-medium">{art.title}</span>
                      <span className="text-xs text-muted-foreground truncate">
                        <UserIcon className="inline size-3 mr-1" /> {art.author}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedArtworks.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {selectedArtworks.map((art) => (
                <ArtworkSelectItem key={art.id} artwork={art} onRemove={(id) => toggleSelect(id)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {selectedArtworks.length > 0 && (
        <Button size="sm" variant="outline" onClick={() => onChange([])}>
          Remove all artworks
        </Button>
      )}
    </div>
  )
}
