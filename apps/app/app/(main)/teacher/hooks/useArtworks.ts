// React Query
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

// Actions
import { createArtwork } from '../actions/createArtwork';
import { getArtworks } from '../actions/getArtworks';
import { updateArtwork } from "../actions/updateArtwork";
import { deleteArtwork } from "../actions/deleteArtwork";

// Constants
import { type ArtworkFormValues } from '../consants';
import { type Artwork } from '@repo/database';

export function useArtworks() {
  const queryClient = useQueryClient();

  const artworksQuery = useQuery<Artwork[]>({
    queryKey: ['teacher-artworks'],
    queryFn: () => getArtworks(),
  });

  const createArtworkMutation = useMutation({
    mutationFn: (values: ArtworkFormValues) => createArtwork({ values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  const updateArtworkMutation = useMutation({
    mutationFn: ({
      artworkId,
      values
    }: {
      artworkId: string;
      values: ArtworkFormValues;
    }) =>
      updateArtwork({
        artworkId,
        values,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-artworks'] });
    },
  });

  const deleteArtworkMutation = useMutation({
    mutationFn: ({
      artworkId
    }: {
      artworkId: string;
    }) => deleteArtwork({ artworkId }),
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
