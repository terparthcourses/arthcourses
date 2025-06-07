// Utilities
import { api } from "@/lib/api-handler"

// Constants
import type { ArtworkFormValues } from "../consants"

export const createArtwork = async ({
  values
}: {
  values: ArtworkFormValues;
}) => {
  try {
    const uploadedImages: string[] = [];

    if (values.images && values.images.length > 0) {
      for (const image of values.images) {
        const formData = new FormData();

        // Prepare form data
        const file = image.file instanceof File ? image.file : new Blob();
        formData.append('image', file, image.file instanceof File ? image.file.name : 'unknown');

        // Upload the image
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include'
        });

        // Handle failed upload
        if (!response.ok) {
          throw new Error(`Image upload failed: ${response.status}`);
        }

        const data = await response.json();

        // Add uploaded image URL to the list
        if (data.imageUrl) {
          uploadedImages.push(data.imageUrl);
        } else {
          console.error("No imageUrl found in response:", data);
        }
      }
    }

    // Submit the artwork
    await api.post('/api/artworks', {
      title: values.title,
      description: values.description,
      author: values.author,
      content: values.content,
      collocation: values.collocation || "",
      link: values.link || "",
      images: uploadedImages,
      periodTags: [],
      mediumTags: [],
      order: 0
    });
  } catch (error) {
    console.error("Error creating artwork:", error);
  }
}