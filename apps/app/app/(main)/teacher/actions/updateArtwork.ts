// Utilities
import { api } from "@/lib/api-handler"

// Constants
import type { ArtworkFormValues } from "../consants"

export const updateArtwork = async ({
  artworkId,
  values
}: {
  artworkId: string;
  values: ArtworkFormValues;
}) => {
  try {
    const uploadedImages: string[] = [];
    const existingImages: string[] = [];

    if (values.images && values.images.length > 0) {
      for (const image of values.images) {
        if (image && image.file && image.file.url) {
          existingImages.push(image.file.url);
          continue;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('image', image.file instanceof File ? image.file : new Blob());

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

    // Combine all image URLs
    const allImages = [...existingImages, ...uploadedImages];

    // Submit the artwork
    await api.put(`/api/artworks/${artworkId}`, {
      title: values.title,
      description: values.description,
      author: values.author,
      content: values.content,
      collocation: values.collocation || "",
      link: values.link || "",
      images: allImages,
      periodTags: [],
      typeTags: []
    });
  } catch (error) {
    console.error("Error updating artwork:", error);
  }
}