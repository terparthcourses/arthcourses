"use client"

// React Hooks
import { useEffect, useState } from "react"

// Zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Utilities
import { api } from "@/lib/api-handler"
import { cn } from "@/lib/clsx-handler"

// React Hook Form
import { useForm } from "react-hook-form"

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { InputImage } from "@/components/ui/input.image";
import { Textarea } from "@/components/ui/textarea"

// Constants
import {
  artworkFormSchema,
  type ArtworkFormValues,
} from "../consants"
import { type Artwork, type Image } from "@repo/database"

// Lucide Icons
import { LoaderCircle } from "lucide-react"

interface ArtworkFormProps {
  className?: string;
  onSubmit: any;
  onSubmitType: "create" | "update";
  artwork?: Artwork;
}

export function ArtworkForm({
  className,
  onSubmit,
  onSubmitType,
  artwork,
}: ArtworkFormProps) {
  const form = useForm({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      content: "",
      images: [],
      collocation: "",
      link: "",
    },
  })

  const handleSubmit = async (values: ArtworkFormValues) => {
    if (onSubmitType === "create") {
      onSubmit?.({
        values: values,
      });
    } else {
      onSubmit?.({
        artwork: artwork,
        values: values,
      });
    }
  }

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const populateArtworkForm = async (artwork: Artwork) => {
      setIsLoading(true)

      try {
        const images = []

        if (artwork.images && artwork.images.length > 0) {
          for (const url of artwork.images) {
            const data = await api.get<Image>(`/api/images/${encodeURIComponent(url)}`)

            images.push({
              id: data.id,
              file: {
                id: data.id,
                name: data.name,
                size: data.size || 0,
                type: data.mimeType,
                url: data.url
              },
              preview: data.url
            })
          }
        }

        form.reset({
          title: artwork.title,
          author: artwork.author,
          description: artwork.description,
          content: artwork.content,
          images: images,
          collocation: artwork.collocation || "",
          link: artwork.link || "",
        })
      } catch (err) {
        console.error("Error populating artwork form:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (onSubmitType === "update" && artwork) {
      populateArtworkForm(artwork)
    }
  }, [artwork, form])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 max-h-full">
        <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Form {...form}>
        <form id={`artwork-${onSubmitType}-form`} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Starry Night"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Author <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Vincent van Gogh"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Short summary of the artwork"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Content <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Detailed information, context, or story about the artwork"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <InputImage
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collocation</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Museum of Modern Art, New York"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. https://example.com/artwork"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}