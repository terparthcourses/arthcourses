// Utilities
import { api } from '@/lib/api-handler'

export async function deleteArtwork(artworkId: string) {
  try {
    // Submit the artwork
    await api.delete(`/api/artworks/${artworkId}`)
  } catch (error) {
    console.error('Error deleting artwork:', error)
  }
}