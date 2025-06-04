// Express
import { Router } from 'express';

// Controllers
import { imagesController } from '../controllers/images.controller';

// Utilities
import { asyncHandler } from '../utils/async-handler';

// Router
const router: Router = Router();

router.get('/:url', asyncHandler(imagesController.getImageByUrl));
router.post('/upload', asyncHandler(imagesController.uploadImage));
router.post('/delete', asyncHandler(imagesController.deleteImage));

export default router;