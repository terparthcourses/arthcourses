// Zod
import { z } from 'zod';

// Utilities
import { api } from '@/lib/api-handler';

// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Actions
import { createArtwork } from '../actions/createArtwork';
import { deleteArtwork } from '../actions/deleteArtwork';
import { getArtworks } from '../actions/getArtworks';
import { updateArtwork } from '../actions/updateArtwork';

// Constants
import { artworkFormSchema, type ArtworkFormValues } from '../consants';
import { type Artwork } from '@repo/database';

export function useArtworks() {
  const queryClient = useQueryClient();

  const artworksQuery = useQuery<Artwork[]>({
    queryKey: ['teacher-artworks'],
    queryFn: () => getArtworks(),
  });

  const createArtworkMutation = useMutation({
    mutationFn: (values: ArtworkFormValues) => createArtwork(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  const updateArtworkMutation = useMutation({
    mutationFn: (data: { id: string; values: ArtworkFormValues }) =>
      updateArtwork(data.id, data.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  const deleteArtworkMutation = useMutation({
    mutationFn: (artworkId: string) => deleteArtwork(artworkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  return {
    ...artworksQuery,
    createArtwork: createArtworkMutation,
    updateArtwork: updateArtworkMutation,
    deleteArtwork: deleteArtworkMutation,
  };
}