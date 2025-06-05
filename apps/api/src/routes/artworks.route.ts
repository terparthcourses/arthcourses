// Express
import { Router } from 'express';

// Controllers
import { artworksController } from '../controllers/artworks.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Router
const router: Router = Router();

router.post('/', asyncHandler(artworksController.createArtwork));
router.get('/', asyncHandler(artworksController.getArtworksByUser));
router.get('/:artworkId', asyncHandler(artworksController.getArtworkById));
router.put('/:artworkId', asyncHandler(artworksController.updateArtwork));
router.delete('/:artworkId', asyncHandler(artworksController.deleteArtwork));

export default router;