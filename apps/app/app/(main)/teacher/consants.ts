// Zod
import { z } from "zod";

// Artwork Form Schema

export const artworkFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author: z.string().min(1, { message: "Author is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  content: z.string().min(1, { message: "Content is required" }),
  images: z.array(z.any()).optional(),
  mediumTags: z.array(z.any()).optional(),
  collocation: z.string().optional(),
  link: z.string().refine((val) => val === '' || /^https?:\/\/.*/.test(val), {
    message: "Link is an invalid URL"
  }).optional(),
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

// Artwork Form Medium Tags

export const MEDIUM_TAGS = [
  { key: 'oil-painting', name: 'Oil Painting' },
  { key: 'acrylic', name: 'Acrylic' },
  { key: 'watercolor', name: 'Watercolor' },
  { key: 'ink', name: 'Ink' },
  { key: 'charcoal', name: 'Charcoal' },
  { key: 'pastel', name: 'Pastel' },
  { key: 'digital-art', name: 'Digital Art' },
  { key: 'mixed-media', name: 'Mixed Media' },
  { key: 'sculpture', name: 'Sculpture' },
  { key: 'ceramics', name: 'Ceramics' },
  { key: 'photography', name: 'Photography' },
  { key: 'printmaking', name: 'Printmaking' },
  { key: 'collage', name: 'Collage' },
  { key: 'installation', name: 'Installation' },
  { key: 'fiber-art', name: 'Fiber Art' },
  { key: 'glass-art', name: 'Glass Art' },
  { key: 'performance-art', name: 'Performance Art' },
  { key: 'video-art', name: 'Video Art' },
  { key: 'sound-art', name: 'Sound Art' },
  { key: 'calligraphy', name: 'Calligraphy' },
];
