"use client"

// Zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// Utilities
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
import { MultipleSelect } from "@/components/ui/multi-select"
import { Textarea } from "@/components/ui/textarea"

// React Query
import { UseMutationResult } from "@tanstack/react-query"

// Constants
import {
  artworkFormSchema,
  type ArtworkFormValues,
  MEDIUM_TAGS,
} from "../consants"

interface ArtworkFormProps {
  className?: string;
  onSubmit: UseMutationResult<unknown, Error, ArtworkFormValues, unknown>;
}

export function ArtworkForm({
  className,
  onSubmit,
}: ArtworkFormProps) {

  const form = useForm({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      content: "",
      images: [],
      mediumTags: [],
      collocation: "",
      link: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof artworkFormSchema>) => {
    onSubmit.mutate(values);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Form {...form}>
        <form id="artwork-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            name="mediumTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium Tags</FormLabel>
                <FormControl>
                  <MultipleSelect
                    tags={MEDIUM_TAGS}
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