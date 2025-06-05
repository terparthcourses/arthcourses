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

// Types
import { type Artwork } from '@repo/database';

// Actions
import { createArtwork } from '../actions/createArtwork';

// Constants
import { artworkFormSchema } from '../consants';

export function useArtworks() {
  const queryClient = useQueryClient();

  const artworksQuery = useQuery<Artwork[]>({
    queryKey: ['teacher-artworks'],
    queryFn: () => api.get<Artwork[]>('/api/artworks'),
  });

  const createArtworkMutation = useMutation({
    mutationFn: (values: z.infer<typeof artworkFormSchema>) => createArtwork(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  return {
    ...artworksQuery,
    createArtwork: createArtworkMutation,
  };
}