// Utilities
import { api } from '@/lib/api-handler'

// Constants
import type { Artwork } from "@repo/database"

export async function getArtworks() {
  try {
    const artworks = await api.get<Artwork[]>('/api/artworks')
    return artworks
  } catch (error) {
    console.error('Error getting artworks:', error)
    return []
  }
}
