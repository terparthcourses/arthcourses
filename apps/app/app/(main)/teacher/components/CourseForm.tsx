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

// `ArtworkSelect` Component
import { ArtworkSelect } from "./ArtworkSelect"

// Constants
import {
  courseFormSchema,
  type CourseFormValues,
} from "../consants"
import { type Course } from "@repo/database"

// Lucide Icons
import { LoaderCircle } from "lucide-react"

interface CourseFormProps {
  className?: string;
  onSubmit: any;
  onSubmitType: "create" | "update";
  course?: Course;
}

export function CourseForm({
  className,
  onSubmit,
  onSubmitType,
  course,
}: CourseFormProps) {
  const form = useForm({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      artworkIds: [],
    },
  })

  useEffect(() => {
    if (onSubmitType === "update" && course) {
      form.reset({
        title: course.title || "",
        description: course.description || "",
        artworkIds: (course.artworkIds ?? []) as string[],
      })
    }
  }, [course, form, onSubmitType])

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: CourseFormValues) => {
    console.log(values)

    if (onSubmitType === "create") {
      onSubmit?.({
        values: values,
      });
    } else {
      onSubmit?.({
        course: course,
        values: values,
      });
    }
  }

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
        <form id={`course-${onSubmitType}-form`} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    placeholder="e.g. Renaissance Masters"
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
                    placeholder="Short summary of the course"
                    disabled={onSubmit.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="artworkIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Artworks <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <ArtworkSelect
                    value={field.value}
                    onChange={field.onChange}
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